

export type TrainingType = 'running' | 'cycling' | 'swimming' | 'strength' | 'yoga' | 'other';

export type RunningCategory = 'aerobic' | 'intervals' | 'tempo' | 'hills';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
}

export interface Training {
  id: string;
  user_id: string; // Changed from userId to user_id for API compatibility
  title: string;
  type: TrainingType;
  date: string;
  duration: number;
  distance?: number;
  pace?: string;
  calories?: number;
  trainerNotes?: string;
  traineeNotes?: string;
  heartRateAvg?: number;
  heartRateMax?: number;
  cadenceAvg?: number;
  cadenceMax?: number;
  altitudeMin?: number;
  altitudeMax?: number;
  altitudeGain?: number;
  altitudeLoss?: number;
  exercises: Exercise[];
  stravaLink?: string;
  garminLink?: string;
  category?: RunningCategory;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlannedTraining {
  id: string;
  user_id: string; // Changed from userId to user_id for API compatibility
  title: string;
  type: TrainingType;
  plannedDate: string;
  plannedDuration: number;
  plannedDistance?: number;
  notes?: string;
  completed: boolean;
  completedTrainingId?: string;
  category?: RunningCategory;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyPlanStats {
  totalPlannedDuration: number;
  totalPlannedDistance: number;
  totalSessions: number;
}

