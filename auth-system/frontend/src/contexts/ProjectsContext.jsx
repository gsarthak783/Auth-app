import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { projectsAPI, utils } from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

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
    case ActionTypes.SET_PROJECTS:
      return {
        ...state,
        projects: action.payload,
        isLoading: false,
        error: null,
      };
    case ActionTypes.SET_CURRENT_PROJECT:
      return {
        ...state,
        currentProject: action.payload,
        error: null,
      };
    case ActionTypes.ADD_PROJECT:
      return {
        ...state,
        projects: [...state.projects, action.payload],
        error: null,
      };
    case ActionTypes.UPDATE_PROJECT:
      return {
        ...state,
        projects: state.projects.map(project =>
          project._id === action.payload._id ? action.payload : project
        ),
        currentProject: state.currentProject?._id === action.payload._id 
          ? action.payload 
          : state.currentProject,
        error: null,
      };
    case ActionTypes.REMOVE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter(project => project._id !== action.payload),
        currentProject: state.currentProject?._id === action.payload 
          ? null 
          : state.currentProject,
        error: null,
      };
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
      dispatch({ type: ActionTypes.UPDATE_PROJECT, payload: response.project });
      toast.success('API keys regenerated successfully');
      return response.project;
    } catch (error) {
      const errorMessage = utils.getErrorMessage(error);
      toast.error(errorMessage);
      throw error;
    }
  };

  // Add team member
  const addTeamMember = async (projectId, memberData) => {
    try {
      const response = await projectsAPI.addTeamMember(projectId, memberData);
      dispatch({ type: ActionTypes.UPDATE_PROJECT, payload: response.project });
      toast.success(response.message || 'Team member added successfully');
      return response.project;
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
      dispatch({ type: ActionTypes.UPDATE_PROJECT, payload: response.project });
      toast.success(response.message || 'Team member removed successfully');
      return response.project;
    } catch (error) {
      const errorMessage = utils.getErrorMessage(error);
      toast.error(errorMessage);
      throw error;
    }
  };

  // Update team member role
  const updateTeamMemberRole = async (projectId, memberId, role) => {
    try {
      const response = await projectsAPI.updateTeamMemberRole(projectId, memberId, role);
      dispatch({ type: ActionTypes.UPDATE_PROJECT, payload: response.project });
      toast.success(response.message || 'Team member role updated successfully');
      return response.project;
    } catch (error) {
      const errorMessage = utils.getErrorMessage(error);
      toast.error(errorMessage);
      throw error;
    }
  };

  // Set current project (for UI state)
  const setCurrentProject = (project) => {
    dispatch({ type: ActionTypes.SET_CURRENT_PROJECT, payload: project });
  };

  // Clear current project
  const clearCurrentProject = () => {
    dispatch({ type: ActionTypes.SET_CURRENT_PROJECT, payload: null });
  };

  // Get project by ID from state
  const getProjectById = (projectId) => {
    return state.projects.find(project => project._id === projectId) || null;
  };

  // Check if user owns project
  const isProjectOwner = (project, userId) => {
    return project?.owner === userId || project?.owner?._id === userId;
  };

  // Check if user is admin of project
  const isProjectAdmin = (project, userId) => {
    if (isProjectOwner(project, userId)) return true;
    return project?.team?.some(member => 
      (member.userId === userId || member.userId?._id === userId) && member.role === 'admin'
    );
  };

  // Check if user is member of project
  const isProjectMember = (project, userId) => {
    if (isProjectOwner(project, userId)) return true;
    return project?.team?.some(member => 
      member.userId === userId || member.userId?._id === userId
    );
  };

  // Get user role in project
  const getUserRoleInProject = (project, userId) => {
    if (isProjectOwner(project, userId)) return 'owner';
    const member = project?.team?.find(member => 
      member.userId === userId || member.userId?._id === userId
    );
    return member?.role || null;
  };

  // Context value
  const value = {
    // State
    projects: state.projects,
    currentProject: state.currentProject,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    loadProjects,
    createProject,
    getProject,
    updateProject,
    deleteProject,
    getProjectStats,
    regenerateApiKeys,

    // Team management
    addTeamMember,
    removeTeamMember,
    updateTeamMemberRole,

    // UI helpers
    setCurrentProject,
    clearCurrentProject,
    getProjectById,

    // Permission helpers
    isProjectOwner,
    isProjectAdmin,
    isProjectMember,
    getUserRoleInProject,

    // Error handling
    clearError: () => dispatch({ type: ActionTypes.CLEAR_ERROR }),
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