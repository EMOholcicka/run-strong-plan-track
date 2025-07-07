import { apiClient } from './api';

export interface WeekStats {
  week_offset: number;
  week_start: string;
  week_end: string;
  total_sessions: number;
  running_sessions: number;
  strength_sessions: number;
  total_distance: number;
  running_duration: number;
  strength_duration: number;
  total_duration: number;
  total_load: number;
  total_calories: number;
  weight: string;
}

export interface MicroCycleData {
  weeks: WeekStats[];
  current_week_load: number;
  next_week_planned: number;
  week_over_week_change: number;
}

class MicroCycleService {
  async getMicroCycleData(): Promise<MicroCycleData> {
    console.log('MicroCycleService: Fetching micro cycle data from API');
    
    try {
      const response = await apiClient.get<MicroCycleData>('/micro-cycle');
      
      console.log('MicroCycleService: API response received', response);
      return response.data;
    } catch (error) {
      console.error('MicroCycleService: API call failed, using mock data', error);
      return this.getMockData();
    }
  }

  private getMockData(): MicroCycleData {
    console.log('MicroCycleService: Using mock data');
    
    return {
      weeks: [
        {
          week_offset: -3,
          week_start: this.getWeekStart(-3),
          week_end: this.getWeekEnd(-3),
          total_sessions: 5,
          running_sessions: 3,
          strength_sessions: 2,
          total_distance: 25.5,
          running_duration: 180,
          strength_duration: 120,
          total_duration: 300,
          total_load: 750,
          total_calories: 2400,
          weight: "73.2 kg"
        },
        {
          week_offset: -2,
          week_start: this.getWeekStart(-2),
          week_end: this.getWeekEnd(-2),
          total_sessions: 6,
          running_sessions: 4,
          strength_sessions: 2,
          total_distance: 28.0,
          running_duration: 200,
          strength_duration: 120,
          total_duration: 320,
          total_load: 800,
          total_calories: 2560,
          weight: "73.0 kg"
        },
        {
          week_offset: -1,
          week_start: this.getWeekStart(-1),
          week_end: this.getWeekEnd(-1),
          total_sessions: 5,
          running_sessions: 3,
          strength_sessions: 2,
          total_distance: 22.5,
          running_duration: 165,
          strength_duration: 105,
          total_duration: 270,
          total_load: 675,
          total_calories: 2160,
          weight: "72.8 kg"
        },
        {
          week_offset: 0,
          week_start: this.getWeekStart(0),
          week_end: this.getWeekEnd(0),
          total_sessions: 4,
          running_sessions: 3,
          strength_sessions: 1,
          total_distance: 18.0,
          running_duration: 140,
          strength_duration: 60,
          total_duration: 200,
          total_load: 500,
          total_calories: 1600,
          weight: "72.5 kg"
        },
        {
          week_offset: 1,
          week_start: this.getWeekStart(1),
          week_end: this.getWeekEnd(1),
          total_sessions: 6,
          running_sessions: 4,
          strength_sessions: 2,
          total_distance: 30.0,
          running_duration: 220,
          strength_duration: 120,
          total_duration: 340,
          total_load: 850,
          total_calories: 2720,
          weight: "72.3 kg"
        }
      ],
      current_week_load: 200,
      next_week_planned: 340,
      week_over_week_change: -26
    };
  }

  private getWeekStart(weekOffset: number): string {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + 1 + (weekOffset * 7));
    return monday.toISOString().split('T')[0];
  }

  private getWeekEnd(weekOffset: number): string {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + 1 + (weekOffset * 7));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return sunday.toISOString().split('T')[0];
  }
}

export const microCycleService = new MicroCycleService();
