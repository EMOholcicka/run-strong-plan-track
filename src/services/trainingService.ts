import { mockApiService } from './mockApiService';
import { apiService } from './apiService';
import { Training, PlannedTraining } from '@/types/training';

// Configuration flag to switch between mock and real API
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export class TrainingService {
  private get service() {
    return USE_MOCK_DATA ? mockApiService : apiService;
  }

  async getTrainings(): Promise<Training[]> {
    return this.service.getTrainings();
  }

  async getTrainingById(id: string): Promise<Training> {
    return this.service.getTrainingById(id);
  }

  async createTraining(trainingData: Omit<Training, 'id' | 'createdAt' | 'updatedAt'>): Promise<Training> {
    return this.service.createTraining(trainingData);
  }

  async updateTraining(id: string, updates: Partial<Training>): Promise<Training> {
    return this.service.updateTraining(id, updates);
  }

  async deleteTraining(id: string): Promise<void> {
    return this.service.deleteTraining(id);
  }

  async getPlannedTrainings(): Promise<PlannedTraining[]> {
    return this.service.getPlannedTrainings();
  }

  async createPlannedTraining(plannedData: Omit<PlannedTraining, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlannedTraining> {
    return this.service.createPlannedTraining(plannedData);
  }

  async updatePlannedTraining(id: string, updates: Partial<PlannedTraining>): Promise<PlannedTraining> {
    return this.service.updatePlannedTraining(id, updates);
  }

  async deletePlannedTraining(id: string): Promise<void> {
    return this.service.deletePlannedTraining(id);
  }
}

export const trainingService = new TrainingService();
