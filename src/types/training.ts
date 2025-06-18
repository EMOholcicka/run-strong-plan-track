
export type TrainingType = 'running' | 'cycling' | 'swimming' | 'strength' | 'yoga' | 'other';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
}

export interface Training {
  id: string;
  userId: string;
  title: string;
  type: TrainingType;
  date: string;
  duration: number;
  distance?: number;
  pace?: string;
  calories?: number;
  notes?: string;
  heartRateAvg?: number;
  heartRateMax?: number;
  exercises?: Exercise[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PlannedTraining {
  id: string;
  userId: string;
  title: string;
  type: TrainingType;
  plannedDate: string;
  plannedDuration?: number;
  plannedDistance?: number;
  notes?: string;
  completed: boolean;
  completedTrainingId?: string;
  createdAt?: string;
  updatedAt?: string;
}
