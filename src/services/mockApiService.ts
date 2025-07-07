import { Training, PlannedTraining } from '@/types/training';

// Mock data for trainings - expanded to 40+ entries with 75% running
const mockTrainings: Training[] = [
  // Running trainings (30 entries - 75%)
  {
    id: '1',
    user_id: 'user1',
    title: 'Morning Run',
    type: 'running',
    date: '2025-01-15',
    duration: 45,
    distance: 8.5,
    pace: '5:30',
    calories: 420,
    trainerNotes: 'Good pace, maintain form',
    traineeNotes: 'Felt strong throughout',
    heartRateAvg: 150,
    heartRateMax: 165,
    cadenceAvg: 180,
    cadenceMax: 195,
    altitudeMin: 120,
    altitudeMax: 350,
    altitudeGain: 280,
    altitudeLoss: 250,
    exercises: [],
    stravaLink: 'https://strava.com/activities/123',
    garminLink: 'https://garmin.com/activities/456',
    category: 'aerobic',
    rating: 8,
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-01-15T08:00:00Z'
  },
  {
    id: '3',
    user_id: 'user1',
    title: 'Evening Jog',
    type: 'running',
    date: '2025-01-13',
    duration: 30,
    distance: 5.0,
    pace: '6:00',
    calories: 280,
    heartRateAvg: 140,
    heartRateMax: 158,
    cadenceAvg: 175,
    cadenceMax: 188,
    altitudeMin: 80,
    altitudeMax: 180,
    altitudeGain: 120,
    altitudeLoss: 120,
    exercises: [],
    createdAt: '2025-01-13T19:00:00Z',
    updatedAt: '2025-01-13T19:00:00Z'
  },
  {
    id: '6',
    user_id: 'user1',
    title: 'Interval Training',
    type: 'running',
    date: '2025-01-10',
    duration: 35,
    distance: 6.0,
    pace: '5:00',
    calories: 350,
    trainerNotes: 'Excellent intervals, good recovery',
    traineeNotes: 'Tough but manageable',
    heartRateAvg: 165,
    heartRateMax: 185,
    cadenceAvg: 190,
    cadenceMax: 200,
    exercises: [],
    category: 'intervals',
    rating: 9,
    createdAt: '2025-01-10T17:00:00Z',
    updatedAt: '2025-01-10T17:00:00Z'
  },
  {
    id: '7',
    user_id: 'user1',
    title: 'Long Run',
    type: 'running',
    date: '2025-01-09',
    duration: 75,
    distance: 12.0,
    pace: '6:15',
    calories: 720,
    traineeNotes: 'Great endurance run',
    heartRateAvg: 145,
    heartRateMax: 160,
    cadenceAvg: 175,
    cadenceMax: 185,
    exercises: [],
    category: 'aerobic',
    rating: 8,
    createdAt: '2025-01-09T07:00:00Z',
    updatedAt: '2025-01-09T07:00:00Z'
  },
  {
    id: '8',
    user_id: 'user1',
    title: 'Tempo Run',
    type: 'running',
    date: '2025-01-08',
    duration: 40,
    distance: 7.0,
    pace: '5:45',
    calories: 400,
    trainerNotes: 'Perfect tempo pace',
    traineeNotes: 'Felt controlled',
    heartRateAvg: 155,
    heartRateMax: 170,
    exercises: [],
    category: 'tempo',
    rating: 9,
    createdAt: '2025-01-08T18:00:00Z',
    updatedAt: '2025-01-08T18:00:00Z'
  },
  {
    id: '9',
    user_id: 'user1',
    title: 'Hill Training',
    type: 'running',
    date: '2025-01-07',
    duration: 50,
    distance: 8.0,
    pace: '6:30',
    calories: 480,
    traineeNotes: 'Challenging hills',
    heartRateAvg: 160,
    heartRateMax: 180,
    altitudeGain: 450,
    altitudeLoss: 420,
    exercises: [],
    category: 'hills',
    rating: 7,
    createdAt: '2025-01-07T16:00:00Z',
    updatedAt: '2025-01-07T16:00:00Z'
  },
  {
    id: '10',
    user_id: 'user1',
    title: 'Recovery Run',
    type: 'running',
    date: '2025-01-06',
    duration: 25,
    distance: 4.0,
    pace: '7:00',
    calories: 200,
    traineeNotes: 'Easy recovery pace',
    heartRateAvg: 125,
    heartRateMax: 135,
    exercises: [],
    category: 'aerobic',
    rating: 6,
    createdAt: '2025-01-06T08:00:00Z',
    updatedAt: '2025-01-06T08:00:00Z'
  },
  {
    id: '11',
    user_id: 'user1',
    title: 'Speed Work',
    type: 'running',
    date: '2025-01-05',
    duration: 30,
    distance: 5.5,
    pace: '4:50',
    calories: 330,
    trainerNotes: 'Great speed session',
    heartRateAvg: 170,
    heartRateMax: 190,
    cadenceAvg: 195,
    cadenceMax: 205,
    exercises: [],
    category: 'intervals',
    rating: 9,
    createdAt: '2025-01-05T17:30:00Z',
    updatedAt: '2025-01-05T17:30:00Z'
  },
  {
    id: '12',
    user_id: 'user1',
    title: 'Morning Jog',
    type: 'running',
    date: '2025-01-04',
    duration: 35,
    distance: 6.5,
    pace: '5:50',
    calories: 380,
    traineeNotes: 'Good morning run',
    heartRateAvg: 148,
    heartRateMax: 162,
    exercises: [],
    createdAt: '2025-01-04T07:30:00Z',
    updatedAt: '2025-01-04T07:30:00Z'
  },
  {
    id: '13',
    user_id: 'user1',
    title: 'Trail Run',
    type: 'running',
    date: '2025-01-03',
    duration: 60,
    distance: 9.0,
    pace: '6:40',
    calories: 540,
    traineeNotes: 'Beautiful trail scenery',
    heartRateAvg: 152,
    heartRateMax: 175,
    altitudeGain: 320,
    altitudeLoss: 310,
    exercises: [],
    rating: 8,
    createdAt: '2025-01-03T09:00:00Z',
    updatedAt: '2025-01-03T09:00:00Z'
  },
  {
    id: '14',
    user_id: 'user1',
    title: 'Fartlek Training',
    type: 'running',
    date: '2025-01-02',
    duration: 45,
    distance: 7.5,
    pace: '5:55',
    calories: 450,
    trainerNotes: 'Good variety in pace',
    heartRateAvg: 158,
    heartRateMax: 178,
    exercises: [],
    category: 'intervals',
    rating: 8,
    createdAt: '2025-01-02T18:15:00Z',
    updatedAt: '2025-01-02T18:15:00Z'
  },
  {
    id: '15',
    user_id: 'user1',
    title: 'New Year Run',
    type: 'running',
    date: '2025-01-01',
    duration: 40,
    distance: 6.8,
    pace: '5:52',
    calories: 408,
    traineeNotes: 'Great start to the year!',
    heartRateAvg: 150,
    heartRateMax: 165,
    exercises: [],
    rating: 9,
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z'
  },
  {
    id: '16',
    user_id: 'user1',
    title: 'Easy Run',
    type: 'running',
    date: '2024-12-31',
    duration: 30,
    distance: 5.2,
    pace: '6:45',
    calories: 290,
    traineeNotes: 'Relaxed pace',
    heartRateAvg: 135,
    heartRateMax: 150,
    exercises: [],
    createdAt: '2024-12-31T08:00:00Z',
    updatedAt: '2024-12-31T08:00:00Z'
  },
  {
    id: '17',
    user_id: 'user1',
    title: 'Track Workout',
    type: 'running',
    date: '2024-12-30',
    duration: 38,
    distance: 6.0,
    pace: '5:20',
    calories: 360,
    trainerNotes: 'Solid track session',
    heartRateAvg: 165,
    heartRateMax: 185,
    cadenceAvg: 188,
    cadenceMax: 198,
    exercises: [],
    category: 'intervals',
    rating: 8,
    createdAt: '2024-12-30T17:00:00Z',
    updatedAt: '2024-12-30T17:00:00Z'
  },
  {
    id: '18',
    user_id: 'user1',
    title: 'Sunday Long Run',
    type: 'running',
    date: '2024-12-29',
    duration: 85,
    distance: 14.0,
    pace: '6:05',
    calories: 840,
    traineeNotes: 'Felt strong throughout',
    heartRateAvg: 148,
    heartRateMax: 165,
    exercises: [],
    category: 'aerobic',
    rating: 9,
    createdAt: '2024-12-29T08:30:00Z',
    updatedAt: '2024-12-29T08:30:00Z'
  },
  {
    id: '19',
    user_id: 'user1',
    title: 'Neighborhood Run',
    type: 'running',
    date: '2024-12-28',
    duration: 42,
    distance: 7.2,
    pace: '5:50',
    calories: 432,
    traineeNotes: 'Familiar route',
    heartRateAvg: 152,
    heartRateMax: 168,
    exercises: [],
    rating: 7,
    createdAt: '2024-12-28T19:00:00Z',
    updatedAt: '2024-12-28T19:00:00Z'
  },
  {
    id: '20',
    user_id: 'user1',
    title: 'Treadmill Run',
    type: 'running',
    date: '2024-12-27',
    duration: 35,
    distance: 6.0,
    pace: '5:50',
    calories: 350,
    traineeNotes: 'Indoor run due to weather',
    heartRateAvg: 148,
    heartRateMax: 160,
    exercises: [],
    createdAt: '2024-12-27T07:00:00Z',
    updatedAt: '2024-12-27T07:00:00Z'
  },
  {
    id: '21',
    user_id: 'user1',
    title: 'Park Run',
    type: 'running',
    date: '2024-12-26',
    duration: 28,
    distance: 5.0,
    pace: '5:36',
    calories: 300,
    traineeNotes: 'Boxing Day run',
    heartRateAvg: 155,
    heartRateMax: 170,
    exercises: [],
    rating: 8,
    createdAt: '2024-12-26T09:00:00Z',
    updatedAt: '2024-12-26T09:00:00Z'
  },
  {
    id: '22',
    user_id: 'user1',
    title: 'Christmas Morning Run',
    type: 'running',
    date: '2024-12-25',
    duration: 25,
    distance: 4.5,
    pace: '5:33',
    calories: 270,
    traineeNotes: 'Festive morning run',
    heartRateAvg: 145,
    heartRateMax: 158,
    exercises: [],
    rating: 9,
    createdAt: '2024-12-25T08:00:00Z',
    updatedAt: '2024-12-25T08:00:00Z'
  },
  {
    id: '23',
    user_id: 'user1',
    title: 'Pre-Christmas Run',
    type: 'running',
    date: '2024-12-24',
    duration: 40,
    distance: 7.0,
    pace: '5:43',
    calories: 420,
    traineeNotes: 'Last run before Christmas',
    heartRateAvg: 150,
    heartRateMax: 165,
    exercises: [],
    createdAt: '2024-12-24T16:00:00Z',
    updatedAt: '2024-12-24T16:00:00Z'
  },
  {
    id: '24',
    user_id: 'user1',
    title: 'Weekend Long Run',
    type: 'running',
    date: '2024-12-23',
    duration: 70,
    distance: 11.5,
    pace: '6:05',
    calories: 690,
    traineeNotes: 'Good endurance build',
    heartRateAvg: 145,
    heartRateMax: 162,
    exercises: [],
    category: 'aerobic',
    rating: 8,
    createdAt: '2024-12-23T08:00:00Z',
    updatedAt: '2024-12-23T08:00:00Z'
  },
  {
    id: '25',
    user_id: 'user1',
    title: 'Threshold Run',
    type: 'running',
    date: '2024-12-22',
    duration: 45,
    distance: 8.0,
    pace: '5:38',
    calories: 480,
    trainerNotes: 'Great threshold effort',
    heartRateAvg: 162,
    heartRateMax: 175,
    exercises: [],
    category: 'tempo',
    rating: 9,
    createdAt: '2024-12-22T17:30:00Z',
    updatedAt: '2024-12-22T17:30:00Z'
  },
  {
    id: '26',
    user_id: 'user1',
    title: 'Morning Shakeout',
    type: 'running',
    date: '2024-12-21',
    duration: 20,
    distance: 3.0,
    pace: '7:00',
    calories: 180,
    traineeNotes: 'Easy shakeout run',
    heartRateAvg: 130,
    heartRateMax: 140,
    exercises: [],
    createdAt: '2024-12-21T07:00:00Z',
    updatedAt: '2024-12-21T07:00:00Z'
  },
  {
    id: '27',
    user_id: 'user1',
    title: 'Hill Repeats',
    type: 'running',
    date: '2024-12-20',
    duration: 50,
    distance: 7.5,
    pace: '6:40',
    calories: 500,
    trainerNotes: 'Strong hill work',
    traineeNotes: 'Tough but good',
    heartRateAvg: 168,
    heartRateMax: 185,
    altitudeGain: 400,
    exercises: [],
    category: 'hills',
    rating: 8,
    createdAt: '2024-12-20T18:00:00Z',
    updatedAt: '2024-12-20T18:00:00Z'
  },
  {
    id: '28',
    user_id: 'user1',
    title: 'Recovery Jog',
    type: 'running',
    date: '2024-12-19',
    duration: 30,
    distance: 4.8,
    pace: '6:15',
    calories: 240,
    traineeNotes: 'Easy recovery',
    heartRateAvg: 128,
    heartRateMax: 140,
    exercises: [],
    createdAt: '2024-12-19T08:30:00Z',
    updatedAt: '2024-12-19T08:30:00Z'
  },
  {
    id: '29',
    user_id: 'user1',
    title: 'Evening Run',
    type: 'running',
    date: '2024-12-18',
    duration: 38,
    distance: 6.5,
    pace: '5:51',
    calories: 390,
    traineeNotes: 'Good evening session',
    heartRateAvg: 153,
    heartRateMax: 168,
    exercises: [],
    rating: 7,
    createdAt: '2024-12-18T19:30:00Z',
    updatedAt: '2024-12-18T19:30:00Z'
  },
  {
    id: '30',
    user_id: 'user1',
    title: 'Midweek Run',
    type: 'running',
    date: '2024-12-17',
    duration: 42,
    distance: 7.0,
    pace: '6:00',
    calories: 420,
    traineeNotes: 'Solid midweek effort',
    heartRateAvg: 148,
    heartRateMax: 163,
    exercises: [],
    rating: 8,
    createdAt: '2024-12-17T17:00:00Z',
    updatedAt: '2024-12-17T17:00:00Z'
  },
  {
    id: '31',
    user_id: 'user1',
    title: 'Base Building Run',
    type: 'running',
    date: '2024-12-16',
    duration: 55,
    distance: 9.0,
    pace: '6:07',
    calories: 540,
    traineeNotes: 'Building aerobic base',
    heartRateAvg: 142,
    heartRateMax: 155,
    exercises: [],
    category: 'aerobic',
    rating: 8,
    createdAt: '2024-12-16T08:00:00Z',
    updatedAt: '2024-12-16T08:00:00Z'
  },
  {
    id: '32',
    user_id: 'user1',
    title: 'Speed Intervals',
    type: 'running',
    date: '2024-12-15',
    duration: 35,
    distance: 6.0,
    pace: '5:10',
    calories: 360,
    trainerNotes: 'Excellent speed work',
    heartRateAvg: 172,
    heartRateMax: 190,
    cadenceAvg: 192,
    cadenceMax: 202,
    exercises: [],
    category: 'intervals',
    rating: 9,
    createdAt: '2024-12-15T17:45:00Z',
    updatedAt: '2024-12-15T17:45:00Z'
  },

  // Strength trainings (10 entries - 25%)
  {
    id: '2',
    user_id: 'user1',
    title: 'Strength Training',
    type: 'strength',
    date: '2025-01-14',
    duration: 60,
    calories: 300,
    trainerNotes: 'Focus on form over weight',
    traineeNotes: 'Challenging but manageable',
    heartRateAvg: 125,
    heartRateMax: 155,
    exercises: [
      {
        id: '1',
        name: 'Squats',
        sets: 3,
        reps: 12,
        weight: 80
      },
      {
        id: '2',
        name: 'Bench Press',
        sets: 3,
        reps: 10,
        weight: 70
      }
    ],
    createdAt: '2025-01-14T18:00:00Z',
    updatedAt: '2025-01-14T18:00:00Z'
  },
  {
    id: '33',
    user_id: 'user1',
    title: 'Upper Body Strength',
    type: 'strength',
    date: '2025-01-12',
    duration: 50,
    calories: 280,
    trainerNotes: 'Good progression on pulls',
    traineeNotes: 'Felt strong today',
    heartRateAvg: 120,
    heartRateMax: 145,
    exercises: [
      {
        id: '3',
        name: 'Pull-ups',
        sets: 4,
        reps: 8,
        weight: 0
      },
      {
        id: '4',
        name: 'Overhead Press',
        sets: 3,
        reps: 10,
        weight: 45
      }
    ],
    rating: 8,
    createdAt: '2025-01-12T18:30:00Z',
    updatedAt: '2025-01-12T18:30:00Z'
  },
  {
    id: '34',
    user_id: 'user1',
    title: 'Leg Day',
    type: 'strength',
    date: '2025-01-11',
    duration: 65,
    calories: 320,
    trainerNotes: 'Increase weight next session',
    traineeNotes: 'Legs are toast!',
    heartRateAvg: 130,
    heartRateMax: 160,
    exercises: [
      {
        id: '5',
        name: 'Deadlifts',
        sets: 4,
        reps: 6,
        weight: 100
      },
      {
        id: '6',
        name: 'Lunges',
        sets: 3,
        reps: 12,
        weight: 20
      }
    ],
    rating: 9,
    createdAt: '2025-01-11T19:00:00Z',
    updatedAt: '2025-01-11T19:00:00Z'
  },
  {
    id: '35',
    user_id: 'user1',
    title: 'Core & Stability',
    type: 'strength',
    date: '2025-01-09',
    duration: 30,
    calories: 150,
    traineeNotes: 'Focused on core strength',
    heartRateAvg: 110,
    heartRateMax: 130,
    exercises: [
      {
        id: '7',
        name: 'Planks',
        sets: 3,
        reps: 60,
        weight: 0
      },
      {
        id: '8',
        name: 'Russian Twists',
        sets: 3,
        reps: 20,
        weight: 10
      }
    ],
    rating: 7,
    createdAt: '2025-01-09T17:00:00Z',
    updatedAt: '2025-01-09T17:00:00Z'
  },
  {
    id: '36',
    user_id: 'user1',
    title: 'Full Body Workout',
    type: 'strength',
    date: '2025-01-07',
    duration: 75,
    calories: 400,
    trainerNotes: 'Great compound movements',
    traineeNotes: 'Comprehensive session',
    heartRateAvg: 135,
    heartRateMax: 165,
    exercises: [
      {
        id: '9',
        name: 'Clean & Press',
        sets: 4,
        reps: 8,
        weight: 60
      },
      {
        id: '10',
        name: 'Burpees',
        sets: 3,
        reps: 15,
        weight: 0
      }
    ],
    rating: 9,
    createdAt: '2025-01-07T18:00:00Z',
    updatedAt: '2025-01-07T18:00:00Z'
  },
  {
    id: '37',
    user_id: 'user1',
    title: 'Push Day',
    type: 'strength',
    date: '2025-01-05',
    duration: 55,
    calories: 300,
    trainerNotes: 'Focus on controlled movements',
    traineeNotes: 'Good chest activation',
    heartRateAvg: 125,
    heartRateMax: 150,
    exercises: [
      {
        id: '11',
        name: 'Incline Bench Press',
        sets: 4,
        reps: 10,
        weight: 65
      },
      {
        id: '12',
        name: 'Dips',
        sets: 3,
        reps: 12,
        weight: 0
      }
    ],
    rating: 8,
    createdAt: '2025-01-05T19:30:00Z',
    updatedAt: '2025-01-05T19:30:00Z'
  },
  {
    id: '38',
    user_id: 'user1',
    title: 'Pull Day',
    type: 'strength',
    date: '2025-01-03',
    duration: 60,
    calories: 320,
    traineeNotes: 'Back felt strong',
    heartRateAvg: 128,
    heartRateMax: 155,
    exercises: [
      {
        id: '13',
        name: 'Bent-over Rows',
        sets: 4,
        reps: 10,
        weight: 75
      },
      {
        id: '14',
        name: 'Lat Pulldowns',
        sets: 3,
        reps: 12,
        weight: 50
      }
    ],
    rating: 8,
    createdAt: '2025-01-03T18:15:00Z',
    updatedAt: '2025-01-03T18:15:00Z'
  },
  {
    id: '39',
    user_id: 'user1',
    title: 'Functional Training',
    type: 'strength',
    date: '2025-01-01',
    duration: 45,
    calories: 250,
    traineeNotes: 'New Year, new gains!',
    heartRateAvg: 118,
    heartRateMax: 140,
    exercises: [
      {
        id: '15',
        name: 'Kettlebell Swings',
        sets: 4,
        reps: 20,
        weight: 16
      },
      {
        id: '16',
        name: 'Box Jumps',
        sets: 3,
        reps: 15,
        weight: 0
      }
    ],
    rating: 9,
    createdAt: '2025-01-01T16:00:00Z',
    updatedAt: '2025-01-01T16:00:00Z'
  },
  {
    id: '40',
    user_id: 'user1',
    title: 'Holiday Workout',
    type: 'strength',
    date: '2024-12-30',
    duration: 40,
    calories: 220,
    traineeNotes: 'Quick but effective',
    heartRateAvg: 115,
    heartRateMax: 135,
    exercises: [
      {
        id: '17',
        name: 'Push-ups',
        sets: 3,
        reps: 20,
        weight: 0
      },
      {
        id: '18',
        name: 'Bodyweight Squats',
        sets: 3,
        reps: 25,
        weight: 0
      }
    ],
    rating: 7,
    createdAt: '2024-12-30T10:00:00Z',
    updatedAt: '2024-12-30T10:00:00Z'
  },
  {
    id: '41',
    user_id: 'user1',
    title: 'Recovery Strength',
    type: 'strength',
    date: '2024-12-28',
    duration: 35,
    calories: 180,
    traineeNotes: 'Light recovery session',
    heartRateAvg: 105,
    heartRateMax: 125,
    exercises: [
      {
        id: '19',
        name: 'Band Pull-aparts',
        sets: 3,
        reps: 15,
        weight: 0
      },
      {
        id: '20',
        name: 'Wall Sits',
        sets: 3,
        reps: 45,
        weight: 0
      }
    ],
    rating: 6,
    createdAt: '2024-12-28T11:00:00Z',
    updatedAt: '2024-12-28T11:00:00Z'
  },

  // Other activities (2 entries)
  {
    id: '4',
    user_id: 'user1',
    title: 'Yoga Session',
    type: 'yoga',
    date: '2025-01-12',
    duration: 45,
    calories: 150,
    traineeNotes: 'Very relaxing session',
    heartRateAvg: 85,
    heartRateMax: 110,
    exercises: [],
    createdAt: '2025-01-12T07:00:00Z',
    updatedAt: '2025-01-12T07:00:00Z'
  },
  {
    id: '5',
    user_id: 'user1',
    title: 'Cycling',
    type: 'cycling',
    date: '2025-01-11',
    duration: 90,
    distance: 25.0,
    calories: 600,
    heartRateAvg: 145,
    heartRateMax: 172,
    cadenceAvg: 85,
    cadenceMax: 98,
    altitudeMin: 200,
    altitudeMax: 450,
    altitudeGain: 380,
    altitudeLoss: 380,
    exercises: [],
    createdAt: '2025-01-11T16:00:00Z',
    updatedAt: '2025-01-11T16:00:00Z'
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockPlannedTrainings: PlannedTraining[] = [
  {
    id: 'p1',
    user_id: 'user1',
    title: 'Long Run',
    type: 'running',
    plannedDate: '2025-01-16',
    plannedDuration: 60,
    plannedDistance: 10.0,
    notes: 'Build endurance',
    completed: false,
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z'
  }
];

class MockApiService {
  async getTrainings(limit?: number, offset?: number): Promise<Training[]> {
    console.log('MockApiService.getTrainings called with limit:', limit, 'offset:', offset);
    await delay(800); // Slightly longer delay to show lazy loading
    
    let result = [...mockTrainings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (offset) {
      result = result.slice(offset);
    }
    
    if (limit) {
      result = result.slice(0, limit);
    }
    
    console.log('MockApiService.getTrainings returning:', result.length, 'trainings');
    return result;
  }

  async getTrainingById(id: string): Promise<Training> {
    await delay(300);
    const training = mockTrainings.find(t => t.id === id);
    if (!training) {
      throw new Error('Training not found');
    }
    return training;
  }

  async createTraining(trainingData: Omit<Training, 'id' | 'createdAt' | 'updatedAt'>): Promise<Training> {
    console.log('MockApiService createTraining called with:', trainingData);
    await delay(500);
    
    const newTraining: Training = {
      ...trainingData,
      id: `mock-${Date.now()}`,
      exercises: trainingData.exercises || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockTrainings.push(newTraining);
    return newTraining;
  }

  async updateTraining(id: string, updates: Partial<Training>): Promise<Training> {
    await delay(300);
    const index = mockTrainings.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Training not found');
    }
    
    mockTrainings[index] = {
      ...mockTrainings[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return mockTrainings[index];
  }

  async deleteTraining(id: string): Promise<void> {
    await delay(300);
    const index = mockTrainings.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Training not found');
    }
    mockTrainings.splice(index, 1);
  }

  async getPlannedTrainings(): Promise<PlannedTraining[]> {
    await delay(400);
    return [...mockPlannedTrainings];
  }

  async createPlannedTraining(plannedData: Omit<PlannedTraining, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlannedTraining> {
    await delay(400);
    const newPlanned: PlannedTraining = {
      ...plannedData,
      id: `planned-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockPlannedTrainings.push(newPlanned);
    return newPlanned;
  }

  async updatePlannedTraining(id: string, updates: Partial<PlannedTraining>): Promise<PlannedTraining> {
    await delay(300);
    const index = mockPlannedTrainings.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Planned training not found');
    }
    
    mockPlannedTrainings[index] = {
      ...mockPlannedTrainings[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return mockPlannedTrainings[index];
  }

  async deletePlannedTraining(id: string): Promise<void> {
    await delay(300);
    const index = mockPlannedTrainings.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Planned training not found');
    }
    mockPlannedTrainings.splice(index, 1);
  }
}

export const mockApiService = new MockApiService();
