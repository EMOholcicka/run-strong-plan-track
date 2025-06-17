
import { supabase } from '@/integrations/supabase/client';
import { Training, PlannedTraining } from '@/contexts/TrainingContext';

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
      type: training.type as 'running' | 'strength' | 'cycling' | 'swimming' | 'yoga' | 'other',
      title: training.title,
      date: training.date,
      duration: training.duration,
      distance: training.distance || undefined,
      pace: training.pace || undefined,
      category: training.type === 'running' ? 'aerobic' : undefined,
      calories: training.calories || undefined,
      heartRate: training.heart_rate_avg && training.heart_rate_max ? {
        avg: training.heart_rate_avg,
        max: training.heart_rate_max
      } : undefined,
      notes: training.notes || undefined,
      exercises: training.exercises?.map((exercise: any) => ({
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight || undefined
      })) || undefined
    })) || [];
  }

  async getTrainingById(id: string): Promise<Training | null> {
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
      return null;
    }

    if (!training) return null;

    return {
      id: training.id,
      type: training.type as 'running' | 'strength' | 'cycling' | 'swimming' | 'yoga' | 'other',
      title: training.title,
      date: training.date,
      duration: training.duration,
      distance: training.distance || undefined,
      pace: training.pace || undefined,
      category: training.type === 'running' ? 'aerobic' : undefined,
      calories: training.calories || undefined,
      heartRate: training.heart_rate_avg && training.heart_rate_max ? {
        avg: training.heart_rate_avg,
        max: training.heart_rate_max
      } : undefined,
      notes: training.notes || undefined,
      exercises: training.exercises?.map((exercise: any) => ({
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight || undefined
      })) || undefined
    };
  }

  async createTraining(training: Omit<Training, 'id'>): Promise<Training> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to create training');
    }

    const { data: newTraining, error } = await supabase
      .from('trainings')
      .insert({
        user_id: user.id,
        title: training.title,
        type: training.type,
        date: training.date,
        duration: training.duration,
        distance: training.distance || null,
        pace: training.pace || null,
        calories: training.calories || null,
        notes: training.notes || null,
        heart_rate_avg: training.heartRate?.avg || null,
        heart_rate_max: training.heartRate?.max || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating training:', error);
      throw error;
    }

    // If there are exercises, insert them
    if (training.exercises && training.exercises.length > 0) {
      const { error: exercisesError } = await supabase
        .from('exercises')
        .insert(
          training.exercises.map(exercise => ({
            training_id: newTraining.id,
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight || null
          }))
        );

      if (exercisesError) {
        console.error('Error creating exercises:', exercisesError);
        throw exercisesError;
      }
    }

    return {
      id: newTraining.id,
      type: newTraining.type as 'running' | 'strength' | 'cycling' | 'swimming' | 'yoga' | 'other',
      title: newTraining.title,
      date: newTraining.date,
      duration: newTraining.duration,
      distance: newTraining.distance || undefined,
      pace: newTraining.pace || undefined,
      category: newTraining.type === 'running' ? 'aerobic' : undefined,
      calories: newTraining.calories || undefined,
      heartRate: newTraining.heart_rate_avg && newTraining.heart_rate_max ? {
        avg: newTraining.heart_rate_avg,
        max: newTraining.heart_rate_max
      } : undefined,
      notes: newTraining.notes || undefined,
      exercises: training.exercises
    };
  }

  async updateTraining(id: string, updates: Partial<Training>): Promise<Training> {
    const { data: updatedTraining, error } = await supabase
      .from('trainings')
      .update({
        title: updates.title,
        type: updates.type,
        date: updates.date,
        duration: updates.duration,
        distance: updates.distance || null,
        pace: updates.pace || null,
        calories: updates.calories || null,
        notes: updates.notes || null,
        heart_rate_avg: updates.heartRate?.avg || null,
        heart_rate_max: updates.heartRate?.max || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating training:', error);
      throw error;
    }

    // Handle exercises updates if provided
    if (updates.exercises) {
      // Delete existing exercises
      await supabase
        .from('exercises')
        .delete()
        .eq('training_id', id);

      // Insert new exercises
      if (updates.exercises.length > 0) {
        const { error: exercisesError } = await supabase
          .from('exercises')
          .insert(
            updates.exercises.map(exercise => ({
              training_id: id,
              name: exercise.name,
              sets: exercise.sets,
              reps: exercise.reps,
              weight: exercise.weight || null
            }))
          );

        if (exercisesError) {
          console.error('Error updating exercises:', exercisesError);
          throw exercisesError;
        }
      }
    }

    return {
      id: updatedTraining.id,
      type: updatedTraining.type as 'running' | 'strength' | 'cycling' | 'swimming' | 'yoga' | 'other',
      title: updatedTraining.title,
      date: updatedTraining.date,
      duration: updatedTraining.duration,
      distance: updatedTraining.distance || undefined,
      pace: updatedTraining.pace || undefined,
      category: updatedTraining.type === 'running' ? 'aerobic' : undefined,
      calories: updatedTraining.calories || undefined,
      heartRate: updatedTraining.heart_rate_avg && updatedTraining.heart_rate_max ? {
        avg: updatedTraining.heart_rate_avg,
        max: updatedTraining.heart_rate_max
      } : undefined,
      notes: updatedTraining.notes || undefined,
      exercises: updates.exercises
    };
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

    return plannedTrainings?.map(training => ({
      id: training.id,
      date: training.planned_date,
      type: training.type as 'running' | 'strength' | 'cycling' | 'swimming' | 'yoga' | 'other',
      title: training.title,
      plannedDuration: training.planned_duration || undefined,
      plannedDistance: training.planned_distance || undefined,
      category: training.type === 'running' ? 'aerobic' : undefined,
      notes: training.notes || undefined,
      completed: training.completed || false,
      completedTrainingId: training.completed_training_id || undefined
    })) || [];
  }

  async createPlannedTraining(training: Omit<PlannedTraining, 'id'>): Promise<PlannedTraining> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to create planned training');
    }

    const { data: newPlannedTraining, error } = await supabase
      .from('planned_trainings')
      .insert({
        user_id: user.id,
        title: training.title,
        type: training.type,
        planned_date: training.date,
        planned_duration: training.plannedDuration || null,
        planned_distance: training.plannedDistance || null,
        notes: training.notes || null,
        completed: training.completed || false,
        completed_training_id: training.completedTrainingId || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating planned training:', error);
      throw error;
    }

    return {
      id: newPlannedTraining.id,
      date: newPlannedTraining.planned_date,
      type: newPlannedTraining.type as 'running' | 'strength' | 'cycling' | 'swimming' | 'yoga' | 'other',
      title: newPlannedTraining.title,
      plannedDuration: newPlannedTraining.planned_duration || undefined,
      plannedDistance: newPlannedTraining.planned_distance || undefined,
      category: newPlannedTraining.type === 'running' ? 'aerobic' : undefined,
      notes: newPlannedTraining.notes || undefined,
      completed: newPlannedTraining.completed || false,
      completedTrainingId: newPlannedTraining.completed_training_id || undefined
    };
  }

  async updatePlannedTraining(id: string, updates: Partial<PlannedTraining>): Promise<PlannedTraining> {
    const { data: updatedPlannedTraining, error } = await supabase
      .from('planned_trainings')
      .update({
        title: updates.title,
        type: updates.type,
        planned_date: updates.date,
        planned_duration: updates.plannedDuration || null,
        planned_distance: updates.plannedDistance || null,
        notes: updates.notes || null,
        completed: updates.completed,
        completed_training_id: updates.completedTrainingId || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating planned training:', error);
      throw error;
    }

    return {
      id: updatedPlannedTraining.id,
      date: updatedPlannedTraining.planned_date,
      type: updatedPlannedTraining.type as 'running' | 'strength' | 'cycling' | 'swimming' | 'yoga' | 'other',
      title: updatedPlannedTraining.title,
      plannedDuration: updatedPlannedTraining.planned_duration || undefined,
      plannedDistance: updatedPlannedTraining.planned_distance || undefined,
      category: updatedPlannedTraining.type === 'running' ? 'aerobic' : undefined,
      notes: updatedPlannedTraining.notes || undefined,
      completed: updatedPlannedTraining.completed || false,
      completedTrainingId: updatedPlannedTraining.completed_training_id || undefined
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
