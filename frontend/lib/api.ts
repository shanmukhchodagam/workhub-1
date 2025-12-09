import { Task, Employee, CreateTaskRequest, UpdateTaskRequest } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  if (typeof window === 'undefined') return { 'Content-Type': 'application/json' }; // SSR guard
  
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token ? token.substring(0, 50) + '...' : 'No token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  console.log('API Response:', response.status, response.statusText);
  if (!response.ok) {
    const error = await response.text();
    console.error('API Error:', error);
    throw new Error(error || `HTTP ${response.status}`);
  }
  return response.json();
};

export const taskAPI = {
  // Get all tasks with optional filters
  async getTasks(filters?: {
    status?: string;
    assigned_to?: number;
    priority?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await fetch(
      `${API_BASE_URL}/tasks?${params.toString()}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Get a specific task by ID
  async getTask(taskId: number): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  },

  // Create a new task
  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });

    return handleResponse(response);
  },

  // Update a task
  async updateTask(taskId: number, updates: UpdateTaskRequest): Promise<Task> {
    console.log('UpdateTask called:', taskId, updates);
    console.log('API_BASE_URL:', API_BASE_URL);
    
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Fetch error in updateTask:', error);
      throw error;
    }
  },

  // Update only task status (for drag and drop)
  async updateTaskStatus(taskId: number, status: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    return handleResponse(response);
  },

  // Delete a task
  async deleteTask(taskId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  },

  // Get team employees for task assignment
  async getTeamEmployees(): Promise<Employee[]> {
    const response = await fetch(`${API_BASE_URL}/tasks/team/employees`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  },
};

export const employeeAPI = {
  // Get all team employees (alternative endpoint)
  async getTeamEmployees(): Promise<Employee[]> {
    const response = await fetch(`${API_BASE_URL}/auth/team/employees`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  },
};

// React hooks for task management
import { useState, useEffect, useCallback } from 'react';

// Helper function to check if user is authenticated
const isAuthenticated = () => {
  if (typeof window === 'undefined') return false; // SSR guard
  
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  // Check if token is expired (basic check)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch (error) {
    console.error('Invalid token format:', error);
    return false;
  }
};

export const useTasks = (filters?: {
  status?: string;
  assigned_to?: number;
  priority?: string;
  date_from?: string;
  date_to?: string;
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const data = await taskAPI.getTasks(filters);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = useCallback(async (taskData: CreateTaskRequest): Promise<Task> => {
    const newTask = await taskAPI.createTask(taskData);
    await fetchTasks(); // Refresh the list
    return newTask;
  }, [fetchTasks]);

  const updateTask = useCallback(async (taskId: number, updates: Partial<Task>): Promise<void> => {
    // Transform Task partial to UpdateTaskRequest format
    const updateRequest: UpdateTaskRequest = {
      id: taskId,
      ...(updates.title !== undefined && { title: updates.title }),
      ...(updates.description !== undefined && { description: updates.description }),
      ...(updates.status !== undefined && { status: updates.status }),
      ...(updates.priority !== undefined && { priority: updates.priority }),
      ...(updates.assigned_to !== undefined && { assigned_to: updates.assigned_to }),
      ...(updates.due_date !== undefined && { due_date: updates.due_date }),
      ...(updates.location !== undefined && { location: updates.location }),
      ...(updates.estimated_hours !== undefined && { estimated_hours: updates.estimated_hours }),
      ...(updates.tags !== undefined && { tags: updates.tags }),
    };
    
    await taskAPI.updateTask(taskId, updateRequest);
    await fetchTasks(); // Refresh the list
  }, [fetchTasks]);

  const updateTaskStatus = useCallback(async (taskId: number, status: string): Promise<void> => {
    await taskAPI.updateTaskStatus(taskId, status);
    await fetchTasks(); // Refresh the list
  }, [fetchTasks]);

  const deleteTask = useCallback(async (taskId: number): Promise<void> => {
    await taskAPI.deleteTask(taskId);
    await fetchTasks(); // Refresh the list
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
  };
};

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(async () => {
    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const data = await taskAPI.getTeamEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return {
    employees,
    loading,
    error,
    refetch: fetchEmployees,
  };
};

// Standalone updateTask function for use outside of hooks
export const updateTask = async (taskId: number, updates: Partial<Task>): Promise<Task> => {
  const updateRequest: UpdateTaskRequest = {
    id: taskId,
    title: updates.title,
    description: updates.description,
    assigned_to: updates.assigned_to,
    status: updates.status,
    priority: updates.priority,
    due_date: updates.due_date,
    estimated_hours: updates.estimated_hours,
    location: updates.location,
    tags: updates.tags,
  };

  return taskAPI.updateTask(taskId, updateRequest);
};

// Dashboard stats API
export const dashboardAPI = {
  async getStats(): Promise<{
    activeWorkers: number;
    pendingTasks: number;
    ongoingTasks: number;
    completedTasks: number;
    incidents: number;
    totalTasks: number;
  }> {
    console.log('=== Dashboard API Call Debug ===');
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('Window location:', typeof window !== 'undefined' ? window.location.href : 'SSR');
    console.log('Authentication check...');
    
    const authCheck = isAuthenticated();
    console.log('isAuthenticated result:', authCheck);
    
    if (!authCheck) {
      console.log('Authentication failed - checking token...');
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      console.log('Token in localStorage:', token ? token.substring(0, 50) + '...' : 'No token found');
      throw new Error('Not authenticated');
    }
    
    const headers = getAuthHeaders();
    console.log('Headers being sent:', headers);
    console.log('Full URL:', `${API_BASE_URL}/tasks/stats/dashboard`);
    
    try {
      console.log('Making fetch request...');
      const response = await fetch(
        `${API_BASE_URL}/tasks/stats/dashboard`,
        {
          method: 'GET',
          headers: headers,
        }
      );
      
      console.log('Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Success! Data received:', data);
      return data;
    } catch (error) {
      console.error('Fetch error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        type: typeof error
      });
      throw error;
    }
  },
};