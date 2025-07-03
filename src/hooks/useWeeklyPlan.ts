import { useState, useEffect } from 'react';
import { WeeklyPlanData, DayTraining, ActivityType, IntensityLevel } from '@/types/weeklyPlan';

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

  // Mock data for demonstration
  useEffect(() => {
    const mockData: WeeklyPlanData = {
      weekOffset,
      days: {
        Monday: {
          id: 'mon-1',
          day: 'Monday',
          activityType: 'Easy Run',
          duration: 45,
          distance: 6.5,
          intensity: 'Low',
          heartRateZone: '2',
          rpe: 4,
          notes: 'Zone 2 base building run',
          status: 'completed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        Tuesday: {
          id: 'tue-1',
          day: 'Tuesday',
          activityType: 'Intervals',
          duration: 60,
          distance: 8.0,
          intensity: 'High',
          heartRateZone: '4-5',
          rpe: 8,
          notes: '6x800m @ 5K pace with 2min recovery',
          status: 'planned',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        Wednesday: {
          id: 'wed-1',
          day: 'Wednesday',
          activityType: 'Cross Training',
          duration: 30,
          intensity: 'Low',
          rpe: 3,
          notes: 'Swimming or cycling',
          status: 'planned',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        Thursday: {
          id: 'thu-1',
          day: 'Thursday',
          activityType: 'Tempo Run',
          duration: 50,
          distance: 7.5,
          intensity: 'Medium',
          heartRateZone: '3-4',
          rpe: 7,
          notes: '20min tempo @ threshold pace',
          status: 'planned',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        Friday: {
          id: 'fri-1',
          day: 'Friday',
          activityType: 'Rest',
          intensity: 'Low',
          notes: 'Complete rest day',
          status: 'planned',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        Saturday: {
          id: 'sat-1',
          day: 'Saturday',
          activityType: 'Long Run',
          duration: 90,
          distance: 15.0,
          intensity: 'Low',
          heartRateZone: '1-2',
          rpe: 5,
          notes: 'Steady aerobic pace, focus on form',
          status: 'planned',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        Sunday: {
          id: 'sun-1',
          day: 'Sunday',
          activityType: 'Strength Training',
          duration: 45,
          intensity: 'Medium',
          rpe: 6,
          notes: 'Lower body focus',
          status: 'planned',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      summary: {
        totalTrainingDays: 6,
        plannedTrainingDays: 6,
        completedTrainingDays: 1,
        missedTrainingDays: 0,
        totalDistance: 37.0,
        totalDuration: 320,
        trainingLoad: 420,
        restDays: 1,
        intensityBreakdown: {
          low: 3,
          medium: 2,
          high: 1,
        },
        activityBreakdown: {
          'Easy Run': 1,
          'Intervals': 1,
          'Tempo Run': 1,
          'Long Run': 1,
          'Hill Run': 0,
          'Strength Training': 1,
          'Cross Training': 1,
          'Rest': 1,
        },
      },
    };

    setWeekData(mockData);
  }, [weekOffset]);

  const addTraining = (day: string, trainingData: any) => {
    const newTraining: DayTraining = {
      id: `${day.toLowerCase()}-${Date.now()}`,
      day,
      ...trainingData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setWeekData(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: newTraining,
      },
    }));

    // Recalculate summary
    updateSummary();
  };

  const updateTraining = (dayTraining: DayTraining) => {
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

    // Recalculate summary
    updateSummary();
  };

  const deleteTraining = (id: string) => {
    const dayToUpdate = Object.keys(weekData.days).find(day => 
      weekData.days[day]?.id === id
    );

    if (dayToUpdate) {
      setWeekData(prev => ({
        ...prev,
        days: {
          ...prev.days,
          [dayToUpdate]: null,
        },
      }));

      // Recalculate summary
      updateSummary();
    }
  };

  const updateSummary = () => {
    // This would normally recalculate the summary based on current days
    // For now, we'll keep it simple and use mock data
  };

  return {
    weekData,
    updateTraining,
    addTraining,
    deleteTraining,
  };
};
