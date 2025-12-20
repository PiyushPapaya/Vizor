import { create } from 'zustand';
import { ChartData, ChartConfig } from '@/types/chart';
import { supabase } from '@/lib/supabase';
import { compress, decompress } from 'lz-string';
import { useUserStore } from './userStore';

export interface Project {
  id: string;
  name: string;
  data: ChartData;
  config: ChartConfig;
  created_at: string;
  updated_at: string;
  user_id?: string | null;
  is_template?: boolean;
  tags?: string[];
  description?: string;
  // Cloud sync metadata
  sync_status?: 'synced' | 'pending' | 'conflict' | 'error';
  last_synced_at?: string | null;
  version?: number;
}

interface ProjectState {
  // Projects
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  
  // Actions
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  
  // Local operations
  createProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  duplicateProject: (id: string) => Promise<Project>;
  
  // Cloud operations
  syncProjects: () => Promise<void>;
  syncProject: (id: string) => Promise<void>;
  fetchProjects: () => Promise<void>;
  resolveConflict: (id: string, resolution: 'local' | 'remote' | 'merge') => Promise<void>;
  
  // Migration
  migrateFromLocalStorage: () => Promise<void>;
  
  // Utility
  exportProject: (id: string) => Promise<string>;
  importProject: (json: string) => Promise<Project>;
}

// Helper function to get storage key
const LOCALSTORAGE_KEY = 'dataviz_projects';

// Helper to save to localStorage as backup
const saveToLocalStorage = (projects: Project[]) => {
  try {
    const compressed = compress(JSON.stringify(projects));
    localStorage.setItem(LOCALSTORAGE_KEY, compressed);
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

// Helper to load from localStorage
const loadFromLocalStorage = (): Project[] => {
  try {
    const compressed = localStorage.getItem(LOCALSTORAGE_KEY);
    if (!compressed) return [];
    
    const decompressed = decompress(compressed);
    return decompressed ? JSON.parse(decompressed) : [];
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return [];
  }
};

export const useProjectStore = create<ProjectState>()((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  isSyncing: false,
  error: null,
  
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),
  
  // Create a new project
  createProject: async (projectData) => {
    const { user } = useUserStore.getState();
    
    const newProject: Project = {
      ...projectData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: user?.id || null,
      sync_status: user ? 'pending' : undefined,
      version: 1,
    };
    
    set((state) => ({
      projects: [...state.projects, newProject],
      currentProject: newProject,
    }));
    
    // Save to localStorage
    saveToLocalStorage(get().projects);
    
    // Sync to cloud if user is authenticated
    if (user) {
      await get().syncProject(newProject.id);
    }
    
    return newProject;
  },
  
  // Update an existing project
  updateProject: async (id, updates) => {
    const { user } = useUserStore.getState();
    
    set((state) => {
      const projects = state.projects.map((p) =>
        p.id === id
          ? {
              ...p,
              ...updates,
              updated_at: new Date().toISOString(),
              sync_status: user ? ('pending' as const) : undefined,
              version: (p.version || 1) + 1,
            }
          : p
      );
      
      return {
        projects,
        currentProject: state.currentProject?.id === id
          ? projects.find((p) => p.id === id) || null
          : state.currentProject,
      };
    });
    
    saveToLocalStorage(get().projects);
    
    if (user) {
      await get().syncProject(id);
    }
  },
  
  // Delete a project
  deleteProject: async (id) => {
    const { user } = useUserStore.getState();
    
    // Delete from cloud if authenticated
    if (user) {
      try {
        await supabase.from('projects').delete().eq('id', id);
      } catch (error) {
        console.error('Failed to delete from cloud:', error);
      }
    }
    
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject,
    }));
    
    saveToLocalStorage(get().projects);
  },
  
  // Duplicate a project
  duplicateProject: async (id) => {
    const project = get().projects.find((p) => p.id === id);
    if (!project) throw new Error('Project not found');
    
    return await get().createProject({
      name: `${project.name} (Copy)`,
      data: JSON.parse(JSON.stringify(project.data)),
      config: JSON.parse(JSON.stringify(project.config)),
      tags: project.tags,
      description: project.description,
    });
  },
  
  // Sync all projects to cloud
  syncProjects: async () => {
    const { user } = useUserStore.getState();
    if (!user) return;
    
    set({ isSyncing: true, error: null });
    
    try {
      const pendingProjects = get().projects.filter((p) => p.sync_status === 'pending');
      
      for (const project of pendingProjects) {
        await get().syncProject(project.id);
      }
      
      set({ isSyncing: false });
    } catch (error) {
      set({
        isSyncing: false,
        error: error instanceof Error ? error.message : 'Sync failed',
      });
    }
  },
  
  // Sync a single project to cloud
  syncProject: async (id) => {
    const { user } = useUserStore.getState();
    if (!user) return;
    
    const project = get().projects.find((p) => p.id === id);
    if (!project) return;
    
    try {
      // Check if project exists in cloud
      const { data: existing } = await supabase
        .from('projects')
        .select('version, updated_at')
        .eq('id', id)
        .single();
      
      if (existing && existing.version > (project.version || 1)) {
        // Conflict detected
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, sync_status: 'conflict' } : p
          ),
        }));
        return;
      }
      
      // Upsert to cloud
      const { error } = await supabase.from('projects').upsert({
        id: project.id,
        user_id: user.id,
        name: project.name,
        data: project.data,
        config: project.config,
        tags: project.tags,
        description: project.description,
        version: project.version,
        updated_at: project.updated_at,
      });
      
      if (error) throw error;
      
      // Update sync status
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id
            ? {
                ...p,
                sync_status: 'synced',
                last_synced_at: new Date().toISOString(),
              }
            : p
        ),
      }));
      
      saveToLocalStorage(get().projects);
    } catch (error) {
      console.error('Sync failed:', error);
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? { ...p, sync_status: 'error' } : p
        ),
      }));
    }
  },
  
  // Fetch projects from cloud
  fetchProjects: async () => {
    const { user } = useUserStore.getState();
    
    set({ isLoading: true, error: null });
    
    try {
      if (user) {
        // Fetch from cloud
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });
        
        if (error) throw error;
        
        const cloudProjects = (data || []).map((p: any) => ({
          ...p,
          sync_status: 'synced' as const,
          last_synced_at: new Date().toISOString(),
        }));
        
        // Merge with local projects
        const localProjects = loadFromLocalStorage();
        const localOnlyProjects = localProjects.filter(
          (lp) => !cloudProjects.some((cp) => cp.id === lp.id)
        );
        
        const allProjects = [...cloudProjects, ...localOnlyProjects];
        set({ projects: allProjects, isLoading: false });
        
        saveToLocalStorage(allProjects);
        
        // Sync local-only projects to cloud
        for (const project of localOnlyProjects) {
          await get().syncProject(project.id);
        }
      } else {
        // Load from localStorage only
        const projects = loadFromLocalStorage();
        set({ projects, isLoading: false });
      }
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch projects',
      });
      
      // Fallback to localStorage
      const projects = loadFromLocalStorage();
      set({ projects });
    }
  },
  
  // Resolve conflict
  resolveConflict: async (id, resolution) => {
    const { user } = useUserStore.getState();
    if (!user) return;
    
    const localProject = get().projects.find((p) => p.id === id);
    if (!localProject) return;
    
    try {
      const { data: remoteProject } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (!remoteProject) return;
      
      let resolvedProject: Project;
      
      if (resolution === 'local') {
        resolvedProject = localProject;
      } else if (resolution === 'remote') {
        resolvedProject = remoteProject;
      } else {
        // Merge: prefer local config, remote data
        resolvedProject = {
          ...localProject,
          data: remoteProject.data,
          version: Math.max(localProject.version || 1, remoteProject.version || 1) + 1,
        };
      }
      
      await get().updateProject(id, resolvedProject);
      await get().syncProject(id);
    } catch (error) {
      console.error('Failed to resolve conflict:', error);
    }
  },
  
  // Migrate from localStorage to Supabase
  migrateFromLocalStorage: async () => {
    const { user } = useUserStore.getState();
    if (!user) return;
    
    const localProjects = loadFromLocalStorage();
    
    set({ isLoading: true });
    
    try {
      for (const project of localProjects) {
        await supabase.from('projects').upsert({
          ...project,
          user_id: user.id,
        });
      }
      
      await get().fetchProjects();
      set({ isLoading: false });
    } catch (error) {
      console.error('Migration failed:', error);
      set({ isLoading: false });
    }
  },
  
  // Export project as JSON
  exportProject: async (id) => {
    const project = get().projects.find((p) => p.id === id);
    if (!project) throw new Error('Project not found');
    
    return JSON.stringify(project, null, 2);
  },
  
  // Import project from JSON
  importProject: async (json) => {
    const project = JSON.parse(json);
    
    return await get().createProject({
      name: project.name || 'Imported Project',
      data: project.data,
      config: project.config,
      tags: project.tags,
      description: project.description,
    });
  },
}));
