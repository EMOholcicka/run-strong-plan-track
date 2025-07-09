
// Configuration for API endpoints
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  token: string;
  role: 'athlete' | 'coach';
  pending?: boolean;
  age?: number;
  height?: number;
  weight?: number;
  goals?: string;
  assignedCoach?: string;
  registrationDate?: string;
}

export interface LoginResponse {
  user: AuthUser;
}

export class AuthService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  // Make API request with error handling
  private async apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    console.log('AuthService making API request to:', url);

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    console.log('AuthService.login called with email:', credentials.email);
    
    try {
      // Try real API first
      const response = await this.apiRequest<{ user: AuthUser; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      this.token = response.token;
      localStorage.setItem('authToken', response.token);
      
      return { user: response.user };
    } catch (error) {
      console.error('API login failed, using mock authentication:', error);
      
      // Fallback to mock authentication
      const mockUser: AuthUser = {
        id: 'mock-user-123',
        email: credentials.email,
        name: 'Mock User',
        firstName: 'Mock',
        lastName: 'User',
        token: 'mock-token-' + Date.now(),
        role: 'athlete',
        pending: false,
        registrationDate: new Date().toISOString()
      };

      this.token = mockUser.token;
      localStorage.setItem('authToken', mockUser.token);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      
      return { user: mockUser };
    }
  }

  async signUp(credentials: SignUpRequest): Promise<LoginResponse> {
    console.log('AuthService.signUp called with email:', credentials.email);
    
    try {
      // Try real API first
      const response = await this.apiRequest<{ user: AuthUser; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      this.token = response.token;
      localStorage.setItem('authToken', response.token);
      
      return { user: response.user };
    } catch (error) {
      console.error('API signup failed, using mock authentication:', error);
      
      // Fallback to mock authentication
      const mockUser: AuthUser = {
        id: 'mock-user-' + Date.now(),
        email: credentials.email,
        name: `${credentials.firstName || ''} ${credentials.lastName || ''}`.trim() || 'Mock User',
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        token: 'mock-token-' + Date.now(),
        role: 'athlete',
        pending: true,
        registrationDate: new Date().toISOString()
      };

      this.token = mockUser.token;
      localStorage.setItem('authToken', mockUser.token);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      
      return { user: mockUser };
    }
  }

  async logout(): Promise<void> {
    console.log('AuthService.logout called');
    
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('mockUser');
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    console.log('AuthService.getCurrentUser called');
    
    if (!this.token) {
      return null;
    }

    try {
      // Try real API first
      const user = await this.apiRequest<AuthUser>('/auth/me');
      return user;
    } catch (error) {
      console.error('API getCurrentUser failed, checking mock user:', error);
      
      // Fallback to mock user from localStorage
      const mockUserString = localStorage.getItem('mockUser');
      if (mockUserString) {
        return JSON.parse(mockUserString);
      }
      
      return null;
    }
  }

  async updateProfile(updates: Partial<Pick<AuthUser, 'firstName' | 'lastName' | 'name' | 'age' | 'height' | 'weight' | 'goals'>>): Promise<AuthUser> {
    console.log('AuthService.updateProfile called with:', updates);
    
    if (!this.token) {
      throw new Error('User must be authenticated to update profile');
    }

    try {
      // Try real API first
      const user = await this.apiRequest<AuthUser>('/auth/me', {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      
      return user;
    } catch (error) {
      console.error('API updateProfile failed, updating mock user:', error);
      
      // Fallback to updating mock user
      const mockUserString = localStorage.getItem('mockUser');
      if (mockUserString) {
        const mockUser = JSON.parse(mockUserString);
        const updatedUser = { ...mockUser, ...updates };
        localStorage.setItem('mockUser', JSON.stringify(updatedUser));
        return updatedUser;
      }
      
      throw new Error('No user found to update');
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }
}

export const authService = new AuthService();
