
-- Create enum types for training categories
CREATE TYPE training_type AS ENUM ('running', 'cycling', 'swimming', 'strength', 'yoga', 'other');
CREATE TYPE activity_level AS ENUM ('beginner', 'intermediate', 'advanced', 'elite');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  height INTEGER, -- in cm
  weight DECIMAL(5,2), -- in kg
  activity_level activity_level DEFAULT 'beginner',
  goals TEXT,
  strava_connected BOOLEAN DEFAULT FALSE,
  strava_user_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create trainings table
CREATE TABLE public.trainings (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type training_type NOT NULL,
  date DATE NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  distance DECIMAL(6,2), -- in km
  pace TEXT, -- e.g., "5:30"
  calories INTEGER,
  notes TEXT,
  heart_rate_avg INTEGER,
  heart_rate_max INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create exercises table for strength training
CREATE TABLE public.exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  training_id UUID NOT NULL REFERENCES public.trainings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sets INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  weight DECIMAL(5,2), -- in kg
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create planned_trainings table
CREATE TABLE public.planned_trainings (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type training_type NOT NULL,
  planned_date DATE NOT NULL,
  planned_duration INTEGER, -- in minutes
  planned_distance DECIMAL(6,2), -- in km
  notes TEXT,
  completed BOOLEAN DEFAULT FALSE,
  completed_training_id UUID REFERENCES public.trainings(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planned_trainings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for trainings
CREATE POLICY "Users can view own trainings" ON public.trainings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trainings" ON public.trainings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trainings" ON public.trainings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trainings" ON public.trainings
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for exercises
CREATE POLICY "Users can view own exercises" ON public.exercises
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.trainings 
      WHERE trainings.id = exercises.training_id 
      AND trainings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own exercises" ON public.exercises
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.trainings 
      WHERE trainings.id = exercises.training_id 
      AND trainings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own exercises" ON public.exercises
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.trainings 
      WHERE trainings.id = exercises.training_id 
      AND trainings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own exercises" ON public.exercises
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.trainings 
      WHERE trainings.id = exercises.training_id 
      AND trainings.user_id = auth.uid()
    )
  );

-- RLS Policies for planned_trainings
CREATE POLICY "Users can view own planned trainings" ON public.planned_trainings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own planned trainings" ON public.planned_trainings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own planned trainings" ON public.planned_trainings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own planned trainings" ON public.planned_trainings
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_trainings_user_id_date ON public.trainings(user_id, date DESC);
CREATE INDEX idx_planned_trainings_user_id_date ON public.planned_trainings(user_id, planned_date);
CREATE INDEX idx_exercises_training_id ON public.exercises(training_id);
