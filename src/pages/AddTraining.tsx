
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import { TrainingProvider, useTraining, Exercise } from "@/contexts/TrainingContext";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AddTrainingContent = () => {
  const navigate = useNavigate();
  const { addTraining } = useTraining();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    type: '' as 'running' | 'strength' | '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    duration: '',
    distance: '',
    pace: '',
    calories: '',
    avgHeartRate: '',
    maxHeartRate: '',
    notes: ''
  });
  
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: '', sets: 0, reps: 0, weight: 0 }
  ]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addExercise = () => {
    setExercises(prev => [...prev, { name: '', sets: 0, reps: 0, weight: 0 }]);
  };

  const removeExercise = (index: number) => {
    setExercises(prev => prev.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: keyof Exercise, value: string | number) => {
    setExercises(prev => prev.map((exercise, i) => 
      i === index ? { ...exercise, [field]: value } : exercise
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.title || !formData.duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const training = {
      type: formData.type,
      title: formData.title,
      date: formData.date,
      duration: parseInt(formData.duration),
      ...(formData.distance && { distance: parseFloat(formData.distance) }),
      ...(formData.pace && { pace: formData.pace }),
      ...(formData.calories && { calories: parseInt(formData.calories) }),
      ...(formData.avgHeartRate && formData.maxHeartRate && {
        heartRate: {
          avg: parseInt(formData.avgHeartRate),
          max: parseInt(formData.maxHeartRate)
        }
      }),
      ...(formData.type === 'strength' && {
        exercises: exercises.filter(ex => ex.name && ex.sets && ex.reps)
      }),
      ...(formData.notes && { notes: formData.notes })
    };

    addTraining(training);
    
    toast({
      title: "Training Added!",
      description: "Your training has been successfully recorded.",
    });
    
    navigate('/trainings');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Training</h1>
          <p className="text-gray-600">Record your workout details</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Training Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Training Type *</Label>
                  <Select value={formData.type} onValueChange={(value: any) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="running">Running</SelectItem>
                      <SelectItem value="strength">Strength Training</SelectItem>
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
              
              <div className="space-y-2">
                <Label htmlFor="title">Training Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Morning Run, Upper Body Workout"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="45"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    required
                  />
                </div>
                
                {formData.type === 'running' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="distance">Distance (km)</Label>
                      <Input
                        id="distance"
                        type="number"
                        step="0.1"
                        placeholder="5.0"
                        value={formData.distance}
                        onChange={(e) => handleInputChange('distance', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pace">Pace (min/km)</Label>
                      <Input
                        id="pace"
                        placeholder="5:30"
                        value={formData.pace}
                        onChange={(e) => handleInputChange('pace', e.target.value)}
                      />
                    </div>
                  </>
                )}
                
                {formData.type === 'strength' && (
                  <div className="space-y-2">
                    <Label htmlFor="calories">Calories</Label>
                    <Input
                      id="calories"
                      type="number"
                      placeholder="300"
                      value={formData.calories}
                      onChange={(e) => handleInputChange('calories', e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Heart Rate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="avgHeartRate">Average Heart Rate</Label>
                  <Input
                    id="avgHeartRate"
                    type="number"
                    placeholder="145"
                    value={formData.avgHeartRate}
                    onChange={(e) => handleInputChange('avgHeartRate', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxHeartRate">Max Heart Rate</Label>
                  <Input
                    id="maxHeartRate"
                    type="number"
                    placeholder="165"
                    value={formData.maxHeartRate}
                    onChange={(e) => handleInputChange('maxHeartRate', e.target.value)}
                  />
                </div>
              </div>

              {/* Exercises for Strength Training */}
              {formData.type === 'strength' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Exercises</Label>
                    <Button type="button" onClick={addExercise} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Exercise
                    </Button>
                  </div>
                  
                  {exercises.map((exercise, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 p-4 bg-gray-50 rounded-lg">
                      <div className="md:col-span-2">
                        <Input
                          placeholder="Exercise name"
                          value={exercise.name}
                          onChange={(e) => updateExercise(index, 'name', e.target.value)}
                        />
                      </div>
                      <Input
                        type="number"
                        placeholder="Sets"
                        value={exercise.sets || ''}
                        onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 0)}
                      />
                      <Input
                        type="number"
                        placeholder="Reps"
                        value={exercise.reps || ''}
                        onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value) || 0)}
                      />
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          placeholder="Weight (kg)"
                          value={exercise.weight || ''}
                          onChange={(e) => updateExercise(index, 'weight', parseFloat(e.target.value) || 0)}
                        />
                        {exercises.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeExercise(index)}
                            size="sm"
                            variant="outline"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="How did the training feel? Any observations..."
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                />
              </div>

              <div className="flex space-x-4">
                <Button type="submit" className="flex-1">
                  Save Training
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
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

const AddTraining = () => {
  return (
    <TrainingProvider>
      <AddTrainingContent />
    </TrainingProvider>
  );
};

export default AddTraining;
