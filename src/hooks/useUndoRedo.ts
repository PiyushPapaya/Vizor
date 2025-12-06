import { useState, useCallback } from 'react';

interface UseUndoRedoOptions<T> {
  maxHistory?: number;
}

export function useUndoRedo<T>(initialState: T, options: UseUndoRedoOptions<T> = {}) {
  const { maxHistory = 50 } = options;
  
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const state = history[currentIndex];

  const setState = useCallback((newState: T | ((prev: T) => T)) => {
    setHistory(prev => {
      const current = prev[currentIndex];
      const resolved = typeof newState === 'function' 
        ? (newState as (prev: T) => T)(current) 
        : newState;
      
      // Don't add to history if nothing changed
      if (JSON.stringify(resolved) === JSON.stringify(current)) {
        return prev;
      }

      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(resolved);
      
      // Limit history size
      if (newHistory.length > maxHistory) {
        newHistory.shift();
        setCurrentIndex(currentIndex);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
      
      return newHistory;
    });
  }, [currentIndex, maxHistory]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, history.length]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const reset = useCallback((newState: T) => {
    setHistory([newState]);
    setCurrentIndex(0);
  }, []);

  return {
    state,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
    historyLength: history.length,
  };
}
