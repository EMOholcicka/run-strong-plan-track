import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Navigation from "@/components/Navigation";
import { DroppableDay } from "@/components/DroppableDay";
import { DragDropProvider } from "@/contexts/DragDropContext";
import { useTrainings, usePlannedTrainings, useUpdatePlannedTraining, useCreatePlannedTraining } from "@/hooks/useTrainings";
import { PlannedTraining, RunningCategory, WeeklyPlanStats, TrainingType } from "@/types/training";
import { Calendar, Plus, Target, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WeeklyPlanContent = () => {
  const { data: plannedTrainings = [] } = usePlannedTrainings();
  const updatePlannedTraining = useUpdatePlannedTraining();
  const createPlannedTraining = useCreatePlannedTraining();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    type: '' as TrainingType | '',
    title: '',
    plannedDate: '',
    plannedDuration: '',
    plannedDistance: '',
    category: '' as RunningCategory | '',
    notes: ''
  });

  // Get current week dates starting with Monday
  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + 1);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  // Get previous week dates
  const getPreviousWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - currentDay + 1 - 7);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(lastMonday);
      date.setDate(lastMonday.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const currentWeekDates = getCurrentWeekDates();
  const previousWeekDates = getPreviousWeekDates();
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Calculate weekly stats
  const calculateWeekStats = (weekDates: Date[]): WeeklyPlanStats => {
    const weekStart = weekDates[0].toISOString().split('T')[0];
    const weekEnd = weekDates[6].toISOString().split('T')[0];
    
    const weekTrainings = plannedTrainings.filter(t => 
      t.plannedDate >= weekStart && t.plannedDate <= weekEnd
    );

    return {
      totalPlannedDuration: weekTrainings.reduce((sum, t) => sum + t.plannedDuration, 0),
      totalPlannedDistance: weekTrainings
        .filter(t => t.plannedDistance)
        .reduce((sum, t) => sum + (t.plannedDistance || 0), 0),
      totalSessions: weekTrainings.length
    };
  };

  const currentWeekStats = calculateWeekStats(currentWeekDates);
  const lastWeekStats = calculateWeekStats(previousWeekDates);

  const getPlannedTrainingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return plannedTrainings.filter(training => training.plannedDate === dateStr);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      type: '',
      title: '',
      plannedDate: '',
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
      setFormData(prev => ({ ...prev, plannedDate: date.toISOString().split('T')[0] }));
    }
    setIsDialogOpen(true);
  };

  const openEditDialog = (training: PlannedTraining) => {
    setFormData({
      type: training.type,
      title: training.title,
      plannedDate: training.plannedDate,
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
    
    if (!formData.type || !formData.title || !formData.plannedDate || !formData.plannedDuration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const planData = {
      userId: 'user1',
      type: formData.type as TrainingType,
      title: formData.title,
      plannedDate: formData.plannedDate,
      plannedDuration: parseInt(formData.plannedDuration),
      completed: false,
      ...(formData.plannedDistance && { plannedDistance: parseFloat(formData.plannedDistance) }),
      ...(formData.category && { category: formData.category as RunningCategory }),
      ...(formData.notes && { notes: formData.notes })
    };

    if (editingId) {
      updatePlannedTraining.mutate({ id: editingId, updates: planData });
    } else {
      createPlannedTraining.mutate(planData);
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDropTraining = (trainingId: string, newDate: string) => {
    updatePlannedTraining.mutate({
      id: trainingId,
      updates: { plannedDate: newDate }
    });
  };

  const getComparisonIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return null;
  };

  const getComparisonText = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? '+100%' : '0%';
    const change = ((current - previous) / previous * 100).toFixed(0);
    return `${Number(change) >= 0 ? '+' : ''}${change}%`;
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
                        <SelectItem value="cycling">Cycling</SelectItem>
                        <SelectItem value="swimming">Swimming</SelectItem>
                        <SelectItem value="strength">Strength Training</SelectItem>
                        <SelectItem value="yoga">Yoga</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="plannedDate">Date *</Label>
                    <Input
                      id="plannedDate"
                      type="date"
                      value={formData.plannedDate}
                      onChange={(e) => handleInputChange('plannedDate', e.target.value)}
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
                  
                  {(formData.type === 'running' || formData.type === 'cycling') && (
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <p className="text-2xl font-bold text-blue-600">{Math.round(currentWeekStats.totalPlannedDuration)} min</p>
                  {getComparisonIcon(currentWeekStats.totalPlannedDuration, lastWeekStats.totalPlannedDuration)}
                </div>
                <p className="text-sm text-gray-500 mb-1">Total Planned Time</p>
                <div className="text-xs text-gray-400">
                  vs last week: {getComparisonText(currentWeekStats.totalPlannedDuration, lastWeekStats.totalPlannedDuration)}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <p className="text-2xl font-bold text-green-600">{currentWeekStats.totalPlannedDistance.toFixed(1)} km</p>
                  {getComparisonIcon(currentWeekStats.totalPlannedDistance, lastWeekStats.totalPlannedDistance)}
                </div>
                <p className="text-sm text-gray-500 mb-1">Total Running Distance</p>
                <div className="text-xs text-gray-400">
                  vs last week: {getComparisonText(currentWeekStats.totalPlannedDistance, lastWeekStats.totalPlannedDistance)}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <p className="text-2xl font-bold text-purple-600">{currentWeekStats.totalSessions}</p>
                  {getComparisonIcon(currentWeekStats.totalSessions, lastWeekStats.totalSessions)}
                </div>
                <p className="text-sm text-gray-500 mb-1">Total Sessions</p>
                <div className="text-xs text-gray-400">
                  vs last week: {getComparisonText(currentWeekStats.totalSessions, lastWeekStats.totalSessions)}
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {plannedTrainings.filter(t => t.completed).length}
                </p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Week Calendar */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Week</h2>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {currentWeekDates.map((date, index) => {
              const dayTrainings = getPlannedTrainingsForDate(date);
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <DroppableDay
                  key={index}
                  date={date}
                  dayName={dayNames[index]}
                  trainings={dayTrainings}
                  isToday={isToday}
                  onAddTraining={openAddDialog}
                  onEditTraining={openEditDialog}
                  onDropTraining={handleDropTraining}
                />
              );
            })}
          </div>
        </div>

        {/* Previous Week Calendar */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Previous Week</h2>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {previousWeekDates.map((date, index) => {
              const dayTrainings = getPlannedTrainingsForDate(date);
              
              return (
                <Card key={index} className="bg-gray-50">
                  <CardHeader className="pb-3">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-500">
                        {dayNames[index]}
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {date.getDate()}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-2 min-h-[200px]">
                    {dayTrainings.map((training) => (
                      <div
                        key={training.id}
                        className="p-3 rounded-lg border bg-white opacity-75"
                      >
                        <div className="font-medium text-sm">{training.title}</div>
                        <div className="text-xs text-gray-600">{training.plannedDuration} min</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

const WeeklyPlan = () => {
  return (
    <DragDropProvider>
      <WeeklyPlanContent />
    </DragDropProvider>
  );
};

export default WeeklyPlan;
