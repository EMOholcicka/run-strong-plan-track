
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
    console.log('Selected service:', USE_MOCK_DATA ? 'mockApiService' : 'apiService', selectedService);
    return selectedService;
  }

  async getTrainings(): Promise<Training[]> {
    console.log('TrainingService.getTrainings called');
    return this.service.getTrainings();
  }

  async getTrainingById(id: string): Promise<Training> {
    console.log('TrainingService.getTrainingById called with id:', id);
    return this.service.getTrainingById(id);
  }

  async createTraining(trainingData: Omit<Training, 'id' | 'createdAt' | 'updatedAt'>): Promise<Training> {
    console.log('TrainingService.createTraining called with:', trainingData);
    console.log('Service object:', this.service);
    console.log('Service createTraining method:', this.service.createTraining);
    
    if (!this.service || typeof this.service.createTraining !== 'function') {
      throw new Error('Training service not properly initialized or createTraining method not available');
    }
    
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
