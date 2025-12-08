import { useEffect, useRef, useCallback, useState } from 'react';
import { Project } from '@/types/chart';

const AUTOSAVE_INTERVAL = 5000; // 5 seconds
const VERSION_STORAGE_KEY = 'dataviz_versions';
const MAX_VERSIONS = 20;

export interface ProjectVersion {
  id: string;
  projectId: string;
  timestamp: string;
  name: string;
  snapshot: Project;
}

export function useAutosave(
  project: Project,
  onSave: (project: Project) => void,
  enabled: boolean = true
) {
  const [versions, setVersions] = useState<ProjectVersion[]>([]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const lastSnapshotRef = useRef<string>('');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load versions on mount
  useEffect(() => {
    const stored = localStorage.getItem(VERSION_STORAGE_KEY);
    if (stored) {
      try {
        const allVersions = JSON.parse(stored) as ProjectVersion[];
        setVersions(allVersions.filter(v => v.projectId === project.id));
      } catch {
        setVersions([]);
      }
    }
  }, [project.id]);

  // Create a snapshot string for comparison
  const createSnapshot = useCallback((p: Project): string => {
    return JSON.stringify({ data: p.data, config: p.config });
  }, []);

  // Save a new version
  const saveVersion = useCallback((p: Project, isManual: boolean = false) => {
    const version: ProjectVersion = {
      id: Math.random().toString(36).substring(2, 9),
      projectId: p.id,
      timestamp: new Date().toISOString(),
      name: isManual ? `Manual save` : `Auto-save`,
      snapshot: JSON.parse(JSON.stringify(p)), // Deep clone
    };

    // Get all versions
    const stored = localStorage.getItem(VERSION_STORAGE_KEY);
    let allVersions: ProjectVersion[] = [];
    if (stored) {
      try {
        allVersions = JSON.parse(stored);
      } catch {
        allVersions = [];
      }
    }

    // Add new version and keep only recent ones for this project
    const otherVersions = allVersions.filter(v => v.projectId !== p.id);
    const projectVersions = allVersions
      .filter(v => v.projectId === p.id)
      .slice(-(MAX_VERSIONS - 1));
    
    const updatedVersions = [...otherVersions, ...projectVersions, version];
    localStorage.setItem(VERSION_STORAGE_KEY, JSON.stringify(updatedVersions));

    setVersions([...projectVersions, version]);
    setLastSaved(new Date());
    
    return version;
  }, []);

  // Auto-save effect
  useEffect(() => {
    if (!enabled) return;

    const currentSnapshot = createSnapshot(project);
    
    // Check if there are changes
    if (currentSnapshot === lastSnapshotRef.current) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Schedule save
    saveTimeoutRef.current = setTimeout(() => {
      setIsSaving(true);
      
      // Save project
      onSave({ ...project, updatedAt: new Date().toISOString() });
      
      // Create version
      saveVersion(project, false);
      
      // Update snapshot
      lastSnapshotRef.current = currentSnapshot;
      
      setIsSaving(false);
    }, AUTOSAVE_INTERVAL);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [project, enabled, onSave, createSnapshot, saveVersion]);

  // Manual save
  const manualSave = useCallback(() => {
    setIsSaving(true);
    onSave({ ...project, updatedAt: new Date().toISOString() });
    saveVersion(project, true);
    lastSnapshotRef.current = createSnapshot(project);
    setIsSaving(false);
  }, [project, onSave, saveVersion, createSnapshot]);

  // Restore version
  const restoreVersion = useCallback((versionId: string): Project | null => {
    const version = versions.find(v => v.id === versionId);
    if (!version) return null;
    return version.snapshot;
  }, [versions]);

  // Delete version
  const deleteVersion = useCallback((versionId: string) => {
    const stored = localStorage.getItem(VERSION_STORAGE_KEY);
    if (stored) {
      try {
        const allVersions = JSON.parse(stored) as ProjectVersion[];
        const filtered = allVersions.filter(v => v.id !== versionId);
        localStorage.setItem(VERSION_STORAGE_KEY, JSON.stringify(filtered));
        setVersions(prev => prev.filter(v => v.id !== versionId));
      } catch {
        // Ignore
      }
    }
  }, []);

  // Clear all versions for project
  const clearVersions = useCallback(() => {
    const stored = localStorage.getItem(VERSION_STORAGE_KEY);
    if (stored) {
      try {
        const allVersions = JSON.parse(stored) as ProjectVersion[];
        const filtered = allVersions.filter(v => v.projectId !== project.id);
        localStorage.setItem(VERSION_STORAGE_KEY, JSON.stringify(filtered));
        setVersions([]);
      } catch {
        // Ignore
      }
    }
  }, [project.id]);

  return {
    versions,
    lastSaved,
    isSaving,
    manualSave,
    restoreVersion,
    deleteVersion,
    clearVersions,
  };
}
