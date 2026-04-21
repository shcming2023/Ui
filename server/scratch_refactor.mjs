import fs from 'fs';
import path from 'path';

const uploadServerPath = path.join(process.cwd(), 'server', 'upload-server.mjs');
const sourceCode = fs.readFileSync(uploadServerPath, 'utf-8');
const lines = sourceCode.split('\n');

function extractLines(startPattern, endPattern) {
  const startLine = lines.findIndex(l => l.includes(startPattern));
  let endLine = -1;
  const charsRegex = new RegExp(endPattern);
  for (let i = startLine; i < lines.length; i++) {
    if (charsRegex.test(lines[i])) {
      endLine = i;
      break;
    }
  }
  if (startLine === -1 || endLine === -1) {
    throw new Error(`Patterns not found: ${startPattern} -> ${endPattern}`);
  }
  const chunk = lines.slice(startLine, endLine + 1).map(l => {
    if (l.startsWith('function ')) return 'export ' + l;
    if (l.startsWith('const ') && l.includes('gradioInfoCache')) return l; // Keep the cache un-exported, wait, we don't care
    if (l.startsWith('async function ')) return 'export ' + l;
    return l;
  }).join('\n');

  lines.splice(startLine, endLine - startLine + 1);
  return chunk;
}

// Extract `dockerRewriteEndpoint` (lines 496 to 518)
const chunkDocker = extractLines('function normalizeEndpoint', 'return apiEndpoint;');
// remove the closing brace for `dockerRewriteEndpoint`
const closingBrace1 = lines.findIndex(l => l === '}');
lines.splice(closingBrace1, 1);

// wait the chunk is more complex, just search exactly
let mineruClientCode = `import fs from 'fs';\n\n`;

function extractFunction(name) {
  const start = lines.findIndex(l => l.includes(`function ${name}(`) || l.includes(`const ${name} =`));
  let braceCount = 0;
  let end = -1;
  for(let i=start; i<lines.length; i++) {
    const l = lines[i];
    if (l.includes('{')) braceCount += (l.match(/\{/g) || []).length;
    if (l.includes('}')) braceCount -= (l.match(/\}/g) || []).length;
    if (braceCount === 0 && i !== start) {
      end = i;
      break;
    }
  }
  const extracted = lines.slice(start, end + 1).join('\n');
  lines.splice(start, end - start + 1);
  // add export
  if (extracted.startsWith('function') || extracted.startsWith('async function')) {
    mineruClientCode += 'export ' + extracted + '\n\n';
  } else {
    mineruClientCode += extracted + '\n\n';
  }
}

const fnsToExtract = [
  'normalizeEndpoint',
  'dockerRewriteEndpoint',
  'isEnabledFlag',
  'extractLocalMarkdown',
  'gradioInfoCache',     // Wait this is a const! Better do it manually.
  'fetchGradioInfo',
  'resolveGradioOcrLanguage',
  'uploadFileToGradio',
  'readSseFinalData',
  'callGradioToMarkdown',
  'createMultipartStream',
  'waitMinerUTask',
  'fetchMinerUTaskStatus',
  'fetchMinerUResult'
];

try {
  for (const fn of fnsToExtract) {
    if (fn === 'gradioInfoCache') {
       const start = lines.findIndex(l => l.includes('const gradioInfoCache'));
       lines.splice(start, 1);
       mineruClientCode += `const gradioInfoCache = new Map();\n\n`;
    } else {
       extractFunction(fn);
    }
  }

  // Insert the import to upload-server.mjs
  const importLine = `import { normalizeEndpoint, dockerRewriteEndpoint, isEnabledFlag, extractLocalMarkdown, callGradioToMarkdown, createMultipartStream, waitMinerUTask, fetchMinerUResult } from './services/mineru/mineru-client.mjs';`;
  lines.splice(47, 0, importLine);

  fs.writeFileSync(path.join(process.cwd(), 'server', 'services', 'mineru', 'mineru-client.mjs'), mineruClientCode, 'utf-8');
  fs.writeFileSync(uploadServerPath, lines.join('\n'), 'utf-8');

  console.log("Refactoring done!");
} catch(e) {
  console.error(e);
}
