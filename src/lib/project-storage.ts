import { Project, ChartData, ChartConfig, DEFAULT_CHART_CONFIG } from '@/types/chart';
import { generateId, generateSampleData } from './data-parser';
import { safeSetItem } from './safe-storage';

const STORAGE_KEY = 'dataviz_projects';

export const getProjects = (): Project[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const saveProject = (project: Project): void => {
  const projects = getProjects();
  const existingIndex = projects.findIndex(p => p.id === project.id);
  
  project.updatedAt = new Date().toISOString();
  
  if (existingIndex >= 0) {
    projects[existingIndex] = project;
  } else {
    projects.push(project);
  }

  safeSetItem(STORAGE_KEY, JSON.stringify(projects));
};

export const deleteProject = (id: string): void => {
  const projects = getProjects().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};

export const getProject = (id: string): Project | undefined => {
  return getProjects().find(p => p.id === id);
};

export const createNewProject = (name: string = 'Untitled Project'): Project => {
  const id = generateId();
  return {
    id,
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: {
      labels: [],
      datasets: [],
    },
    config: {
      ...DEFAULT_CHART_CONFIG,
      id,
      name,
    },
  };
};

export const exportProjectToFile = (project: Project): void => {
  const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.name.replace(/\s+/g, '_')}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importProjectFromFile = async (file: File): Promise<Project> => {
  const content = await file.text();
  const project = JSON.parse(content) as Project;
  project.id = generateId(); // Generate new ID to avoid conflicts
  project.createdAt = new Date().toISOString();
  project.updatedAt = new Date().toISOString();
  return project;
};
