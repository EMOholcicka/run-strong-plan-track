
export type ActivityType = 
  | 'Easy Run' 
  | 'Intervals' 
  | 'Tempo Run' 
  | 'Long Run' 
  | 'Hill Run' 
  | 'Strength Training' 
  | 'Cross Training' 
  | 'Rest';

export type IntensityLevel = 'Low' | 'Medium' | 'High';

export type TrainingStatus = 'planned' | 'completed' | 'missed';

export interface DayTraining {
  id: string;
  day: string;
  activityType: ActivityType;
  duration?: number; // in minutes
  distance?: number; // in kilometers
  intensity: IntensityLevel;
  heartRateZone?: string;
  rpe?: number; // 1-10 scale
  notes?: string;
  status: TrainingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyPlanData {
  weekOffset: number;
  days: Record<string, DayTraining | null>;
  summary: {
    totalTrainingDays: number;
    plannedTrainingDays: number;
    completedTrainingDays: number;
    missedTrainingDays: number;
    totalDistance: number;
    totalDuration: number;
    trainingLoad: number;
    restDays: number;
    intensityBreakdown: {
      low: number;
      medium: number;
      high: number;
    };
    activityBreakdown: Record<ActivityType, number>;
  };
}
