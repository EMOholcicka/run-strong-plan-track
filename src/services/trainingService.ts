
import { supabase } from '@/integrations/supabase/client';
import { Training, PlannedTraining, TrainingType, Exercise } from '@/types/training';

export class TrainingService {
  async getTrainings(): Promise<Training[]> {
    const { data: trainings, error } = await supabase
      .from('trainings')
      .select(`
        *,
        exercises (*)
      `)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching trainings:', error);
      throw error;
    }

    return trainings?.map(training => ({
      id: training.id,
      userId: training.user_id,
      title: training.title,
      type: training.type as TrainingType,
      date: training.date,
      duration: training.duration,
      distance: training.distance || undefined,
      pace: training.pace || undefined,
      calories: training.calories || undefined,
      notes: training.notes || undefined,
      heartRateAvg: training.heart_rate_avg || undefined,
      heartRateMax: training.heart_rate_max || undefined,
      exercises: training.exercises?.map((exercise: any) => ({
        id: exercise.id,
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight || undefined,
      })) || [],
      createdAt: training.created_at,
      updatedAt: training.updated_at,
    })) || [];
  }

  async getTrainingById(id: string): Promise<Training> {
    const { data: training, error } = await supabase
      .from('trainings')
      .select(`
        *,
        exercises (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching training:', error);
      throw error;
    }

    if (!training) {
      throw new Error('Training not found');
    }

    return {
      id: training.id,
      userId: training.user_id,
      title: training.title,
      type: training.type as TrainingType,
      date: training.date,
      duration: training.duration,
      distance: training.distance || undefined,
      pace: training.pace || undefined,
      calories: training.calories || undefined,
      notes: training.notes || undefined,
      heartRateAvg: training.heart_rate_avg || undefined,
      heartRateMax: training.heart_rate_max || undefined,
      exercises: training.exercises?.map((exercise: any) => ({
        id: exercise.id,
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight || undefined,
      })) || [],
      createdAt: training.created_at,
      updatedAt: training.updated_at,
    };
  }

  async createTraining(trainingData: Omit<Training, 'id' | 'createdAt' | 'updatedAt'>): Promise<Training> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to create training');
    }

    const { data: training, error } = await supabase
      .from('trainings')
      .insert({
        user_id: user.id,
        title: trainingData.title,
        type: trainingData.type,
        date: trainingData.date,
        duration: trainingData.duration,
        distance: trainingData.distance,
        pace: trainingData.pace,
        calories: trainingData.calories,
        notes: trainingData.notes,
        heart_rate_avg: trainingData.heartRateAvg,
        heart_rate_max: trainingData.heartRateMax,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating training:', error);
      throw error;
    }

    // If there are exercises, create them
    if (trainingData.exercises && trainingData.exercises.length > 0) {
      const { error: exercisesError } = await supabase
        .from('exercises')
        .insert(
          trainingData.exercises.map(exercise => ({
            training_id: training.id,
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
          }))
        );

      if (exercisesError) {
        console.error('Error creating exercises:', exercisesError);
        throw exercisesError;
      }
    }

    return this.getTrainingById(training.id);
  }

  async updateTraining(id: string, updates: Partial<Training>): Promise<Training> {
    const { data: training, error } = await supabase
      .from('trainings')
      .update({
        title: updates.title,
        type: updates.type,
        date: updates.date,
        duration: updates.duration,
        distance: updates.distance,
        pace: updates.pace,
        calories: updates.calories,
        notes: updates.notes,
        heart_rate_avg: updates.heartRateAvg,
        heart_rate_max: updates.heartRateMax,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating training:', error);
      throw error;
    }

    return this.getTrainingById(id);
  }

  async deleteTraining(id: string): Promise<void> {
    const { error } = await supabase
      .from('trainings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting training:', error);
      throw error;
    }
  }

  async getPlannedTrainings(): Promise<PlannedTraining[]> {
    const { data: plannedTrainings, error } = await supabase
      .from('planned_trainings')
      .select('*')
      .order('planned_date', { ascending: true });

    if (error) {
      console.error('Error fetching planned trainings:', error);
      throw error;
    }

    return plannedTrainings?.map(planned => ({
      id: planned.id,
      userId: planned.user_id,
      title: planned.title,
      type: planned.type as TrainingType,
      plannedDate: planned.planned_date,
      plannedDuration: planned.planned_duration || undefined,
      plannedDistance: planned.planned_distance || undefined,
      notes: planned.notes || undefined,
      completed: planned.completed || false,
      completedTrainingId: planned.completed_training_id || undefined,
      createdAt: planned.created_at,
      updatedAt: planned.updated_at,
    })) || [];
  }

  async createPlannedTraining(plannedData: Omit<PlannedTraining, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlannedTraining> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to create planned training');
    }

    const { data: planned, error } = await supabase
      .from('planned_trainings')
      .insert({
        user_id: user.id,
        title: plannedData.title,
        type: plannedData.type,
        planned_date: plannedData.plannedDate,
        planned_duration: plannedData.plannedDuration,
        planned_distance: plannedData.plannedDistance,
        notes: plannedData.notes,
        completed: plannedData.completed,
        completed_training_id: plannedData.completedTrainingId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating planned training:', error);
      throw error;
    }

    return {
      id: planned.id,
      userId: planned.user_id,
      title: planned.title,
      type: planned.type as TrainingType,
      plannedDate: planned.planned_date,
      plannedDuration: planned.planned_duration || undefined,
      plannedDistance: planned.planned_distance || undefined,
      notes: planned.notes || undefined,
      completed: planned.completed || false,
      completedTrainingId: planned.completed_training_id || undefined,
      createdAt: planned.created_at,
      updatedAt: planned.updated_at,
    };
  }

  async updatePlannedTraining(id: string, updates: Partial<PlannedTraining>): Promise<PlannedTraining> {
    const { data: planned, error } = await supabase
      .from('planned_trainings')
      .update({
        title: updates.title,
        type: updates.type,
        planned_date: updates.plannedDate,
        planned_duration: updates.plannedDuration,
        planned_distance: updates.plannedDistance,
        notes: updates.notes,
        completed: updates.completed,
        completed_training_id: updates.completedTrainingId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating planned training:', error);
      throw error;
    }

    return {
      id: planned.id,
      userId: planned.user_id,
      title: planned.title,
      type: planned.type as TrainingType,
      plannedDate: planned.planned_date,
      plannedDuration: planned.planned_duration || undefined,
      plannedDistance: planned.planned_distance || undefined,
      notes: planned.notes || undefined,
      completed: planned.completed || false,
      completedTrainingId: planned.completed_training_id || undefined,
      createdAt: planned.created_at,
      updatedAt: planned.updated_at,
    };
  }

  async deletePlannedTraining(id: string): Promise<void> {
    const { error } = await supabase
      .from('planned_trainings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting planned training:', error);
      throw error;
    }
  }
}

export const trainingService = new TrainingService();
