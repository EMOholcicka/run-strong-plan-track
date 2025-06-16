
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Navigation from "@/components/Navigation";
import { TrainingProvider, useTraining, PlannedTraining, RunningCategory } from "@/contexts/TrainingContext";
import { Calendar, Plus, Clock, MapPin, Edit, Trash2, Check, Activity, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCategoryStyle, getCategoryDisplayName } from "@/utils/runningCategories";

const WeeklyPlanContent = () => {
  const { plannedTrainings, addPlannedTraining, updatePlannedTraining, deletePlannedTraining, getPlannedWeeklyStats } = useTraining();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    type: '' as 'running' | 'strength' | '',
    title: '',
    date: '',
    plannedDuration: '',
    plannedDistance: '',
    category: '' as RunningCategory | '',
    notes: ''
  });

  // Get current week dates
  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const weekDates = getCurrentWeekDates();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const plannedStats = getPlannedWeeklyStats();

  const getPlannedTrainingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return plannedTrainings.filter(training => training.date === dateStr);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      type: '',
      title: '',
      date: '',
      plannedDuration: '',
      plannedDistance: '',
      category: '',
      notes: ''
    });
    setEditingId(null);
  };

  const openAddDialog = (date?: Date) => {
    resetForm();
    if (date) {
      setFormData(prev => ({ ...prev, date: date.toISOString().split('T')[0] }));
    }
    setIsDialogOpen(true);
  };

  const openEditDialog = (training: PlannedTraining) => {
    setFormData({
      type: training.type,
      title: training.title,
      date: training.date,
      plannedDuration: training.plannedDuration.toString(),
      plannedDistance: training.plannedDistance?.toString() || '',
      category: training.category || '',
      notes: training.notes || ''
    });
    setEditingId(training.id);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.title || !formData.date || !formData.plannedDuration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const planData = {
      type: formData.type,
      title: formData.title,
      date: formData.date,
      plannedDuration: parseInt(formData.plannedDuration),
      ...(formData.plannedDistance && { plannedDistance: parseFloat(formData.plannedDistance) }),
      ...(formData.category && { category: formData.category as RunningCategory }),
      ...(formData.notes && { notes: formData.notes })
    };

    if (editingId) {
      updatePlannedTraining(editingId, planData);
      toast({
        title: "Plan Updated!",
        description: "Your training plan has been updated.",
      });
    } else {
      addPlannedTraining(planData);
      toast({
        title: "Plan Added!",
        description: "Your training has been planned.",
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const markAsCompleted = (id: string) => {
    updatePlannedTraining(id, { completed: true });
    toast({
      title: "Training Completed!",
      description: "Great job on completing your planned training!",
    });
  };

  const getTrainingCardStyle = (training: PlannedTraining) => {
    if (training.completed) {
      return 'bg-green-50 border-green-200';
    }
    
    if (training.type === 'running' && training.category) {
      return getCategoryStyle(training.category).bgClass;
    }
    
    return training.type === 'running' 
      ? 'bg-blue-50 border-blue-200' 
      : 'bg-purple-50 border-purple-200';
  };

  const getTrainingBadgeStyle = (training: PlannedTraining) => {
    if (training.completed) {
      return 'bg-green-100 text-green-800';
    }
    
    if (training.type === 'running' && training.category) {
      return getCategoryStyle(training.category).badgeClass;
    }
    
    return training.type === 'running'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-purple-100 text-purple-800';
  };

  const getTrainingTypeDisplay = (training: PlannedTraining) => {
    if (training.type === 'running' && training.category) {
      return getCategoryDisplayName(training.category);
    }
    return training.type;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Weekly Training Plan</h1>
            <p className="text-gray-600">Plan and track your weekly workouts</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openAddDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Training Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Edit Training Plan' : 'Add Training Plan'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
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
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Long Run, Upper Body"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plannedDuration">Duration (min) *</Label>
                    <Input
                      id="plannedDuration"
                      type="number"
                      placeholder="60"
                      value={formData.plannedDuration}
                      onChange={(e) => handleInputChange('plannedDuration', e.target.value)}
                      required
                    />
                  </div>
                  
                  {formData.type === 'running' && (
                    <div className="space-y-2">
                      <Label htmlFor="plannedDistance">Distance (km)</Label>
                      <Input
                        id="plannedDistance"
                        type="number"
                        step="0.1"
                        placeholder="10.0"
                        value={formData.plannedDistance}
                        onChange={(e) => handleInputChange('plannedDistance', e.target.value)}
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Training focus, intensity, etc..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    {editingId ? 'Update Plan' : 'Add Plan'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Weekly Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Weekly Plan Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{Math.round(plannedStats.totalPlannedDuration)} min</p>
                <p className="text-sm text-gray-500">Total Planned Time</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{plannedStats.totalPlannedDistance.toFixed(1)} km</p>
                <p className="text-sm text-gray-500">Total Running Distance</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{plannedTrainings.length}</p>
                <p className="text-sm text-gray-500">Total Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Calendar */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-8">
          {weekDates.map((date, index) => {
            const dayTrainings = getPlannedTrainingsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <Card key={index} className={`${isToday ? 'ring-2 ring-blue-500' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-500">
                      {dayNames[index]}
                    </div>
                    <div className={`text-2xl font-bold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                      {date.getDate()}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-2 min-h-[200px]">
                  {dayTrainings.length > 0 ? (
                    dayTrainings.map((training) => (
                      <div
                        key={training.id}
                        className={`p-3 rounded-lg border ${getTrainingCardStyle(training)} overflow-hidden`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${getTrainingBadgeStyle(training)}`}>
                            {getTrainingTypeDisplay(training)}
                          </span>
                          
                          <div className="flex space-x-1 flex-shrink-0 ml-2">
                            {!training.completed && (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => openEditDialog(training)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => markAsCompleted(training.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deletePlannedTraining(training.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <h4 className="font-medium text-sm mb-2 break-words">{training.title}</h4>
                        
                        <div className="flex items-center text-xs text-gray-600 space-x-2 mb-2">
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          <span>{training.plannedDuration}min</span>
                          {training.plannedDistance && (
                            <>
                              <MapPin className="h-3 w-3 flex-shrink-0" />
                              <span>{training.plannedDistance}km</span>
                            </>
                          )}
                        </div>
                        
                        {training.notes && (
                          <p className="text-xs text-gray-600 break-words line-clamp-2">
                            {training.notes}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openAddDialog(date)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Plan
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Week Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Week Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{plannedTrainings.length}</p>
                <p className="text-sm text-gray-500">Total Planned</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {plannedTrainings.filter(t => t.completed).length}
                </p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {plannedTrainings.filter(t => t.type === 'running').length}
                </p>
                <p className="text-sm text-gray-500">Running Sessions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {plannedTrainings.filter(t => t.type === 'strength').length}
                </p>
                <p className="text-sm text-gray-500">Strength Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

const WeeklyPlan = () => {
  return (
    <TrainingProvider>
      <WeeklyPlanContent />
    </TrainingProvider>
  );
};

export default WeeklyPlan;
