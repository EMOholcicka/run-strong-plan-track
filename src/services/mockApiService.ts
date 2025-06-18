
import { Training, PlannedTraining, TrainingType, RunningCategory } from '@/types/training';

// Mock data for development
const mockTrainings: Training[] = [
  {
    id: '1',
    userId: 'user1',
    title: 'Morning Run',
    type: 'running',
    date: '2025-01-15',
    duration: 45,
    distance: 8.5,
    pace: '5:30',
    calories: 420,
    trainerNotes: 'Good pace, maintain form',
    traineeNotes: 'Felt strong throughout',
    heartRateAvg: 150,
    heartRateMax: 165,
    exercises: [],
    stravaLink: 'https://strava.com/activities/123',
    garminLink: 'https://garmin.com/activities/456',
    category: 'aerobic',
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-01-15T08:00:00Z'
  },
  {
    id: '2',
    userId: 'user1',
    title: 'Strength Training',
    type: 'strength',
    date: '2025-01-14',
    duration: 60,
    calories: 300,
    trainerNotes: 'Focus on form over weight',
    traineeNotes: 'Challenging but manageable',
    exercises: [
      { id: '1', name: 'Squats', sets: 3, reps: 12, weight: 80 },
      { id: '2', name: 'Bench Press', sets: 3, reps: 10, weight: 70 }
    ],
    createdAt: '2025-01-14T18:00:00Z',
    updatedAt: '2025-01-14T18:00:00Z'
  }
];

const mockPlannedTrainings: PlannedTraining[] = [
  {
    id: '1',
    userId: 'user1',
    title: 'Evening Run',
    type: 'running',
    plannedDate: '2025-01-16',
    plannedDuration: 30,
    plannedDistance: 5,
    notes: 'Easy recovery run',
    completed: false,
    category: 'aerobic',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z'
  },
  {
    id: '2',
    userId: 'user1',
    title: 'Interval Training',
    type: 'running',
    plannedDate: '2025-01-17',
    plannedDuration: 40,
    plannedDistance: 6,
    notes: '5x1000m at 5K pace',
    completed: false,
    category: 'intervals',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z'
  }
];

export class MockApiService {
  private trainings: Training[] = [...mockTrainings];
  private plannedTrainings: PlannedTraining[] = [...mockPlannedTrainings];

  // Training methods
  async getTrainings(): Promise<Training[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve([...this.trainings]), 100);
    });
  }

  async getTrainingById(id: string): Promise<Training> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const training = this.trainings.find(t => t.id === id);
        if (training) {
          resolve(training);
        } else {
          reject(new Error('Training not found'));
        }
      }, 100);
    });
  }

  async createTraining(trainingData: Omit<Training, 'id' | 'createdAt' | 'updatedAt'>): Promise<Training> {
    return new Promise(resolve => {
      setTimeout(() => {
        const newTraining: Training = {
          ...trainingData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.trainings.push(newTraining);
        resolve(newTraining);
      }, 100);
    });
  }

  async updateTraining(id: string, updates: Partial<Training>): Promise<Training> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.trainings.findIndex(t => t.id === id);
        if (index !== -1) {
          this.trainings[index] = {
            ...this.trainings[index],
            ...updates,
            updatedAt: new Date().toISOString()
          };
          resolve(this.trainings[index]);
        } else {
          reject(new Error('Training not found'));
        }
      }, 100);
    });
  }

  async deleteTraining(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.trainings.findIndex(t => t.id === id);
        if (index !== -1) {
          this.trainings.splice(index, 1);
          resolve();
        } else {
          reject(new Error('Training not found'));
        }
      }, 100);
    });
  }

  // Planned training methods
  async getPlannedTrainings(): Promise<PlannedTraining[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve([...this.plannedTrainings]), 100);
    });
  }

  async createPlannedTraining(plannedData: Omit<PlannedTraining, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlannedTraining> {
    return new Promise(resolve => {
      setTimeout(() => {
        const newPlanned: PlannedTraining = {
          ...plannedData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.plannedTrainings.push(newPlanned);
        resolve(newPlanned);
      }, 100);
    });
  }

  async updatePlannedTraining(id: string, updates: Partial<PlannedTraining>): Promise<PlannedTraining> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.plannedTrainings.findIndex(t => t.id === id);
        if (index !== -1) {
          this.plannedTrainings[index] = {
            ...this.plannedTrainings[index],
            ...updates,
            updatedAt: new Date().toISOString()
          };
          resolve(this.plannedTrainings[index]);
        } else {
          reject(new Error('Planned training not found'));
        }
      }, 100);
    });
  }

  async deletePlannedTraining(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.plannedTrainings.findIndex(t => t.id === id);
        if (index !== -1) {
          this.plannedTrainings.splice(index, 1);
          resolve();
        } else {
          reject(new Error('Planned training not found'));
        }
      }, 100);
    });
  }
}

export const mockApiService = new MockApiService();
