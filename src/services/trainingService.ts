
import { mockApiService } from './mockApiService';
import { apiService } from './apiService';
import { Training, PlannedTraining } from '@/types/training';

// Configuration flag to switch between mock and real API
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

console.log('USE_MOCK_DATA:', USE_MOCK_DATA);
console.log('Environment variables:', import.meta.env);
console.log('mockApiService:', mockApiService);
console.log('apiService:', apiService);

export class TrainingService {
  private get service() {
    const selectedService = USE_MOCK_DATA ? mockApiService : apiService;
    console.log('Selected service:', USE_MOCK_DATA ? 'mockApiService' : 'apiService');
    console.log('Selected service object:', selectedService);
    console.log('Selected service createTraining method:', selectedService?.createTraining);
    return selectedService;
  }

  async getTrainings(): Promise<Training[]> {
    console.log('TrainingService.getTrainings called');
    const service = this.service;
    if (!service || typeof service.getTrainings !== 'function') {
      console.error('getTrainings method not available on service:', service);
      throw new Error('Training service not properly initialized');
    }
    return service.getTrainings();
  }

  async getTrainingById(id: string): Promise<Training> {
    console.log('TrainingService.getTrainingById called with id:', id);
    const service = this.service;
    if (!service || typeof service.getTrainingById !== 'function') {
      console.error('getTrainingById method not available on service:', service);
      throw new Error('Training service not properly initialized');
    }
    return service.getTrainingById(id);
  }

  async createTraining(trainingData: Omit<Training, 'id' | 'createdAt' | 'updatedAt'>): Promise<Training> {
    console.log('TrainingService.createTraining called with:', trainingData);
    
    const service = this.service;
    console.log('Service object in createTraining:', service);
    console.log('Service createTraining method:', service?.createTraining);
    console.log('Type of service:', typeof service);
    console.log('Service keys:', service ? Object.keys(service) : 'no service');
    
    if (!service) {
      console.error('Service is null or undefined');
      throw new Error('Training service not properly initialized - service is null');
    }
    
    if (typeof service.createTraining !== 'function') {
      console.error('createTraining method not available on service:', service);
      console.error('Available methods:', Object.getOwnPropertyNames(service));
      throw new Error('Training service not properly initialized - createTraining method not available');
    }
    
    return service.createTraining(trainingData);
  }

  async updateTraining(id: string, updates: Partial<Training>): Promise<Training> {
    const service = this.service;
    if (!service || typeof service.updateTraining !== 'function') {
      throw new Error('Training service not properly initialized');
    }
    return service.updateTraining(id, updates);
  }

  async deleteTraining(id: string): Promise<void> {
    const service = this.service;
    if (!service || typeof service.deleteTraining !== 'function') {
      throw new Error('Training service not properly initialized');
    }
    return service.deleteTraining(id);
  }

  async getPlannedTrainings(): Promise<PlannedTraining[]> {
    const service = this.service;
    if (!service || typeof service.getPlannedTrainings !== 'function') {
      throw new Error('Training service not properly initialized');
    }
    return service.getPlannedTrainings();
  }

  async createPlannedTraining(plannedData: Omit<PlannedTraining, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlannedTraining> {
    const service = this.service;
    if (!service || typeof service.createPlannedTraining !== 'function') {
      throw new Error('Training service not properly initialized');
    }
    return service.createPlannedTraining(plannedData);
  }

  async updatePlannedTraining(id: string, updates: Partial<PlannedTraining>): Promise<PlannedTraining> {
    const service = this.service;
    if (!service || typeof service.updatePlannedTraining !== 'function') {
      throw new Error('Training service not properly initialized');
    }
    return service.updatePlannedTraining(id, updates);
  }

  async deletePlannedTraining(id: string): Promise<void> {
    const service = this.service;
    if (!service || typeof service.deletePlannedTraining !== 'function') {
      throw new Error('Training service not properly initialized');
    }
    return service.deletePlannedTraining(id);
  }
}

export const trainingService = new TrainingService();
