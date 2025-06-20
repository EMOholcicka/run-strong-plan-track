// Real API service implementation
import { Training, PlannedTraining } from '@/types/training';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('authToken');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    console.log('Making API request to:', url, 'with config:', config);

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Training methods
  async getTrainings(limit?: number, offset?: number): Promise<Training[]> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request<Training[]>(`/trainings${queryString}`);
  }

  async getTrainingById(id: string): Promise<Training> {
    return this.request<Training>(`/trainings/${id}`);
  }

  async createTraining(trainingData: Omit<Training, 'id' | 'createdAt' | 'updatedAt'>): Promise<Training> {
    console.log('ApiService createTraining called with:', trainingData);
    return this.request<Training>('/trainings', {
      method: 'POST',
      body: JSON.stringify(trainingData),
    });
  }

  async updateTraining(id: string, updates: Partial<Training>): Promise<Training> {
    return this.request<Training>(`/trainings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTraining(id: string): Promise<void> {
    return this.request<void>(`/trainings/${id}`, {
      method: 'DELETE',
    });
  }

  // Planned training methods
  async getPlannedTrainings(): Promise<PlannedTraining[]> {
    return this.request<PlannedTraining[]>('/planned-trainings');
  }

  async createPlannedTraining(plannedData: Omit<PlannedTraining, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlannedTraining> {
    return this.request<PlannedTraining>('/planned-trainings', {
      method: 'POST',
      body: JSON.stringify(plannedData),
    });
  }

  async updatePlannedTraining(id: string, updates: Partial<PlannedTraining>): Promise<PlannedTraining> {
    return this.request<PlannedTraining>(`/planned-trainings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deletePlannedTraining(id: string): Promise<void> {
    return this.request<void>(`/planned-trainings/${id}`, {
      method: 'DELETE',
    });
  }

  // Auth methods
  async login(email: string, password: string): Promise<{ user: any; token: string }> {
    return this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, firstName?: string, lastName?: string): Promise<{ user: any; token: string }> {
    return this.request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
  }

  async logout(): Promise<void> {
    return this.request<void>('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<any> {
    return this.request<any>('/auth/me');
  }

  async updateProfile(updates: any): Promise<void> {
    return this.request<void>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }
}

export const apiService = new ApiService();
