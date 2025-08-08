import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { projectsAPI, utils } from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

// Helper to safely get a project id from different shapes
const getProjectId = (project) => (project?.id || project?._id || '');

// Initial state
const initialState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_PROJECTS: 'SET_PROJECTS',
  SET_CURRENT_PROJECT: 'SET_CURRENT_PROJECT',
  ADD_PROJECT: 'ADD_PROJECT',
  UPDATE_PROJECT: 'UPDATE_PROJECT',
  REMOVE_PROJECT: 'REMOVE_PROJECT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const projectsReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case ActionTypes.SET_PROJECTS: {
      const normalized = (action.payload || []).map((p) => ({ ...p, id: getProjectId(p) }));
      return {
        ...state,
        projects: normalized,
        isLoading: false,
        error: null,
      };
    }
    case ActionTypes.SET_CURRENT_PROJECT: {
      const current = action.payload ? { ...action.payload, id: getProjectId(action.payload) } : null;
      return {
        ...state,
        currentProject: current,
        error: null,
      };
    }
    case ActionTypes.ADD_PROJECT: {
      const toAdd = { ...action.payload, id: getProjectId(action.payload) };
      return {
        ...state,
        projects: [...state.projects, toAdd],
        error: null,
      };
    }
    case ActionTypes.UPDATE_PROJECT: {
      const updated = { ...action.payload, id: getProjectId(action.payload) };
      const updatedId = getProjectId(updated);
      return {
        ...state,
        projects: state.projects.map((project) =>
          getProjectId(project) === updatedId ? { ...project, ...updated } : project
        ),
        currentProject:
          state.currentProject && getProjectId(state.currentProject) === updatedId
            ? { ...state.currentProject, ...updated }
            : state.currentProject,
        error: null,
      };
    }
    case ActionTypes.REMOVE_PROJECT: {
      const removeId = action.payload; // can be id or _id string
      return {
        ...state,
        projects: state.projects.filter((project) => getProjectId(project) !== removeId),
        currentProject:
          state.currentProject && getProjectId(state.currentProject) === removeId
            ? null
            : state.currentProject,
        error: null,
      };
    }
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
const ProjectsContext = createContext();

// Projects provider component
export const ProjectsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(projectsReducer, initialState);
  const { isAuthenticated, refreshUser } = useAuth();

  // Load projects when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
    } else {
      // Clear projects when user logs out
      dispatch({ type: ActionTypes.SET_PROJECTS, payload: [] });
      dispatch({ type: ActionTypes.SET_CURRENT_PROJECT, payload: null });
    }
  }, [isAuthenticated]);

  // Load all projects
  const loadProjects = async () => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const response = await projectsAPI.getProjects();
      // Ensure normalized ids
      dispatch({ type: ActionTypes.SET_PROJECTS, payload: response.projects || [] });
    } catch (error) {
      const errorMessage = utils.getErrorMessage(error);
      dispatch({ type: ActionTypes.SET_ERROR, payload: errorMessage });
    }
  };

  // Create new project
  const createProject = async (projectData) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const response = await projectsAPI.createProject(projectData);
      dispatch({ type: ActionTypes.ADD_PROJECT, payload: response.project });
      
      // Refresh user data to update project count
      await refreshUser();
      
      toast.success(response.message || 'Project created successfully!');
      return response.project;
    } catch (error) {
      const errorMessage = utils.getErrorMessage(error);
      dispatch({ type: ActionTypes.SET_ERROR, payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  // Get single project details
  const getProject = async (projectId) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const response = await projectsAPI.getProject(projectId);
      dispatch({ type: ActionTypes.SET_CURRENT_PROJECT, payload: response.project });
      return response.project;
    } catch (error) {
      const errorMessage = utils.getErrorMessage(error);
      dispatch({ type: ActionTypes.SET_ERROR, payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  // Update project
  const updateProject = async (projectId, projectData) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const response = await projectsAPI.updateProject(projectId, projectData);
      dispatch({ type: ActionTypes.UPDATE_PROJECT, payload: response.project });
      toast.success(response.message || 'Project updated successfully!');
      return response.project;
    } catch (error) {
      const errorMessage = utils.getErrorMessage(error);
      dispatch({ type: ActionTypes.SET_ERROR, payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  // Delete project
  const deleteProject = async (projectId) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      await projectsAPI.deleteProject(projectId);
      dispatch({ type: ActionTypes.REMOVE_PROJECT, payload: projectId });
      
      // Refresh user data to update project count
      await refreshUser();
      
      toast.success('Project deleted successfully');
    } catch (error) {
      const errorMessage = utils.getErrorMessage(error);
      dispatch({ type: ActionTypes.SET_ERROR, payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  // Get project statistics
  const getProjectStats = async (projectId) => {
    try {
      const response = await projectsAPI.getProjectStats(projectId);
      return response.stats;
    } catch (error) {
      const errorMessage = utils.getErrorMessage(error);
      toast.error(errorMessage);
      throw error;
    }
  };

  // Regenerate API keys
  const regenerateApiKeys = async (projectId) => {
    try {
      const response = await projectsAPI.regenerateApiKeys(projectId);
      // Update the project in state with new apiKey
      dispatch({ type: ActionTypes.UPDATE_PROJECT, payload: { id: projectId, apiKey: response.apiKey } });
      toast.success('API keys regenerated successfully');
      return response.project;
    } catch (error) {
      const errorMessage = utils.getErrorMessage(error);
      toast.error(errorMessage);
      throw error;
    }
  };

  // Add team member
  const addTeamMember = async (projectId, userIdOrEmail, role = 'member', permissions = []) => {
    try {
      const response = await projectsAPI.addTeamMember(projectId, { userIdOrEmail, role, permissions });
      toast.success(response.message || 'Team member added successfully');
      return response.user;
    } catch (error) {
      const errorMessage = utils.getErrorMessage(error);
      toast.error(errorMessage);
      throw error;
    }
  };

  // Remove team member
  const removeTeamMember = async (projectId, memberId) => {
    try {
      const response = await projectsAPI.removeTeamMember(projectId, memberId);
      toast.success(response.message || 'Team member removed successfully');
      return true;
    } catch (error) {
      const errorMessage = utils.getErrorMessage(error);
      toast.error(errorMessage);
      throw error;
    }
  };

  // Update team member role
  const updateTeamMemberRole = async (projectId, memberId, role, permissions = []) => {
    try {
      const response = await projectsAPI.updateTeamMemberRole(projectId, memberId, { role, permissions });
      toast.success(response.message || 'Team member role updated successfully');
      return true;
    } catch (error) {
      const errorMessage = utils.getErrorMessage(error);
      toast.error(errorMessage);
      throw error;
    }
  };

  // Context value
  const value = {
    projects: state.projects,
    currentProject: state.currentProject,
    isLoading: state.isLoading,
    error: state.error,

    loadProjects,
    createProject,
    getProject,
    updateProject,
    deleteProject,
    getProjectStats,
    regenerateApiKeys,
    addTeamMember,
    removeTeamMember,
    updateTeamMemberRole,
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};

// Custom hook to use projects context
export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};

export default ProjectsContext;