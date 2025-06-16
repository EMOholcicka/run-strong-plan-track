
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type RunningCategory = 'aerobic' | 'intervals' | 'tempo' | 'hills';

export interface Training {
  id: string;
  type: 'running' | 'strength';
  title: string;
  date: string;
  duration: number; // in minutes
  distance?: number; // in kilometers for running
  pace?: string; // min/km for running
  category?: RunningCategory; // for running only
  exercises?: Exercise[]; // for strength training
  notes?: string;
  calories?: number;
  heartRate?: {
    avg: number;
    max: number;
  };
}

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
}

export interface PlannedTraining {
  id: string;
  date: string;
  type: 'running' | 'strength';
  title: string;
  plannedDuration: number;
  plannedDistance?: number;
  category?: RunningCategory; // for running only
  notes?: string;
  completed?: boolean;
}

interface TrainingContextType {
  trainings: Training[];
  plannedTrainings: PlannedTraining[];
  addTraining: (training: Omit<Training, 'id'>) => void;
  addPlannedTraining: (training: Omit<PlannedTraining, 'id'>) => void;
  updatePlannedTraining: (id: string, updates: Partial<PlannedTraining>) => void;
  deletePlannedTraining: (id: string) => void;
  getTrainingById: (id: string) => Training | undefined;
  getWeeklyStats: (weekOffset?: number) => {
    totalDuration: number;
    totalDistance: number;
    runningDuration: number;
    strengthDuration: number;
    totalSessions: number;
  };
  getPlannedWeeklyStats: () => {
    totalPlannedDuration: number;
    totalPlannedDistance: number;
  };
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

export const useTraining = () => {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error('useTraining must be used within a TrainingProvider');
  }
  return context;
};

export const TrainingProvider = ({ children }: { children: ReactNode }) => {
  const [trainings, setTrainings] = useState<Training[]>([
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
  ]);

  const [plannedTrainings, setPlannedTrainings] = useState<PlannedTraining[]>([
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
  ]);

  const addTraining = (training: Omit<Training, 'id'>) => {
    const newTraining = {
      ...training,
      id: Date.now().toString()
    };
    setTrainings(prev => [newTraining, ...prev]);
  };

  const addPlannedTraining = (training: Omit<PlannedTraining, 'id'>) => {
    const newPlannedTraining = {
      ...training,
      id: Date.now().toString()
    };
    setPlannedTrainings(prev => [...prev, newPlannedTraining]);
  };

  const updatePlannedTraining = (id: string, updates: Partial<PlannedTraining>) => {
    setPlannedTrainings(prev => 
      prev.map(training => 
        training.id === id ? { ...training, ...updates } : training
      )
    );
  };

  const deletePlannedTraining = (id: string) => {
    setPlannedTrainings(prev => prev.filter(training => training.id !== id));
  };

  const getTrainingById = (id: string) => {
    return trainings.find(training => training.id === id);
  };

  const getWeeklyStats = (weekOffset: number = 0) => {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay + (weekOffset * 7));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const weekTrainings = trainings.filter(training => {
      const trainingDate = new Date(training.date);
      return trainingDate >= startOfWeek && trainingDate <= endOfWeek;
    });

    return {
      totalDuration: weekTrainings.reduce((sum, t) => sum + t.duration, 0),
      totalDistance: weekTrainings.filter(t => t.type === 'running').reduce((sum, t) => sum + (t.distance || 0), 0),
      runningDuration: weekTrainings.filter(t => t.type === 'running').reduce((sum, t) => sum + t.duration, 0),
      strengthDuration: weekTrainings.filter(t => t.type === 'strength').reduce((sum, t) => sum + t.duration, 0),
      totalSessions: weekTrainings.length
    };
  };

  const getPlannedWeeklyStats = () => {
    return {
      totalPlannedDuration: plannedTrainings.reduce((sum, t) => sum + t.plannedDuration, 0),
      totalPlannedDistance: plannedTrainings.filter(t => t.type === 'running').reduce((sum, t) => sum + (t.plannedDistance || 0), 0)
    };
  };

  return (
    <TrainingContext.Provider value={{
      trainings,
      plannedTrainings,
      addTraining,
      addPlannedTraining,
      updatePlannedTraining,
      deletePlannedTraining,
      getTrainingById,
      getWeeklyStats,
      getPlannedWeeklyStats
    }}>
      {children}
    </TrainingContext.Provider>
  );
};
