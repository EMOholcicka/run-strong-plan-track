
import { mockApiService } from './mockApiService';
import { apiService } from './apiService';
import { Training, PlannedTraining } from '@/types/training';

// Configuration flag to switch between mock and real API
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

console.log('USE_MOCK_DATA:', USE_MOCK_DATA);
console.log('Environment variables:', import.meta.env);

export class TrainingService {
  private get service() {
    const selectedService = USE_MOCK_DATA ? mockApiService : apiService;
    console.log('Selected service:', USE_MOCK_DATA ? 'mockApiService' : 'apiService');
    return selectedService;
  }

  async getTrainings(limit?: number, offset?: number): Promise<Training[]> {
    console.log('TrainingService.getTrainings called with limit:', limit, 'offset:', offset);
    const service = this.service;
    
    try {
      return await service.getTrainings(limit, offset);
    } catch (error) {
      console.error('API service failed, falling back to mock service:', error);
      // Fallback to mock service if API fails
      return await mockApiService.getTrainings(limit, offset);
    }
  }

  async getTrainingById(id: string): Promise<Training> {
    console.log('TrainingService.getTrainingById called with id:', id);
    const service = this.service;
    
    try {
      return await service.getTrainingById(id);
    } catch (error) {
      console.error('API service failed, falling back to mock service:', error);
      return await mockApiService.getTrainingById(id);
    }
  }

  async createTraining(trainingData: Omit<Training, 'id' | 'createdAt' | 'updatedAt'>): Promise<Training> {
    console.log('TrainingService.createTraining called with:', trainingData);
    const service = this.service;
    
    try {
      return await service.createTraining(trainingData);
    } catch (error) {
      console.error('API service failed, falling back to mock service:', error);
      return await mockApiService.createTraining(trainingData);
    }
  }

  async updateTraining(id: string, updates: Partial<Training>): Promise<Training> {
    const service = this.service;
    
    try {
      return await service.updateTraining(id, updates);
    } catch (error) {
      console.error('API service failed, falling back to mock service:', error);
      return await mockApiService.updateTraining(id, updates);
    }
  }

  async deleteTraining(id: string): Promise<void> {
    const service = this.service;
    
    try {
      return await service.deleteTraining(id);
    } catch (error) {
      console.error('API service failed, falling back to mock service:', error);
      return await mockApiService.deleteTraining(id);
    }
  }

  async getPlannedTrainings(): Promise<PlannedTraining[]> {
    const service = this.service;
    
    try {
      return await service.getPlannedTrainings();
    } catch (error) {
      console.error('API service failed, falling back to mock service:', error);
      return await mockApiService.getPlannedTrainings();
    }
  }

  async createPlannedTraining(plannedData: Omit<PlannedTraining, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlannedTraining> {
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
}

export const trainingService = new TrainingService();
