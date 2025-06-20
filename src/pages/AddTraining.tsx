
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import { useCreateTraining } from "@/hooks/useTrainings";
import { TrainingType, RunningCategory } from "@/types/training";
import { Activity, Calendar, Clock, MapPin, Plus, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AddTraining = () => {
  const navigate = useNavigate();
  const createTraining = useCreateTraining();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    type: '' as TrainingType | '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    duration: '',
    distance: '',
    pace: '',
    calories: '',
    trainerNotes: '',
    traineeNotes: '',
    heartRateAvg: '',
    heartRateMax: '',
    stravaLink: '',
    garminLink: '',
    category: '' as RunningCategory | '',
    exercises: [] as Array<{
      name: string;
      sets: number;
      reps: number;
      weight?: number;
    }>
  });

  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addExercise = () => {
    if (newExercise.name && newExercise.sets && newExercise.reps) {
      setFormData(prev => ({
        ...prev,
        exercises: [...prev.exercises, {
          name: newExercise.name,
          sets: parseInt(newExercise.sets),
          reps: parseInt(newExercise.reps),
          weight: newExercise.weight ? parseFloat(newExercise.weight) : undefined
        }]
      }));
      setNewExercise({ name: '', sets: '', reps: '', weight: '' });
    }
  };

  const removeExercise = (index: number) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.title || !formData.date || !formData.duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    console.log('Form data before submission:', formData);

    const trainingData = {
      user_id: 'user1', // Changed from userId to user_id for FastAPI compatibility
      type: formData.type as TrainingType,
      title: formData.title,
      date: formData.date,
      duration: parseInt(formData.duration),
      exercises: formData.exercises.map((exercise, index) => ({
        id: `ex-${Date.now()}-${index}`,
        ...exercise
      })),
      ...(formData.distance && { distance: parseFloat(formData.distance) }),
      ...(formData.pace && { pace: formData.pace }),
      ...(formData.calories && { calories: parseInt(formData.calories) }),
      ...(formData.trainerNotes && { trainerNotes: formData.trainerNotes }),
      ...(formData.traineeNotes && { traineeNotes: formData.traineeNotes }),
      ...(formData.heartRateAvg && { heartRateAvg: parseInt(formData.heartRateAvg) }),
      ...(formData.heartRateMax && { heartRateMax: parseInt(formData.heartRateMax) }),
      ...(formData.stravaLink && { stravaLink: formData.stravaLink }),
      ...(formData.garminLink && { garminLink: formData.garminLink }),
      ...(formData.category && { category: formData.category as RunningCategory }),
    };

    console.log('Training data to submit:', trainingData);

    createTraining.mutate(trainingData, {
      onSuccess: () => {
        console.log('Training created successfully');
        toast({
          title: "Training Added!",
          description: "Your training has been successfully logged.",
        });
        navigate('/trainings');
      },
      onError: (error) => {
        console.error('Error creating training:', error);
        toast({
          title: "Error",
          description: "Failed to add training. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Training</h1>
          <p className="text-gray-600">Log your completed workout</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Training Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="type">Training Type *</Label>
                  <Select value={formData.type} onValueChange={(value: any) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select training type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="running">Running</SelectItem>
                      <SelectItem value="strength">Strength Training</SelectItem>
                      <SelectItem value="cycling">Cycling</SelectItem>
                      <SelectItem value="swimming">Swimming</SelectItem>
                      <SelectItem value="yoga">Yoga</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                  />
                </div>
              </div>

              {formData.type === 'running' && (
                <div className="space-y-2">
                  <Label htmlFor="category">Running Category</Label>
                  <Select value={formData.category} onValueChange={(value: any) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aerobic">Aerobic</SelectItem>
                      <SelectItem value="intervals">Intervals</SelectItem>
                      <SelectItem value="tempo">Tempo</SelectItem>
                      <SelectItem value="hills">Hills</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Training Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Morning Run, Upper Body Strength"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (min) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="60"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    required
                  />
                </div>

                {(formData.type === 'running' || formData.type === 'cycling') && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="distance">Distance (km)</Label>
                      <Input
                        id="distance"
                        type="number"
                        step="0.1"
                        placeholder="10.0"
                        value={formData.distance}
                        onChange={(e) => handleInputChange('distance', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pace">Pace (per km)</Label>
                      <Input
                        id="pace"
                        placeholder="5:30"
                        value={formData.pace}
                        onChange={(e) => handleInputChange('pace', e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    placeholder="400"
                    value={formData.calories}
                    onChange={(e) => handleInputChange('calories', e.target.value)}
                  />
                </div>
              </div>

              {/* Heart Rate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="heartRateAvg">Average Heart Rate</Label>
                  <Input
                    id="heartRateAvg"
                    type="number"
                    placeholder="150"
                    value={formData.heartRateAvg}
                    onChange={(e) => handleInputChange('heartRateAvg', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heartRateMax">Max Heart Rate</Label>
                  <Input
                    id="heartRateMax"
                    type="number"
                    placeholder="180"
                    value={formData.heartRateMax}
                    onChange={(e) => handleInputChange('heartRateMax', e.target.value)}
                  />
                </div>
              </div>

              {/* External Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stravaLink">Strava Link</Label>
                  <Input
                    id="stravaLink"
                    type="url"
                    placeholder="https://strava.com/activities/..."
                    value={formData.stravaLink}
                    onChange={(e) => handleInputChange('stravaLink', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="garminLink">Garmin Link</Label>
                  <Input
                    id="garminLink"
                    type="url"
                    placeholder="https://garmin.com/activities/..."
                    value={formData.garminLink}
                    onChange={(e) => handleInputChange('garminLink', e.target.value)}
                  />
                </div>
              </div>

              {/* Exercises for Strength Training */}
              {formData.type === 'strength' && (
                <div className="space-y-4">
                  <Label>Exercises</Label>
                  
                  {/* Add Exercise Form */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                    <Input
                      placeholder="Exercise name"
                      value={newExercise.name}
                      onChange={(e) => setNewExercise(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Input
                      type="number"
                      placeholder="Sets"
                      value={newExercise.sets}
                      onChange={(e) => setNewExercise(prev => ({ ...prev, sets: e.target.value }))}
                    />
                    <Input
                      type="number"
                      placeholder="Reps"
                      value={newExercise.reps}
                      onChange={(e) => setNewExercise(prev => ({ ...prev, reps: e.target.value }))}
                    />
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Weight (kg)"
                      value={newExercise.weight}
                      onChange={(e) => setNewExercise(prev => ({ ...prev, weight: e.target.value }))}
                    />
                    <Button type="button" onClick={addExercise}>Add</Button>
                  </div>

                  {/* Exercise List */}
                  {formData.exercises.length > 0 && (
                    <div className="space-y-2">
                      {formData.exercises.map((exercise, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <span className="font-medium">{exercise.name}</span>
                            <span className="text-gray-600 ml-2">
                              {exercise.sets} sets × {exercise.reps} reps
                              {exercise.weight && ` @ ${exercise.weight}kg`}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExercise(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trainerNotes">Trainer Notes</Label>
                  <Textarea
                    id="trainerNotes"
                    placeholder="Coach feedback and observations..."
                    value={formData.trainerNotes}
                    onChange={(e) => handleInputChange('trainerNotes', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="traineeNotes">Trainee Notes</Label>
                  <Textarea
                    id="traineeNotes"
                    placeholder="How did you feel during the workout..."
                    value={formData.traineeNotes}
                    onChange={(e) => handleInputChange('traineeNotes', e.target.value)}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-4">
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={createTraining.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {createTraining.isPending ? 'Saving...' : 'Save Training'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/trainings')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AddTraining;
