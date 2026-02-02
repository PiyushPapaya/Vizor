import { useState, useCallback, useRef, useEffect } from 'react';
import { ChartData } from '@/types/chart';

interface ParseProgress {
  progress: number;
  message: string;
}

interface ParseStats {
  rows: number;
  columns: number;
  dataPoints: number;
}

interface UseDataParserWorkerResult {
  parseCSV: (content: string) => Promise<ChartData>;
  parseJSON: (content: string) => Promise<ChartData>;
  parseExcel: (buffer: ArrayBuffer) => Promise<ChartData>;
  isLoading: boolean;
  progress: ParseProgress | null;
  stats: ParseStats | null;
  error: string | null;
  cancel: () => void;
}

// Threshold for using worker (smaller files can use main thread)
const WORKER_THRESHOLD_BYTES = 500 * 1024; // 500KB

export function useDataParserWorker(): UseDataParserWorkerResult {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<ParseProgress | null>(null);
  const [stats, setStats] = useState<ParseStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);

  // Clean up worker on unmount
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const createWorker = useCallback(() => {
    // Create worker using Vite's worker syntax
    const worker = new Worker(
      new URL('./data-parser.worker.ts', import.meta.url),
      { type: 'module' }
    );
    return worker;
  }, []);

  const parseWithWorker = useCallback(<T,>(
    type: string,
    payload: T
  ): Promise<ChartData> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setProgress({ progress: 0, message: 'Initializing...' });
      setError(null);
      setStats(null);

      try {
        const worker = createWorker();
        workerRef.current = worker;

        worker.onmessage = (event: MessageEvent) => {
          const { type: responseType, data, error: workerError, progress: prog, message, stats: parseStats } = event.data;

          switch (responseType) {
            case 'progress':
              setProgress({ progress: prog, message });
              break;

            case 'success':
              setStats(parseStats);
              setIsLoading(false);
              setProgress(null);
              worker.terminate();
              workerRef.current = null;
              resolve(data);
              break;

            case 'error':
              setIsLoading(false);
              setProgress(null);
              setError(workerError);
              worker.terminate();
              workerRef.current = null;
              reject(new Error(workerError));
              break;
          }
        };

        worker.onerror = (e) => {
          setIsLoading(false);
          setProgress(null);
          setError(e.message || 'Worker error occurred');
          worker.terminate();
          workerRef.current = null;
          reject(new Error(e.message));
        };

        worker.postMessage({ type, payload });
      } catch (e) {
        setIsLoading(false);
        setProgress(null);
        const errorMsg = e instanceof Error ? e.message : 'Failed to create worker';
        setError(errorMsg);
        reject(new Error(errorMsg));
      }
    });
  }, [createWorker]);

  const parseCSV = useCallback(async (content: string): Promise<ChartData> => {
    // Use main thread for small files
    if (content.length < WORKER_THRESHOLD_BYTES) {
      const { parseCSV: mainThreadParseCSV } = await import('@/lib/data-parser');
      return mainThreadParseCSV(content);
    }
    return parseWithWorker('parseCSV', { content });
  }, [parseWithWorker]);

  const parseJSON = useCallback(async (content: string): Promise<ChartData> => {
    if (content.length < WORKER_THRESHOLD_BYTES) {
      const { parseJSON: mainThreadParseJSON } = await import('@/lib/data-parser');
      return mainThreadParseJSON(content);
    }
    return parseWithWorker('parseJSON', { content });
  }, [parseWithWorker]);

  const parseExcel = useCallback(async (buffer: ArrayBuffer): Promise<ChartData> => {
    if (buffer.byteLength < WORKER_THRESHOLD_BYTES) {
      // For small Excel files, we'll still use the worker since XLSX is heavy
      // but we could fall back to main thread if needed
    }
    return parseWithWorker('parseExcel', { buffer });
  }, [parseWithWorker]);

  const cancel = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    setIsLoading(false);
    setProgress(null);
  }, []);

  return {
    parseCSV,
    parseJSON,
    parseExcel,
    isLoading,
    progress,
    stats,
    error,
    cancel,
  };
}
