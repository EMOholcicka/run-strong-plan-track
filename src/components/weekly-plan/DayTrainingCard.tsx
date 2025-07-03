
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, MapPin, Heart, Target, Edit2, Trash2 } from "lucide-react";
import { DayTraining, IntensityLevel, TrainingStatus } from "@/types/weeklyPlan";

interface DayTrainingCardProps {
  day: string;
  dayIndex: number;
  training: DayTraining | null;
  selectedWeek: number;
  onAddTraining: () => void;
  onUpdateTraining: (dayTraining: DayTraining) => void;
  onDeleteTraining: (id: string) => void;
}

const DayTrainingCard = ({
  day,
  dayIndex,
  training,
  selectedWeek,
  onAddTraining,
  onUpdateTraining,
  onDeleteTraining
}: DayTrainingCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const getStatusIcon = (status: TrainingStatus) => {
    switch (status) {
      case 'planned':
        return '🕓';
      case 'completed':
        return '✅';
      case 'missed':
        return '❌';
      default:
        return '🕓';
    }
  };

  const getIntensityColor = (intensity: IntensityLevel) => {
    switch (intensity) {
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActivityTypeColor = (activityType: string) => {
    const colors = {
      'Easy Run': 'bg-blue-100 text-blue-800',
      'Intervals': 'bg-purple-100 text-purple-800',
      'Tempo Run': 'bg-orange-100 text-orange-800',
      'Long Run': 'bg-indigo-100 text-indigo-800',
      'Hill Run': 'bg-teal-100 text-teal-800',
      'Strength Training': 'bg-red-100 text-red-800',
      'Cross Training': 'bg-pink-100 text-pink-800',
      'Rest': 'bg-gray-100 text-gray-800'
    };
    return colors[activityType as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCurrentDate = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + 1 + (selectedWeek * 7));
    monday.setDate(monday.getDate() + dayIndex);
    return monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!training) {
    return (
      <Card className="border-dashed border-2 border-gray-200 hover:border-gray-300 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{day}</h3>
              <p className="text-sm text-gray-500">{getCurrentDate()}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onAddTraining}
              className="text-gray-400 hover:text-gray-600"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Training
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{day}</h3>
                <p className="text-sm text-gray-500">{getCurrentDate()}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getStatusIcon(training.status)}</span>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteTraining(training.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Badge className={getActivityTypeColor(training.activityType)}>
                  {training.activityType}
                </Badge>
                <Badge className={getIntensityColor(training.intensity)} variant="outline">
                  {training.intensity}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                {training.duration && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{training.duration} min</span>
                  </div>
                )}
                {training.distance && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{training.distance} km</span>
                  </div>
                )}
                {training.heartRateZone && (
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-gray-400" />
                    <span>Zone {training.heartRateZone}</span>
                  </div>
                )}
                {training.rpe && (
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-gray-400" />
                    <span>RPE {training.rpe}/10</span>
                  </div>
                )}
              </div>

              {training.notes && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-700">{training.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DayTrainingCard;
