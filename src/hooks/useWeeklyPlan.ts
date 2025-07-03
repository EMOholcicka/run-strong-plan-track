
import { useState, useEffect } from 'react';
import { WeeklyPlanData, DayTraining } from '@/types/weeklyPlan';
import { weeklyPlanService } from '@/services/weeklyPlanService';

export const useWeeklyPlan = (weekOffset: number = 0) => {
  const [weekData, setWeekData] = useState<WeeklyPlanData>({
    weekOffset,
    days: {
      Monday: null,
      Tuesday: null,
      Wednesday: null,
      Thursday: null,
      Friday: null,
      Saturday: null,
      Sunday: null,
    },
    summary: {
      totalTrainingDays: 0,
      plannedTrainingDays: 0,
      completedTrainingDays: 0,
      missedTrainingDays: 0,
      totalDistance: 0,
      totalDuration: 0,
      trainingLoad: 0,
      restDays: 7,
      intensityBreakdown: {
        low: 0,
        medium: 0,
        high: 0,
      },
      activityBreakdown: {
        'Easy Run': 0,
        'Intervals': 0,
        'Tempo Run': 0,
        'Long Run': 0,
        'Hill Run': 0,
        'Strength Training': 0,
        'Cross Training': 0,
        'Rest': 0,
      },
    },
  });

  const [loading, setLoading] = useState(true);

  // Load weekly plan data
  useEffect(() => {
    const loadWeeklyPlan = async () => {
      setLoading(true);
      try {
        const data = await weeklyPlanService.getWeeklyPlan(weekOffset);
        setWeekData(data);
      } catch (error) {
        console.error('Failed to load weekly plan:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWeeklyPlan();
  }, [weekOffset]);

  const addTraining = async (day: string, trainingData: any) => {
    const newTraining: DayTraining = {
      id: `${day.toLowerCase()}-${Date.now()}`,
      day,
      ...trainingData,
      status: 'planned',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const savedTraining = await weeklyPlanService.saveDayTraining(newTraining);
      
      setWeekData(prev => ({
        ...prev,
        days: {
          ...prev.days,
          [day]: savedTraining,
        },
      }));

      updateSummary();
    } catch (error) {
      console.error('Failed to add training:', error);
      // Optimistic update even if API fails
      setWeekData(prev => ({
        ...prev,
        days: {
          ...prev.days,
          [day]: newTraining,
        },
      }));
      updateSummary();
    }
  };

  const updateTraining = async (dayTraining: DayTraining) => {
    try {
      const updatedTraining = await weeklyPlanService.saveDayTraining({
        ...dayTraining,
        updatedAt: new Date().toISOString(),
      });

      setWeekData(prev => ({
        ...prev,
        days: {
          ...prev.days,
          [dayTraining.day]: updatedTraining,
        },
      }));

      updateSummary();
    } catch (error) {
      console.error('Failed to update training:', error);
      // Optimistic update even if API fails
      setWeekData(prev => ({
        ...prev,
        days: {
          ...prev.days,
          [dayTraining.day]: {
            ...dayTraining,
            updatedAt: new Date().toISOString(),
          },
        },
      }));
      updateSummary();
    }
  };

  const deleteTraining = async (id: string) => {
    const dayToUpdate = Object.keys(weekData.days).find(day => 
      weekData.days[day]?.id === id
    );

    if (dayToUpdate) {
      try {
        await weeklyPlanService.deleteDayTraining(id);
        
        setWeekData(prev => ({
          ...prev,
          days: {
            ...prev.days,
            [dayToUpdate]: null,
          },
        }));

        updateSummary();
      } catch (error) {
        console.error('Failed to delete training:', error);
        // Optimistic update even if API fails
        setWeekData(prev => ({
          ...prev,
          days: {
            ...prev.days,
            [dayToUpdate]: null,
          },
        }));
        updateSummary();
      }
    }
  };

  const updateSummary = () => {
    setWeekData(prev => {
      const days = Object.values(prev.days).filter(Boolean) as DayTraining[];
      
      const totalTrainingDays = days.length;
      const completedTrainingDays = days.filter(d => d.status === 'completed').length;
      const missedTrainingDays = days.filter(d => d.status === 'missed').length;
      const plannedTrainingDays = days.filter(d => d.status === 'planned').length;
      
      const totalDistance = days.reduce((sum, d) => sum + (d.distance || 0), 0);
      const totalDuration = days.reduce((sum, d) => sum + (d.duration || 0), 0);
      const trainingLoad = days.reduce((sum, d) => sum + ((d.rpe || 5) * (d.duration || 30)), 0);
      
      const intensityBreakdown = {
        low: days.filter(d => d.intensity === 'Low').length,
        medium: days.filter(d => d.intensity === 'Medium').length,
        high: days.filter(d => d.intensity === 'High').length,
      };
      
      const activityBreakdown = {
        'Easy Run': days.filter(d => d.activityType === 'Easy Run').length,
        'Intervals': days.filter(d => d.activityType === 'Intervals').length,
        'Tempo Run': days.filter(d => d.activityType === 'Tempo Run').length,
        'Long Run': days.filter(d => d.activityType === 'Long Run').length,
        'Hill Run': days.filter(d => d.activityType === 'Hill Run').length,
        'Strength Training': days.filter(d => d.activityType === 'Strength Training').length,
        'Cross Training': days.filter(d => d.activityType === 'Cross Training').length,
        'Rest': days.filter(d => d.activityType === 'Rest').length,
      };
      
      return {
        ...prev,
        summary: {
          totalTrainingDays,
          plannedTrainingDays,
          completedTrainingDays,
          missedTrainingDays,
          totalDistance,
          totalDuration,
          trainingLoad,
          restDays: 7 - totalTrainingDays,
          intensityBreakdown,
          activityBreakdown,
        },
      };
    });
  };

  return {
    weekData,
    loading,
    updateTraining,
    addTraining,
    deleteTraining,
  };
};
