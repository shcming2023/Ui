import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { useAppStore } from '../../store/appContext';
import { batchRegisterFiles } from '../components/BatchUploadModal';
 
type UploadProgress = { done: number; total: number; failed: number; succeeded: number };
 
export function useFileUpload() {
  const { state, dispatch } = useAppStore();
  const bp = state.batchProcessing;
 
  const validateFile = useCallback((file: File) => {
    const maxSize = (state.mineruConfig.maxFileSize || 0) > 0 ? state.mineruConfig.maxFileSize : 200 * 1024 * 1024;
    if (file.size > maxSize) {
      return { valid: false as const, error: `文件 "${file.name}" 超过上传限制 (最大 ${Math.round(maxSize / (1024 * 1024))}MB)` };
    }
    if (file.name === '.DS_Store') {
      return { valid: false as const, error: `系统文件已忽略: ${file.name}` };
    }
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const supportedExts = new Set(['pdf', 'doc', 'docx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'md']);
    if (!supportedExts.has(ext)) {
      return { valid: false as const, error: `不支持的文件格式: ${file.name}` };
    }
    return { valid: true as const };
  }, [state.mineruConfig.maxFileSize]);
 
  const upload = useCallback(async (files: File[]) => {
    const list = Array.from(files || []);
    if (list.length === 0) return;
 
    const invalidFiles = list.filter((f) => !validateFile(f).valid);
    const validFiles = list.filter((f) => validateFile(f).valid);
    if (validFiles.length === 0) return;
 
    if (invalidFiles.length > 0) toast.error(`发现 ${invalidFiles.length} 个不符合规范的文件被过滤`);
 
    const items = validFiles.map((file, idx) => {
      const filePath = (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
      const id = `q-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 8)}`;
      return { id, file, filePath };
    });
 
    batchRegisterFiles(items.map((it) => ({ id: it.id, file: it.file })));
    dispatch({
      type: 'BATCH_ADD_FILES',
      payload: {
        items: items.map((it) => ({
          id: it.id,
          fileName: it.file.name,
          fileSize: it.file.size,
          path: it.filePath,
        })),
        openUi: true,
      },
    });
    dispatch({ type: 'BATCH_SET_PAUSED', payload: { paused: false } });
    dispatch({ type: 'BATCH_SET_RUNNING', payload: { running: true } });
  }, [dispatch, validateFile]);

  const uploading = bp.running && !bp.paused;
  const progress = useMemo<UploadProgress | null>(() => {
    if (bp.items.length === 0) return null;
    const done = bp.items.filter((i) => ['completed', 'error', 'skipped'].includes(i.status)).length;
    const failed = bp.items.filter((i) => i.status === 'error').length;
    const succeeded = bp.items.filter((i) => i.status === 'completed').length;
    return { done, total: bp.items.length, failed, succeeded };
  }, [bp.items]);
 
  return { upload, uploading, progress };
}
