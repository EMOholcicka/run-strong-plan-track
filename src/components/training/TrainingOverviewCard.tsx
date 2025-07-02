
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, MapPin, Zap, Calendar } from "lucide-react";
import { Training } from "@/types/training";

interface TrainingOverviewCardProps {
  training: Training;
}

const TrainingOverviewCard = ({ training }: TrainingOverviewCardProps) => {
  return (
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
  );
};

export default TrainingOverviewCard;
