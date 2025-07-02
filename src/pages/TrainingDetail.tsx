
import { useParams, Link, Navigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { useTraining, useUpdateTraining } from "@/hooks/useTrainings";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { TrainingType, RunningCategory } from "@/types/training";
import TrainingOverviewCard from "@/components/training/TrainingOverviewCard";
import HeartRateCard from "@/components/training/HeartRateCard";
import ExercisesCard from "@/components/training/ExercisesCard";
import TrainerNotesCard from "@/components/training/TrainerNotesCard";
import TraineeNotesCard from "@/components/training/TraineeNotesCard";
import ExternalLinksCard from "@/components/training/ExternalLinksCard";
import QuickStatsCard from "@/components/training/QuickStatsCard";
import EditTrainingDialog from "@/components/training/EditTrainingDialog";

const TrainingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: training, isLoading } = useTraining(id || '');
  const updateTraining = useUpdateTraining();
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
                  {new Date(training.date).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <EditTrainingDialog
              isOpen={isEditOpen}
              onOpenChange={setIsEditOpen}
              onOpen={openEditDialog}
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Stats */}
          <div className="lg:col-span-2 space-y-6">
            <TrainingOverviewCard training={training} />
            
            {(training.heartRateAvg || training.heartRateMax) && (
              <HeartRateCard 
                heartRateAvg={training.heartRateAvg} 
                heartRateMax={training.heartRateMax} 
              />
            )}

            {training.exercises && training.exercises.length > 0 && (
              <ExercisesCard exercises={training.exercises} />
            )}
          </div>

          {/* Notes Sidebar */}
          <div className="space-y-6">
            <TrainerNotesCard trainerNotes={training.trainerNotes} />
            <TraineeNotesCard traineeNotes={training.traineeNotes} rating={training.rating} />
            
            {(training.stravaLink || training.garminLink) && (
              <ExternalLinksCard 
                stravaLink={training.stravaLink} 
                garminLink={training.garminLink} 
              />
            )}

            <QuickStatsCard training={training} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrainingDetail;
