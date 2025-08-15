// src/api/adminApi.ts

import { getApiUrl, authenticatedFetch } from '@/config/api';

// Career Paths
export const getAllCareerPaths = () => authenticatedFetch('api/careers');
export const createCareerPath = (data: unknown) => authenticatedFetch('api/careers', { method: 'POST', body: JSON.stringify(data) });
export const updateCareerPath = (id: string, data: unknown) => {
  if (!id) return Promise.reject(new Error('Career ID is required for update.'));
  return authenticatedFetch(`api/careers/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};
export const deleteCareerPath = (id: string) => {
  if (!id) return Promise.reject(new Error('Career ID is required for delete.'));
  return authenticatedFetch(`api/careers/${id}`, { method: 'DELETE' });
};

// Skills
export const getAllSkills = () => authenticatedFetch('api/skills');
export const createSkill = (data: unknown) => authenticatedFetch('api/skills', { method: 'POST', body: JSON.stringify(data) });
export const updateSkill = (id: string, data: unknown) => {
  if (!id) return Promise.reject(new Error('Skill ID is required for update.'));
  return authenticatedFetch(`api/skills/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};
export const deleteSkill = (id: string) => {
  if (!id) return Promise.reject(new Error('Skill ID is required for delete.'));
  return authenticatedFetch(`api/skills/${id}`, { method: 'DELETE' });
};

// Learning Materials
export const getAllMaterials = () => authenticatedFetch('api/learning-materials');
export const createMaterial = (data: unknown) => authenticatedFetch('api/learning-materials', { method: 'POST', body: JSON.stringify(data) });
export const updateMaterial = (id: string, data: unknown) => authenticatedFetch(`api/learning-materials/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteMaterial = (id: string) => authenticatedFetch(`api/learning-materials/${id}`, { method: 'DELETE' });

// Quizzes
export const getAllQuizzes = () => authenticatedFetch('api/quiz');
export const createQuiz = (data: unknown) => authenticatedFetch('api/quiz', { method: 'POST', body: JSON.stringify(data) });
export const updateQuiz = (id: string, data: unknown) => {
  if (!id) return Promise.reject(new Error('Quiz ID is required for update.'));
  return authenticatedFetch(`api/quiz/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};
export const deleteQuiz = (id: string) => {
  if (!id) return Promise.reject(new Error('Quiz ID is required for delete.'));
  return authenticatedFetch(`api/quiz/${id}`, { method: 'DELETE' });
};

// Projects (assuming /api/projects exists, otherwise adjust to /api/submissions)
export const getAllProjects = () => authenticatedFetch('api/projects');
export const createProject = (data: unknown) => authenticatedFetch('api/projects', { method: 'POST', body: JSON.stringify(data) });
export const updateProject = (id: string, data: unknown) => {
  if (!id) return Promise.reject(new Error('Project ID is required for update.'));
  return authenticatedFetch(`api/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};
export const deleteProject = (id: string) => {
  if (!id) return Promise.reject(new Error('Project ID is required for delete.'));
  return authenticatedFetch(`api/projects/${id}`, { method: 'DELETE' });
};

// Users
export const getAllUsers = () => authenticatedFetch('api/users');
export const updateUser = (id: string, data: unknown) => {
  if (!id) return Promise.reject(new Error('User ID is required for update.'));
  return authenticatedFetch(`api/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};
export const deleteUser = (id: string) => {
  if (!id) return Promise.reject(new Error('User ID is required for delete.'));
  return authenticatedFetch(`api/users/${id}`, { method: 'DELETE' });
};
