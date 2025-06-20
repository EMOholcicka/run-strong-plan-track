
import { Training, PlannedTraining } from '@/types/training';

// Mock data for trainings
const mockTrainings: Training[] = [
  {
    id: '1',
    user_id: 'user1', // Changed from userId to user_id
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
    rating: 8,
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-01-15T08:00:00Z'
  },
  {
    id: '2',
    user_id: 'user1', // Changed from userId to user_id
    title: 'Strength Training',
    type: 'strength',
    date: '2025-01-14',
    duration: 60,
    calories: 300,
    trainerNotes: 'Focus on form over weight',
    traineeNotes: 'Challenging but manageable',
    exercises: [
      {
        id: '1',
        name: 'Squats',
        sets: 3,
        reps: 12,
        weight: 80
      },
      {
        id: '2',
        name: 'Bench Press',
        sets: 3,
        reps: 10,
        weight: 70
      }
    ],
    createdAt: '2025-01-14T18:00:00Z',
    updatedAt: '2025-01-14T18:00:00Z'
  },
  {
    id: '3',
    user_id: 'user1', // Changed from userId to user_id
    title: 'Evening Jog',
    type: 'running',
    date: '2025-01-13',
    duration: 30,
    distance: 5.0,
    pace: '6:00',
    calories: 280,
    exercises: [],
    createdAt: '2025-01-13T19:00:00Z',
    updatedAt: '2025-01-13T19:00:00Z'
  },
  {
    id: '4',
    user_id: 'user1', // Changed from userId to user_id
    title: 'Yoga Session',
    type: 'yoga',
    date: '2025-01-12',
    duration: 45,
    calories: 150,
    traineeNotes: 'Very relaxing session',
    exercises: [],
    createdAt: '2025-01-12T07:00:00Z',
    updatedAt: '2025-01-12T07:00:00Z'
  },
  {
    id: '5',
    user_id: 'user1', // Changed from userId to user_id
    title: 'Cycling',
    type: 'cycling',
    date: '2025-01-11',
    duration: 90,
    distance: 25.0,
    calories: 600,
    exercises: [],
    createdAt: '2025-01-11T16:00:00Z',
    updatedAt: '2025-01-11T16:00:00Z'
  }
];

const mockPlannedTrainings: PlannedTraining[] = [
  {
    id: 'p1',
    user_id: 'user1', // Changed from userId to user_id
    title: 'Long Run',
    type: 'running',
    plannedDate: '2025-01-16',
    plannedDuration: 60,
    plannedDistance: 10.0,
    notes: 'Build endurance',
    completed: false,
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z'
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockApiService {
  async getTrainings(limit?: number, offset?: number): Promise<Training[]> {
    console.log('MockApiService.getTrainings called with limit:', limit, 'offset:', offset);
    await delay(500); // Simulate network delay
    
    let result = [...mockTrainings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (offset) {
      result = result.slice(offset);
    }
    
    if (limit) {
      result = result.slice(0, limit);
    }
    
    return result;
  }

  async getTrainingById(id: string): Promise<Training> {
    await delay(300);
    const training = mockTrainings.find(t => t.id === id);
    if (!training) {
      throw new Error('Training not found');
    }
    return training;
  }

  async createTraining(trainingData: Omit<Training, 'id' | 'createdAt' | 'updatedAt'>): Promise<Training> {
    console.log('MockApiService createTraining called with:', trainingData);
    await delay(500);
    
    const newTraining: Training = {
      ...trainingData,
      id: `mock-${Date.now()}`,
      exercises: trainingData.exercises || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockTrainings.push(newTraining);
    return newTraining;
  }

  async updateTraining(id: string, updates: Partial<Training>): Promise<Training> {
    await delay(300);
    const index = mockTrainings.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Training not found');
    }
    
    mockTrainings[index] = {
      ...mockTrainings[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return mockTrainings[index];
  }

  async deleteTraining(id: string): Promise<void> {
    await delay(300);
    const index = mockTrainings.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Training not found');
    }
    mockTrainings.splice(index, 1);
  }

  // Planned training methods
  async getPlannedTrainings(): Promise<PlannedTraining[]> {
    await delay(400);
    return [...mockPlannedTrainings];
  }

  async createPlannedTraining(plannedData: Omit<PlannedTraining, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlannedTraining> {
    await delay(400);
    const newPlanned: PlannedTraining = {
      ...plannedData,
      id: `planned-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockPlannedTrainings.push(newPlanned);
    return newPlanned;
  }

  async updatePlannedTraining(id: string, updates: Partial<PlannedTraining>): Promise<PlannedTraining> {
    await delay(300);
    const index = mockPlannedTrainings.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Planned training not found');
    }
    
    mockPlannedTrainings[index] = {
      ...mockPlannedTrainings[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return mockPlannedTrainings[index];
  }

  async deletePlannedTraining(id: string): Promise<void> {
    await delay(300);
    const index = mockPlannedTrainings.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Planned training not found');
    }
    mockPlannedTrainings.splice(index, 1);
  }
}

export const mockApiService = new MockApiService();
