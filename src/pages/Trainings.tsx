
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import { useTrainings, useUpdateTraining, useDeleteTraining } from "@/hooks/useTrainings";
import { Training } from "@/types/training";
import { Activity, Clock, MapPin, Zap, Calendar, Eye, Edit, Trash2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Trainings = () => {
  const { data: trainings = [] } = useTrainings();
  const updateTraining = useUpdateTraining();
  const deleteTraining = useDeleteTraining();
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'running' | 'strength'>('all');
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const [editFormData, setEditFormData] = useState({
    title: '',
    duration: '',
    distance: '',
    pace: '',
    calories: '',
    trainerNotes: '',
    traineeNotes: '',
    stravaLink: '',
    garminLink: '',
    heartRateAvg: '',
    heartRateMax: ''
  });
  
  const filteredTrainings = trainings.filter(training => 
    filter === 'all' || training.type === filter
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const openEditDialog = (training: Training) => {
    setEditingTraining(training);
    setEditFormData({
      title: training.title,
      duration: training.duration.toString(),
      distance: training.distance?.toString() || '',
      pace: training.pace || '',
      calories: training.calories?.toString() || '',
      trainerNotes: training.trainerNotes || '',
      traineeNotes: training.traineeNotes || '',
      stravaLink: training.stravaLink || '',
      garminLink: training.garminLink || '',
      heartRateAvg: training.heartRateAvg?.toString() || '',
      heartRateMax: training.heartRateMax?.toString() || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTraining) return;

    const updates: Partial<Training> = {
      title: editFormData.title,
      duration: parseInt(editFormData.duration),
      ...(editFormData.distance && { distance: parseFloat(editFormData.distance) }),
      ...(editFormData.pace && { pace: editFormData.pace }),
      ...(editFormData.calories && { calories: parseInt(editFormData.calories) }),
      ...(editFormData.trainerNotes && { trainerNotes: editFormData.trainerNotes }),
      ...(editFormData.traineeNotes && { traineeNotes: editFormData.traineeNotes }),
      ...(editFormData.stravaLink && { stravaLink: editFormData.stravaLink }),
      ...(editFormData.garminLink && { garminLink: editFormData.garminLink }),
      ...(editFormData.heartRateAvg && { heartRateAvg: parseInt(editFormData.heartRateAvg) }),
      ...(editFormData.heartRateMax && { heartRateMax: parseInt(editFormData.heartRateMax) })
    };

    updateTraining.mutate({ id: editingTraining.id, updates });
    setIsEditDialogOpen(false);
    setEditingTraining(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this training?')) {
      deleteTraining.mutate(id);
    }
  };

  const handleEditInputChange = (field: string, value: string) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Trainings</h1>
            <p className="text-gray-600">{filteredTrainings.length} training sessions</p>
          </div>
          
          <div className="flex space-x-4">
            <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trainings</SelectItem>
                <SelectItem value="running">Running Only</SelectItem>
                <SelectItem value="strength">Strength Only</SelectItem>
              </SelectContent>
            </Select>
            
            <Link to="/add-training">
              <Button>Add New Training</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrainings.map((training) => (
            <Card key={training.id} className="hover:shadow-lg transition-shadow group flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-full ${training.type === 'running' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                    {training.type === 'running' ? <Activity className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialog(training)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(training.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg">{training.title}</CardTitle>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(training.date)}
                </div>
              </CardHeader>
              
              <CardContent className="flex flex-col flex-grow">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{training.duration} min</span>
                  </div>
                  
                  {training.distance && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{training.distance} km</span>
                    </div>
                  )}
                  
                  {training.pace && (
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{training.pace} /km</span>
                    </div>
                  )}
                  
                  {training.calories && (
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{training.calories} cal</span>
                    </div>
                  )}
                </div>

                {(training.stravaLink || training.garminLink) && (
                  <div className="flex space-x-2 mb-3">
                    {training.stravaLink && (
                      <a 
                        href={training.stravaLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-xs text-orange-600 hover:text-orange-700"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Strava
                      </a>
                    )}
                    {training.garminLink && (
                      <a 
                        href={training.garminLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-xs text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Garmin
                      </a>
                    )}
                  </div>
                )}
                
                <div className="flex-grow">
                  {training.trainerNotes && (
                    <div className="mb-2">
                      <p className="text-xs font-medium text-gray-700">Trainer Notes:</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{training.trainerNotes}</p>
                    </div>
                  )}
                  {training.traineeNotes && (
                    <div className="mb-2">
                      <p className="text-xs font-medium text-gray-700">Trainee Notes:</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{training.traineeNotes}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-auto">
                  <Link to={`/training/${training.id}`}>
                    <Button variant="outline" size="sm" className="w-full group-hover:bg-blue-50 group-hover:border-blue-200">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredTrainings.length === 0 && (
          <div className="text-center py-12">
            <Activity className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No trainings found</h3>
            <p className="text-gray-500 mb-4">
              {filter === 'all' ? 'Start tracking your workouts!' : `No ${filter} trainings yet.`}
            </p>
            <Link to="/add-training">
              <Button>Add Your First Training</Button>
            </Link>
          </div>
        )}

        {/* Edit Training Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Training</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={editFormData.title}
                  onChange={(e) => handleEditInputChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">Duration (min) *</Label>
                  <Input
                    id="edit-duration"
                    type="number"
                    value={editFormData.duration}
                    onChange={(e) => handleEditInputChange('duration', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-distance">Distance (km)</Label>
                  <Input
                    id="edit-distance"
                    type="number"
                    step="0.1"
                    value={editFormData.distance}
                    onChange={(e) => handleEditInputChange('distance', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-pace">Pace</Label>
                  <Input
                    id="edit-pace"
                    value={editFormData.pace}
                    onChange={(e) => handleEditInputChange('pace', e.target.value)}
                    placeholder="5:30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-calories">Calories</Label>
                  <Input
                    id="edit-calories"
                    type="number"
                    value={editFormData.calories}
                    onChange={(e) => handleEditInputChange('calories', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-hr-avg">Heart Rate Avg</Label>
                  <Input
                    id="edit-hr-avg"
                    type="number"
                    value={editFormData.heartRateAvg}
                    onChange={(e) => handleEditInputChange('heartRateAvg', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-hr-max">Heart Rate Max</Label>
                  <Input
                    id="edit-hr-max"
                    type="number"
                    value={editFormData.heartRateMax}
                    onChange={(e) => handleEditInputChange('heartRateMax', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-strava">Strava Link</Label>
                  <Input
                    id="edit-strava"
                    type="url"
                    value={editFormData.stravaLink}
                    onChange={(e) => handleEditInputChange('stravaLink', e.target.value)}
                    placeholder="https://strava.com/activities/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-garmin">Garmin Link</Label>
                  <Input
                    id="edit-garmin"
                    type="url"
                    value={editFormData.garminLink}
                    onChange={(e) => handleEditInputChange('garminLink', e.target.value)}
                    placeholder="https://garmin.com/activities/..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-trainer-notes">Trainer Notes</Label>
                <Textarea
                  id="edit-trainer-notes"
                  value={editFormData.trainerNotes}
                  onChange={(e) => handleEditInputChange('trainerNotes', e.target.value)}
                  placeholder="Coach feedback and observations..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-trainee-notes">Trainee Notes</Label>
                <Textarea
                  id="edit-trainee-notes"
                  value={editFormData.traineeNotes}
                  onChange={(e) => handleEditInputChange('traineeNotes', e.target.value)}
                  placeholder="How did you feel during the workout..."
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="flex-1">
                  Update Training
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Trainings;
