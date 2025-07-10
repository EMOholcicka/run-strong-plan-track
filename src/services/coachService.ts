import { AuthUser } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface TrainingStats {
  totalTrainings: number;
  totalDuration: number;
  totalDistance: number;
  plannedTrainings: number;
  completedTrainings: number;
  lastTrainingDate?: string;
  typeBreakdown: Record<string, number>;
}

export interface AthleteWithStats extends AuthUser {
  weeklyTrainingStats?: TrainingStats;
  lastWeekStats?: TrainingStats;
  progressIndicator?: {
    percentage: number;
    status: 'on-track' | 'partially-completed' | 'missed-majority';
  };
  tags?: string[];
  coachNotes?: string;
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
      
      // Mock data for testing with enhanced stats
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
          tags: ['Intermediate', 'Race Prep'],
          weeklyTrainingStats: {
            totalTrainings: 4,
            totalDuration: 240,
            totalDistance: 38.6,
            plannedTrainings: 5,
            completedTrainings: 4,
            lastTrainingDate: '2025-01-07',
            typeBreakdown: {
              'Running': 3,
              'Cross Training': 1,
              'Strength': 0
            }
          },
          lastWeekStats: {
            totalTrainings: 5,
            totalDuration: 280,
            totalDistance: 42.1,
            plannedTrainings: 5,
            completedTrainings: 5,
            lastTrainingDate: '2024-12-31',
            typeBreakdown: {
              'Running': 4,
              'Cross Training': 1,
              'Strength': 0
            }
          },
          progressIndicator: {
            percentage: 80,
            status: 'on-track'
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
          tags: ['Beginner', 'Endurance Focus'],
          weeklyTrainingStats: {
            totalTrainings: 3,
            totalDuration: 180,
            totalDistance: 28.5,
            plannedTrainings: 4,
            completedTrainings: 3,
            lastTrainingDate: '2025-01-08',
            typeBreakdown: {
              'Running': 2,
              'Cross Training': 1,
              'Strength': 0
            }
          },
          lastWeekStats: {
            totalTrainings: 2,
            totalDuration: 120,
            totalDistance: 18.2,
            plannedTrainings: 4,
            completedTrainings: 2,
            lastTrainingDate: '2025-01-01',
            typeBreakdown: {
              'Running': 2,
              'Cross Training': 0,
              'Strength': 0
            }
          },
          progressIndicator: {
            percentage: 75,
            status: 'partially-completed'
          }
        },
        {
          id: 'athlete-3',
          email: 'mike@example.com',
          firstName: 'Mike',
          lastName: 'Johnson',
          name: 'Mike Johnson',
          role: 'athlete',
          token: '',
          pending: false,
          registrationDate: '2024-03-10T08:30:00Z',
          assignedCoach: 'coach-1',
          goals: 'Lose 5kg and improve 5K time',
          tags: ['Weight Loss', 'Speed Focus'],
          weeklyTrainingStats: {
            totalTrainings: 2,
            totalDuration: 90,
            totalDistance: 12.4,
            plannedTrainings: 5,
            completedTrainings: 2,
            lastTrainingDate: '2025-01-06',
            typeBreakdown: {
              'Running': 1,
              'Cross Training': 0,
              'Strength': 1
            }
          },
          lastWeekStats: {
            totalTrainings: 1,
            totalDuration: 45,
            totalDistance: 6.2,
            plannedTrainings: 5,
            completedTrainings: 1,
            lastTrainingDate: '2024-12-29',
            typeBreakdown: {
              'Running': 1,
              'Cross Training': 0,
              'Strength': 0
            }
          },
          progressIndicator: {
            percentage: 40,
            status: 'missed-majority'
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

  async updateAthleteTags(athleteId: string, tags: string[]): Promise<void> {
    try {
      await this.apiRequest(`/coach/athlete/${athleteId}/tags`, {
        method: 'PATCH',
        body: JSON.stringify({ tags })
      });
    } catch (error) {
      console.error('API updateAthleteTags failed:', error);
    }
  }

  async addCoachNote(athleteId: string, note: string): Promise<void> {
    try {
      await this.apiRequest(`/coach/athlete/${athleteId}/notes`, {
        method: 'POST',
        body: JSON.stringify({ note, date: new Date().toISOString() })
      });
    } catch (error) {
      console.error('API addCoachNote failed:', error);
    }
  }

  async getAthleteWeeklyPlan(athleteId: string, weekOffset: number = 0): Promise<any> {
    try {
      return await this.apiRequest(`/coach/athlete/${athleteId}/weekly-plan?week_offset=${weekOffset}`);
    } catch (error) {
      console.error('API getAthleteWeeklyPlan failed:', error);
      // Return mock weekly plan data
      return null;
    }
  }

  async updateAthleteTrainingPlan(athleteId: string, planData: any): Promise<void> {
    try {
      await this.apiRequest(`/coach/athlete/${athleteId}/weekly-plan`, {
        method: 'POST',
        body: JSON.stringify(planData)
      });
    } catch (error) {
      console.error('API updateAthleteTrainingPlan failed:', error);
    }
  }
}

export const coachService = new CoachService();