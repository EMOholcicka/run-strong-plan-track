import { useParams, Link, Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import { useTraining, useUpdateTraining } from "@/hooks/useTrainings";
import { Activity, Clock, MapPin, Zap, Calendar, Heart, ArrowLeft, Edit, Star } from "lucide-react";
import { useState } from "react";
import { TrainingType, RunningCategory } from "@/types/training";
import { useToast } from "@/hooks/use-toast";

const TrainingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: training, isLoading } = useTraining(id || '');
  const updateTraining = useUpdateTraining();
  const { toast } = useToast();
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    type: '' as TrainingType | '',
    duration: '',
    distance: '',
    pace: '',
    calories: '',
    trainerNotes: '',
    traineeNotes: '',
    stravaLink: '',
    garminLink: '',
    category: '' as RunningCategory | '',
    rating: ''
  });

  if (!id) {
    return <Navigate to="/trainings" replace />;
  }
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!training) {
    return <Navigate to="/trainings" replace />;
  }

  const openEditDialog = () => {
    setFormData({
      title: training.title,
      type: training.type,
      duration: training.duration.toString(),
      distance: training.distance?.toString() || '',
      pace: training.pace || '',
      calories: training.calories?.toString() || '',
      trainerNotes: training.trainerNotes || '',
      traineeNotes: training.traineeNotes || '',
      stravaLink: training.stravaLink || '',
      garminLink: training.garminLink || '',
      category: training.category || '',
      rating: training.rating?.toString() || ''
    });
    setIsEditOpen(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updates = {
      title: formData.title,
      type: formData.type as TrainingType,
      duration: parseInt(formData.duration),
      ...(formData.distance && { distance: parseFloat(formData.distance) }),
      ...(formData.pace && { pace: formData.pace }),
      ...(formData.calories && { calories: parseInt(formData.calories) }),
      ...(formData.trainerNotes && { trainerNotes: formData.trainerNotes }),
      ...(formData.traineeNotes && { traineeNotes: formData.traineeNotes }),
      ...(formData.stravaLink && { stravaLink: formData.stravaLink }),
      ...(formData.garminLink && { garminLink: formData.garminLink }),
      ...(formData.category && { category: formData.category as RunningCategory }),
      ...(formData.rating && { rating: parseInt(formData.rating) })
    };

    updateTraining.mutate({ id: training.id, updates });
    setIsEditOpen(false);
  };

  const renderRating = (rating?: number) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center space-x-1">
        {[...Array(10)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/10)</span>
      </div>
    );
  };

  const formatTrainerNotes = (notes: string) => {
    if (!notes) return null;
    
    // Split by newlines and process each line
    const lines = notes.split('\n');
    const formattedLines = lines.map((line, index) => {
      // Check if line starts with bullet point indicators
      if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')) {
        return (
          <li key={index} className="ml-4">
            {line.trim().replace(/^[•\-*]\s*/, '')}
          </li>
        );
      }
      // Regular line
      return line.trim() ? (
        <p key={index} className="mb-2">
          {line}
        </p>
      ) : (
        <br key={index} />
      );
    });

    // Check if we have any list items
    const hasListItems = lines.some(line => 
      line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')
    );

    if (hasListItems) {
      return (
        <div>
          {formattedLines.map((line, index) => {
            if (line.type === 'li') {
              return line;
            }
            return line;
          })}
        </div>
      );
    }

    return <div>{formattedLines}</div>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/trainings">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Trainings
            </Button>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{training.title}</h1>
              <div className="flex items-center space-x-4">
                <Badge variant={training.type === 'running' ? 'default' : 'secondary'} className="capitalize">
                  {training.type}
                </Badge>
                <div className="flex items-center text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(training.date).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={openEditDialog}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Training</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="type">Type *</Label>
                      <Select value={formData.type} onValueChange={(value: any) => handleInputChange('type', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="running">Running</SelectItem>
                          <SelectItem value="cycling">Cycling</SelectItem>
                          <SelectItem value="swimming">Swimming</SelectItem>
                          <SelectItem value="strength">Strength Training</SelectItem>
                          <SelectItem value="yoga">Yoga</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (min) *</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration}
                        onChange={(e) => handleInputChange('duration', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="distance">Distance (km)</Label>
                      <Input
                        id="distance"
                        type="number"
                        step="0.1"
                        value={formData.distance}
                        onChange={(e) => handleInputChange('distance', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="rating">Rating (1-10)</Label>
                      <Select value={formData.rating} onValueChange={(value) => handleInputChange('rating', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Rate difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(10)].map((_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {i + 1} - {i === 0 ? 'Super Easy' : i === 9 ? 'Could not finish' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stravaLink">Strava Link</Label>
                      <Input
                        id="stravaLink"
                        type="url"
                        placeholder="https://strava.com/..."
                        value={formData.stravaLink}
                        onChange={(e) => handleInputChange('stravaLink', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="garminLink">Garmin Link</Label>
                      <Input
                        id="garminLink"
                        type="url"
                        placeholder="https://connect.garmin.com/..."
                        value={formData.garminLink}
                        onChange={(e) => handleInputChange('garminLink', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trainerNotes">Trainer Notes</Label>
                    <Textarea
                      id="trainerNotes"
                      placeholder="Coach notes and feedback..."
                      value={formData.trainerNotes}
                      onChange={(e) => handleInputChange('trainerNotes', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="traineeNotes">Trainee Notes</Label>
                    <Textarea
                      id="traineeNotes"
                      placeholder="Your thoughts and feelings about the training..."
                      value={formData.traineeNotes}
                      onChange={(e) => handleInputChange('traineeNotes', e.target.value)}
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button type="submit" className="flex-1">
                      Update Training
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Stats */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Training Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold">{training.duration}</p>
                    <p className="text-sm text-gray-500">Minutes</p>
                  </div>
                  
                  {training.distance && (
                    <div className="text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                        <MapPin className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold">{training.distance}</p>
                      <p className="text-sm text-gray-500">Kilometers</p>
                    </div>
                  )}
                  
                  {training.pace && (
                    <div className="text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
                        <Activity className="h-6 w-6 text-purple-600" />
                      </div>
                      <p className="text-2xl font-bold">{training.pace}</p>
                      <p className="text-sm text-gray-500">Per km</p>
                    </div>
                  )}
                  
                  {training.calories && (
                    <div className="text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2">
                        <Zap className="h-6 w-6 text-orange-600" />
                      </div>
                      <p className="text-2xl font-bold">{training.calories}</p>
                      <p className="text-sm text-gray-500">Calories</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {training.rating && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-500" />
                    Training Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderRating(training.rating)}
                  <p className="text-sm text-gray-500 mt-2">
                    {training.rating <= 3 ? 'Easy session' : 
                     training.rating <= 6 ? 'Moderate effort' : 
                     training.rating <= 8 ? 'Hard session' : 'Very challenging'}
                  </p>
                </CardContent>
              </Card>
            )}

            {(training.heartRateAvg || training.heartRateMax) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-500" />
                    Heart Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    {training.heartRateAvg && (
                      <div className="text-center">
                        <p className="text-3xl font-bold text-red-500">{training.heartRateAvg}</p>
                        <p className="text-sm text-gray-500">Average BPM</p>
                      </div>
                    )}
                    {training.heartRateMax && (
                      <div className="text-center">
                        <p className="text-3xl font-bold text-red-600">{training.heartRateMax}</p>
                        <p className="text-sm text-gray-500">Maximum BPM</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {training.exercises && training.exercises.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Exercises</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {training.exercises.map((exercise, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium">{exercise.name}</h3>
                          <p className="text-sm text-gray-500">
                            {exercise.sets} sets × {exercise.reps} reps
                            {exercise.weight && ` @ ${exercise.weight}kg`}
                          </p>
                        </div>
                        <Zap className="h-5 w-5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Notes Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trainer Notes</CardTitle>
              </CardHeader>
              <CardContent>
                {training.trainerNotes ? (
                  <div className="text-gray-700 leading-relaxed">
                    {formatTrainerNotes(training.trainerNotes)}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No trainer notes for this training.</p>
                )}
              </CardContent>
            </Card>

            {/* Merged Trainee Notes and Rating */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Trainee Notes</span>
                  {training.rating && (
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      {renderRating(training.rating)}
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {training.traineeNotes ? (
                  <p className="text-gray-700 leading-relaxed">{training.traineeNotes}</p>
                ) : (
                  <p className="text-gray-500 italic">No trainee notes for this training.</p>
                )}
                {training.rating && (
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      {training.rating <= 3 ? 'Easy session' : 
                       training.rating <= 6 ? 'Moderate effort' : 
                       training.rating <= 8 ? 'Hard session' : 'Very challenging'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {(training.stravaLink || training.garminLink) && (
              <Card>
                <CardHeader>
                  <CardTitle>External Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {training.stravaLink && (
                    <a
                      href={training.stravaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full"
                    >
                      <Button variant="outline" className="w-full">
                        View on Strava
                      </Button>
                    </a>
                  )}
                  {training.garminLink && (
                    <a
                      href={training.garminLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full"
                    >
                      <Button variant="outline" className="w-full">
                        View on Garmin Connect
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium capitalize">{training.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium">{new Date(training.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-medium">{training.duration} min</span>
                </div>
                {training.distance && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Distance</span>
                    <span className="font-medium">{training.distance} km</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrainingDetail;
