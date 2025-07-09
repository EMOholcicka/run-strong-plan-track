import { AuthUser } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface AthleteWithStats extends AuthUser {
  weeklyTrainingStats?: {
    totalTrainings: number;
    totalDuration: number;
    lastTrainingDate?: string;
  };
}

export class CoachService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('authToken');
  }

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

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  async getAthletes(): Promise<AthleteWithStats[]> {
    try {
      const athletes = await this.apiRequest<AthleteWithStats[]>('/coach/athletes');
      return athletes;
    } catch (error) {
      console.error('API getAthletes failed, using mock data:', error);
      
      // Mock data for testing
      return [
        {
          id: 'athlete-1',
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          name: 'John Doe',
          role: 'athlete',
          token: '',
          pending: false,
          registrationDate: '2024-01-15T10:00:00Z',
          assignedCoach: 'coach-1',
          goals: 'Run 10km under 50 minutes',
          weeklyTrainingStats: {
            totalTrainings: 4,
            totalDuration: 240,
            lastTrainingDate: '2025-01-07'
          }
        },
        {
          id: 'athlete-2',
          email: 'jane@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          name: 'Jane Smith',
          role: 'athlete',
          token: '',
          pending: false,
          registrationDate: '2024-02-20T14:30:00Z',
          assignedCoach: 'coach-1',
          goals: 'Complete first half marathon',
          weeklyTrainingStats: {
            totalTrainings: 3,
            totalDuration: 180,
            lastTrainingDate: '2025-01-08'
          }
        }
      ];
    }
  }

  async getPendingAthletes(): Promise<AuthUser[]> {
    try {
      const pending = await this.apiRequest<AuthUser[]>('/coach/pending-athletes');
      return pending;
    } catch (error) {
      console.error('API getPendingAthletes failed, using mock data:', error);
      
      // Mock pending athletes
      return [
        {
          id: 'pending-1',
          email: 'newathlete@example.com',
          firstName: 'New',
          lastName: 'Athlete',
          name: 'New Athlete',
          role: 'athlete',
          token: '',
          pending: true,
          registrationDate: '2025-01-09T09:00:00Z'
        }
      ];
    }
  }

  async approveAthlete(athleteId: string): Promise<void> {
    try {
      await this.apiRequest(`/coach/approve-athlete/${athleteId}`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('API approveAthlete failed:', error);
      // In real implementation, this would update the athlete status
    }
  }

  async rejectAthlete(athleteId: string): Promise<void> {
    try {
      await this.apiRequest(`/coach/reject-athlete/${athleteId}`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('API rejectAthlete failed:', error);
      // In real implementation, this would delete or mark as rejected
    }
  }

  async updateAthleteGoals(athleteId: string, goals: string): Promise<void> {
    try {
      await this.apiRequest(`/coach/athlete/${athleteId}/goals`, {
        method: 'PATCH',
        body: JSON.stringify({ goals })
      });
    } catch (error) {
      console.error('API updateAthleteGoals failed:', error);
      // Mock implementation would update localStorage or similar
    }
  }
}

export const coachService = new CoachService();