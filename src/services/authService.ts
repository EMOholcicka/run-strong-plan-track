
import { apiClient } from './api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    profile: UserProfile;
  };
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  height?: number;
  weight?: number;
  activityLevel?: string;
  goals?: string;
  stravaConnected?: boolean;
  stravaUserId?: string;
}

export class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // For now, simulate API call with hardcoded user
    if (credentials.username === 'Radek' && credentials.password === 'Radek') {
      const mockResponse: LoginResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: '1',
          username: 'Radek',
          email: 'radek@example.com',
          profile: {
            firstName: 'Radek',
            lastName: 'Test',
            height: 180,
            weight: 75,
            activityLevel: 'active',
            goals: 'Improve running performance'
          }
        }
      };
      
      apiClient.setToken(mockResponse.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
      return mockResponse;
    }
    
    throw new Error('Invalid credentials');
  }

  async logout(): Promise<void> {
    apiClient.setToken(null);
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('authToken') !== null;
  }
}

export const authService = new AuthService();
