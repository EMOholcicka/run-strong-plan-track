import { mockApiService } from './mockApiService';
import { apiService } from './apiService';
import { Training, PlannedTraining } from '@/types/training';

// Configuration flag to switch between mock and real API
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

console.log('WeeklyPlanService USE_MOCK_DATA:', USE_MOCK_DATA);

export class WeeklyPlanService {
  private get service() {
    const selectedService = USE_MOCK_DATA ? mockApiService : apiService;
    console.log('WeeklyPlanService selected service:', USE_MOCK_DATA ? 'mockApiService' : 'apiService');
    return selectedService;
  }

  // Get today's planned trainings
  async getTodaysPlannedTrainings(): Promise<PlannedTraining[]> {
    const today = new Date().toISOString().split('T')[0];
    console.log('WeeklyPlanService.getTodaysPlannedTrainings called for date:', today);
    const service = this.service;
    
    try {
      const allPlanned = await service.getPlannedTrainings();
      const todaysPlanned = allPlanned.filter(planned => {
        return planned.plannedDate === today && !planned.completed;
      });
      console.log('Found today\'s planned trainings:', todaysPlanned);
      return todaysPlanned;
    } catch (error) {
      console.error('API service failed, using mock data for today\'s training:', error);
      // Return mock data for today's running and strength training
      const mockTodayTrainings: PlannedTraining[] = [
        {
          id: 'mock-today-1',
          user_id: 'user123',
          title: 'Morning Run',
          type: 'running',
          plannedDate: today,
          plannedDuration: 45,
          plannedDistance: 8.5,
          notes: 'Easy pace recovery run',
          completed: false,
          category: 'aerobic',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'mock-today-2',
          user_id: 'user123',
          title: 'Evening Strength',
          type: 'strength',
          plannedDate: today,
          plannedDuration: 60,
          notes: 'Focus on upper body',
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      return mockTodayTrainings;
    }
  }

  // Get trainings for a specific week
  async getTrainingsForWeek(weekStart: Date, weekEnd: Date): Promise<Training[]> {
    console.log('WeeklyPlanService.getTrainingsForWeek called with:', weekStart, weekEnd);
    const service = this.service;
    
    try {
      const allTrainings = await service.getTrainings();
      return allTrainings.filter(training => {
        const trainingDate = new Date(training.date);
        return trainingDate >= weekStart && trainingDate <= weekEnd;
      });
    } catch (error) {
      console.error('API service failed, falling back to mock service:', error);
      const allTrainings = await mockApiService.getTrainings();
      return allTrainings.filter(training => {
        const trainingDate = new Date(training.date);
        return trainingDate >= weekStart && trainingDate <= weekEnd;
      });
    }
  }

  // Get planned trainings for a specific week
  async getPlannedTrainingsForWeek(weekStart: Date, weekEnd: Date): Promise<PlannedTraining[]> {
    console.log('WeeklyPlanService.getPlannedTrainingsForWeek called with:', weekStart, weekEnd);
    const service = this.service;
    
    try {
      const allPlanned = await service.getPlannedTrainings();
      return allPlanned.filter(planned => {
        const plannedDate = new Date(planned.plannedDate);
        return plannedDate >= weekStart && plannedDate <= weekEnd;
      });
    } catch (error) {
      console.error('API service failed, falling back to mock service:', error);
      const allPlanned = await mockApiService.getPlannedTrainings();
      return allPlanned.filter(planned => {
        const plannedDate = new Date(planned.plannedDate);
        return plannedDate >= weekStart && plannedDate <= weekEnd;
      });
    }
  }

  // Get weekly stats for actual trainings
  async getWeeklyStats(weekStart: Date, weekEnd: Date) {
    const weekTrainings = await this.getTrainingsForWeek(weekStart, weekEnd);
    
    const runningTrainings = weekTrainings.filter(t => t.type === 'running');
    const strengthTrainings = weekTrainings.filter(t => t.type === 'strength');
    
    const totalSessions = weekTrainings.length;
    const totalDistance = runningTrainings.reduce((sum, t) => sum + (t.distance || 0), 0);
    const runningDuration = runningTrainings.reduce((sum, t) => sum + t.duration, 0);
    const strengthDuration = strengthTrainings.reduce((sum, t) => sum + t.duration, 0);
    const totalDuration = weekTrainings.reduce((sum, t) => sum + t.duration, 0);

    return {
      totalSessions,
      totalDistance,
      runningDuration,
      strengthDuration,
      totalDuration
    };
  }

  // Get weekly stats for planned trainings
  async getPlannedWeeklyStats(weekStart: Date, weekEnd: Date) {
    const weekPlanned = await this.getPlannedTrainingsForWeek(weekStart, weekEnd);
    
    const totalSessions = weekPlanned.length;
    const totalPlannedDistance = weekPlanned.reduce((sum, t) => sum + (t.plannedDistance || 0), 0);
    const totalPlannedDuration = weekPlanned.reduce((sum, t) => sum + t.plannedDuration, 0);

    return {
      totalSessions,
      totalPlannedDistance,
      totalPlannedDuration
    };
  }

  // Get week boundaries for a given offset from current week
  getWeekBoundaries(weekOffset: number = 0) {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + 1 + (weekOffset * 7));
    
    const weekStart = new Date(monday);
    const weekEnd = new Date(monday);
    weekEnd.setDate(monday.getDate() + 6);
    
    return { weekStart, weekEnd };
  }

  // Get complete week data (actual + planned stats)
  async getWeekData(weekOffset: number = 0) {
    const { weekStart, weekEnd } = this.getWeekBoundaries(weekOffset);
    
    const [actualStats, plannedStats] = await Promise.all([
      this.getWeeklyStats(weekStart, weekEnd),
      this.getPlannedWeeklyStats(weekStart, weekEnd)
    ]);
    
    return {
      weekStart,
      weekEnd,
      actualStats,
      plannedStats,
      weekOffset
    };
  }

  // Delegated methods for planned trainings management
  async createPlannedTraining(plannedData: Omit<PlannedTraining, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlannedTraining> {
    console.log('WeeklyPlanService.createPlannedTraining called with:', plannedData);
    const service = this.service;
    
    try {
      return await service.createPlannedTraining(plannedData);
    } catch (error) {
      console.error('API service failed, falling back to mock service:', error);
      return await mockApiService.createPlannedTraining(plannedData);
    }
  }

  async updatePlannedTraining(id: string, updates: Partial<PlannedTraining>): Promise<PlannedTraining> {
    const service = this.service;
    
    try {
      return await service.updatePlannedTraining(id, updates);
    } catch (error) {
      console.error('API service failed, falling back to mock service:', error);
      return await mockApiService.updatePlannedTraining(id, updates);
    }
  }

  async deletePlannedTraining(id: string): Promise<void> {
    const service = this.service;
    
    try {
      return await service.deletePlannedTraining(id);
    } catch (error) {
      console.error('API service failed, falling back to mock service:', error);
      return await mockApiService.deletePlannedTraining(id);
    }
  }

  async getAllPlannedTrainings(): Promise<PlannedTraining[]> {
    const service = this.service;
    
    try {
      return await service.getPlannedTrainings();
    } catch (error) {
      console.error('API service failed, using mock data for upcoming trainings:', error);
      // Create mock upcoming training data
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 2);
      const dayAfter2 = new Date();
      dayAfter2.setDate(dayAfter2.getDate() + 3);
      
      const mockUpcomingTrainings: PlannedTraining[] = [
        {
          id: 'mock-upcoming-1',
          user_id: 'user123',
          title: 'Interval Training',
          type: 'running',
          plannedDate: tomorrow.toISOString().split('T')[0],
          plannedDuration: 50,
          plannedDistance: 6.0,
          notes: 'Speed work - 8x400m intervals',
          completed: false,
          category: 'intervals',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'mock-upcoming-2',
          user_id: 'user123',
          title: 'Long Run',
          type: 'running',
          plannedDate: dayAfter.toISOString().split('T')[0],
          plannedDuration: 90,
          plannedDistance: 15.0,
          notes: 'Build endurance - steady pace',
          completed: false,
          category: 'aerobic',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'mock-upcoming-3',
          user_id: 'user123',
          title: 'Recovery Run',
          type: 'running',
          plannedDate: dayAfter2.toISOString().split('T')[0],
          plannedDuration: 30,
          plannedDistance: 5.0,
          notes: 'Easy recovery pace',
          completed: false,
          category: 'aerobic',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      return mockUpcomingTrainings;
    }
  }

  async getAllTrainings(): Promise<Training[]> {
    const service = this.service;
    
    try {
      return await service.getTrainings();
    } catch (error) {
      console.error('API service failed, falling back to mock service:', error);
      return await mockApiService.getTrainings();
    }
  }
}

export const weeklyPlanService = new WeeklyPlanService();
