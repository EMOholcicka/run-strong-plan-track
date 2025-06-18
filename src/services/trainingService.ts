
import { mockApiService } from './mockApiService';
import { Training, PlannedTraining } from '@/types/training';

export class TrainingService {
  async getTrainings(): Promise<Training[]> {
    return mockApiService.getTrainings();
  }

  async getTrainingById(id: string): Promise<Training> {
    return mockApiService.getTrainingById(id);
  }

  async createTraining(trainingData: Omit<Training, 'id' | 'createdAt' | 'updatedAt'>): Promise<Training> {
    return mockApiService.createTraining(trainingData);
  }

  async updateTraining(id: string, updates: Partial<Training>): Promise<Training> {
    return mockApiService.updateTraining(id, updates);
  }

  async deleteTraining(id: string): Promise<void> {
    return mockApiService.deleteTraining(id);
  }

  async getPlannedTrainings(): Promise<PlannedTraining[]> {
    return mockApiService.getPlannedTrainings();
  }

  async createPlannedTraining(plannedData: Omit<PlannedTraining, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlannedTraining> {
    return mockApiService.createPlannedTraining(plannedData);
  }

  async updatePlannedTraining(id: string, updates: Partial<PlannedTraining>): Promise<PlannedTraining> {
    return mockApiService.updatePlannedTraining(id, updates);
  }

  async deletePlannedTraining(id: string): Promise<void> {
    return mockApiService.deletePlannedTraining(id);
  }
}

export const trainingService = new TrainingService();
