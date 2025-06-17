
import { apiClient } from './api';
import { Training, PlannedTraining } from '@/contexts/TrainingContext';

export class TrainingService {
  async getTrainings(): Promise<Training[]> {
    // Mock data for now - replace with actual API call
    return [
      {
        id: '1',
        type: 'running',
        title: 'Morning Run',
        date: '2024-06-15',
        duration: 45,
        distance: 8.5,
        pace: '5:20',
        category: 'aerobic',
        calories: 520,
        heartRate: { avg: 145, max: 162 },
        notes: 'Great morning run, felt strong throughout'
      },
      {
        id: '2',
        type: 'strength',
        title: 'Upper Body Workout',
        date: '2024-06-14',
        duration: 60,
        exercises: [
          { name: 'Bench Press', sets: 4, reps: 8, weight: 80 },
          { name: 'Pull-ups', sets: 3, reps: 12 },
          { name: 'Shoulder Press', sets: 3, reps: 10, weight: 25 }
        ],
        calories: 280,
        notes: 'Increased weight on bench press'
      },
      {
        id: '3',
        type: 'running',
        title: 'Interval Training',
        date: '2024-06-13',
        duration: 35,
        distance: 6.0,
        pace: '4:45',
        category: 'intervals',
        calories: 420,
        heartRate: { avg: 155, max: 178 },
        notes: '6x800m intervals with 2min recovery'
      }
    ];
  }

  async getTrainingById(id: string): Promise<Training | null> {
    const trainings = await this.getTrainings();
    return trainings.find(t => t.id === id) || null;
  }

  async createTraining(training: Omit<Training, 'id'>): Promise<Training> {
    // Mock implementation - replace with actual API call
    const newTraining: Training = {
      ...training,
      id: Date.now().toString()
    };
    return newTraining;
  }

  async updateTraining(id: string, updates: Partial<Training>): Promise<Training> {
    // Mock implementation - replace with actual API call
    const trainings = await this.getTrainings();
    const training = trainings.find(t => t.id === id);
    if (!training) throw new Error('Training not found');
    
    return { ...training, ...updates };
  }

  async deleteTraining(id: string): Promise<void> {
    // Mock implementation - replace with actual API call
    console.log('Deleting training:', id);
  }

  async getPlannedTrainings(): Promise<PlannedTraining[]> {
    // Mock data for now - replace with actual API call
    return [
      {
        id: 'p1',
        date: '2024-06-17',
        type: 'running',
        title: 'Long Run',
        plannedDuration: 90,
        plannedDistance: 15,
        category: 'aerobic',
        notes: 'Easy pace, focus on endurance'
      },
      {
        id: 'p2',
        date: '2024-06-18',
        type: 'strength',
        title: 'Leg Day',
        plannedDuration: 75,
        notes: 'Squats, deadlifts, lunges'
      }
    ];
  }

  async createPlannedTraining(training: Omit<PlannedTraining, 'id'>): Promise<PlannedTraining> {
    // Mock implementation - replace with actual API call
    const newPlannedTraining: PlannedTraining = {
      ...training,
      id: Date.now().toString()
    };
    return newPlannedTraining;
  }

  async updatePlannedTraining(id: string, updates: Partial<PlannedTraining>): Promise<PlannedTraining> {
    // Mock implementation - replace with actual API call
    const plannedTrainings = await this.getPlannedTrainings();
    const training = plannedTrainings.find(t => t.id === id);
    if (!training) throw new Error('Planned training not found');
    
    return { ...training, ...updates };
  }

  async deletePlannedTraining(id: string): Promise<void> {
    // Mock implementation - replace with actual API call
    console.log('Deleting planned training:', id);
  }
}

export const trainingService = new TrainingService();
