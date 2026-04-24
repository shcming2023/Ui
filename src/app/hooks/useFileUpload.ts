import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useAppStore } from '../../store/appContext';
import type { Material } from '../../store/types';
import { generateNumericIdFromUuid } from '../../utils/id';
 
type UploadProgress = { done: number; total: number; failed: number };
 
export function useFileUpload() {
  const { state, dispatch } = useAppStore();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const hideTimerRef = useRef<number | null>(null);
 
  const validateFile = useCallback((file: File) => {
    const maxSize = (state.mineruConfig.maxFileSize || 0) > 0 ? state.mineruConfig.maxFileSize : 200 * 1024 * 1024;
    if (file.size > maxSize) {
      return { valid: false as const, error: `文件 "${file.name}" 超过上传限制 (最大 ${Math.round(maxSize / (1024 * 1024))}MB)` };
    }
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const supportedExts = new Set(['pdf', 'doc', 'docx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'md']);
    if (!supportedExts.has(ext)) {
      return { valid: false as const, error: `不支持的文件格式: ${file.name}` };
    }
    return { valid: true as const };
  }, [state.mineruConfig.maxFileSize]);
 
  const uploadWithProgress = useCallback((file: File, materialId: number, onProgress: (pct: number) => void) => {
    return new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/__proxy/upload/tasks');
      xhr.responseType = 'json';
      xhr.upload.onprogress = (evt) => {
        if (!evt.lengthComputable) return;
        const pct = Math.max(0, Math.min(100, Math.round((evt.loaded / Math.max(1, evt.total)) * 100)));
        onProgress(pct);
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.response);
        else reject(new Error((xhr.response && (xhr.response as any).error) || xhr.responseText || `HTTP ${xhr.status}`));
      };
      xhr.onerror = () => reject(new Error('网络错误'));
      xhr.onabort = () => reject(new Error('请求已取消'));
      const formData = new FormData();
      formData.append('file', file);
      formData.append('materialId', String(materialId));
      xhr.send(formData);
    });
  }, []);
 
  const upload = useCallback(async (files: File[]) => {
    if (uploading) return;
    const list = Array.from(files || []);
    if (list.length === 0) return;
 
    const invalidFiles = list.filter((f) => !validateFile(f).valid);
    if (invalidFiles.length > 0) toast.error(`发现 ${invalidFiles.length} 个不符合规范的文件被过滤`);
    const validFiles = list.filter((f) => validateFile(f).valid);
    if (validFiles.length === 0) return;
 
    setUploading(true);
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setProgress({ done: 0, total: validFiles.length, failed: 0 });
 
    const items = validFiles.map((file) => {
      const filePath = (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
      const materialId = generateNumericIdFromUuid();
      return { file, filePath, materialId };
    });
 
    const uploadOne = async (it: { file: File; filePath: string; materialId: number }) => {
      let lastEmitAt = 0;
      const emit = async (pct: number) => {
        const now = Date.now();
        if (now - lastEmitAt < 400 && pct !== 100) return;
        lastEmitAt = now;
        void pct;
      };
 
      try {
        await emit(0);
        const uploadResult = await uploadWithProgress(it.file, it.materialId, (pct) => { void emit(pct); });
        const objectName = String(uploadResult?.objectName || '').trim();
        if (!objectName) throw new Error('上传成功但未获得 objectName（未写入 MinIO）');
 
        const now = Date.now();
        const fileName = String(uploadResult?.fileName || it.file.name || '').trim() || it.file.name;
        const title = fileName.replace(/\.[^.]+$/, '');
        const nextMaterial: Material = {
          id: it.materialId,
          title,
          type: (fileName.split('.').pop() || 'FILE').toUpperCase(),
          size: `${(it.file.size / 1024 / 1024).toFixed(1)} MB`,
          sizeBytes: it.file.size,
          uploadTime: '刚刚',
          uploadTimestamp: now,
          status: 'processing',
          mineruStatus: 'pending',
          aiStatus: 'pending',
          tags: [],
          metadata: {
            relativePath: it.filePath,
            objectName,
            fileName,
            provider: uploadResult?.provider,
            mimeType: uploadResult?.mimeType,
            ...(uploadResult?.pages != null ? { pages: String(uploadResult.pages) } : {}),
            ...(uploadResult?.format ? { format: String(uploadResult.format) } : {}),
            processingStage: 'mineru',
            processingMsg: '等待后端队列处理',
            processingProgress: '0',
            processingUpdatedAt: new Date().toISOString(),
          },
          uploader: '当前用户',
        };
        const exists = state.materials.some((m) => m.id === it.materialId);
        if (exists) {
          dispatch({ type: 'UPDATE_MATERIAL', payload: { id: it.materialId, updates: nextMaterial } });
        } else {
          dispatch({ type: 'ADD_MATERIAL', payload: nextMaterial });
        }
 
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setProgress((prev) => (prev ? { ...prev, failed: prev.failed + 1 } : prev));
        toast.error(`上传失败：${it.file.name}`, { description: msg });
      } finally {
        setProgress((prev) => {
          if (!prev) return prev;
          const next = { ...prev, done: prev.done + 1 };
          if (next.done >= next.total) {
            hideTimerRef.current = window.setTimeout(() => {
              setProgress(null);
              hideTimerRef.current = null;
            }, 2000);
          }
          return next;
        });
      }
    };
 
    const concurrency = 3;
    let idx = 0;
    const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
      while (idx < items.length) {
        const current = items[idx];
        idx += 1;
        await uploadOne(current);
      }
    });
    await Promise.all(runners);
 
    setUploading(false);
  }, [dispatch, state.materials, uploadWithProgress, uploading, validateFile]);
 
  return { upload, uploading, progress };
}
