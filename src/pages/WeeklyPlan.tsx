
import { useState } from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { TrainingType, PlannedTraining } from "@/types/training";
import { usePlannedTrainings, useCreatePlannedTraining, useUpdatePlannedTraining, useDeletePlannedTraining } from "@/hooks/useTrainings";
import { Plus } from "lucide-react";

const WeeklyPlan = () => {
  const [selectedType, setSelectedType] = useState<TrainingType>("running");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [distance, setDistance] = useState("");
  const [plannedDate, setPlannedDate] = useState(new Date().toISOString().split('T')[0]);

  const {
    data: trainings = [],
    isLoading,
    isError,
    error,
  } = usePlannedTrainings();

  const createPlannedMutation = useCreatePlannedTraining();
  const updatePlannedMutation = useUpdatePlannedTraining();
  const deletePlannedMutation = useDeletePlannedTraining();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    const plannedDuration = parseInt(duration, 10);
    const plannedDistance = distance ? parseFloat(distance) : undefined;

    if (isNaN(plannedDuration) || plannedDuration <= 0) {
      alert("Please enter a valid duration in minutes.");
      return;
    }

    const newPlan: Omit<PlannedTraining, 'id' | 'createdAt' | 'updatedAt'> = {
      user_id: "user123",
      type: selectedType,
      title: title,
      plannedDate: plannedDate,
      plannedDuration: plannedDuration,
      plannedDistance: plannedDistance,
      completed: false,
    };

    try {
      console.log('Submitting new plan:', newPlan);
      await createPlannedMutation.mutateAsync(newPlan);
      console.log('Plan created successfully');

      // Reset form
      setSelectedType("running");
      setTitle("");
      setDuration("");
      setDistance("");
    } catch (error) {
      console.error('Error creating plan:', error);
      alert('Failed to create training plan. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Weekly Training Plan</h1>
          <p className="text-gray-600">Plan your training sessions for the week</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Plan Your Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add Training Plan Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as TrainingType)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="running">Running</option>
                  <option value="cycling">Cycling</option>
                  <option value="swimming">Swimming</option>
                  <option value="strength">Strength</option>
                  <option value="yoga">Yoga</option>
                  <option value="other">Other</option>
                </select>
                
                <input
                  type="text"
                  placeholder="Training title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                
                <input
                  type="number"
                  placeholder="Duration (min)"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
                
                {(selectedType === 'running' || selectedType === 'cycling') && (
                  <input
                    type="number"
                    placeholder="Distance (km)"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    className="w-28 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    step="0.1"
                    min="0"
                  />
                )}
                
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={createPlannedMutation.isPending}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Display Planned Trainings */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                This Week's Plan
              </h2>
              {isLoading ? (
                <p>Loading planned trainings...</p>
              ) : isError ? (
                <p>Error: {error?.message || "Failed to load planned trainings"}</p>
              ) : (
                <div className="space-y-4">
                  {trainings.map((training) => (
                    <Card key={training.id} className="bg-gray-50 border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-lg">{training.title}</h3>
                            <p className="text-sm text-gray-500">
                              {formatDate(training.plannedDate)} - {training.type}
                            </p>
                            <p className="text-sm text-gray-600">
                              {training.plannedDuration} minutes
                              {training.plannedDistance && `, ${training.plannedDistance} km`}
                            </p>
                          </div>
                          <div className="space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                // Implement edit functionality here
                                alert('Edit feature is not implemented yet.');
                              }}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => {
                                if (window.confirm("Are you sure you want to delete this training plan?")) {
                                  deletePlannedMutation.mutate(training.id);
                                }
                              }}
                              disabled={deletePlannedMutation.isPending}
                            >
                              {deletePlannedMutation.isPending ? 'Deleting...' : 'Delete'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {trainings.length === 0 && (
                    <p className="text-gray-500">No trainings planned for this week.</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default WeeklyPlan;
