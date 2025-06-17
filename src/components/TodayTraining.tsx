
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTraining } from "@/contexts/TrainingContext";
import { Calendar, Plus, Activity, Clock, MapPin } from "lucide-react";

const TodayTraining = () => {
  const { trainings, plannedTrainings } = useTraining();
  
  const today = new Date().toISOString().split('T')[0];
  const todayTraining = trainings.find(t => t.date === today);
  const todayPlanned = plannedTrainings.find(p => p.date === today);
  
  if (todayTraining) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-green-600" />
            Today's Training - Completed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{todayTraining.title}</h3>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 text-gray-500" />
                  <span className="text-sm text-gray-600">{todayTraining.duration} min</span>
                </div>
                {todayTraining.distance && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3 text-gray-500" />
                    <span className="text-sm text-gray-600">{todayTraining.distance} km</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-green-600">
              <Activity className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (todayPlanned) {
    return (
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Today's Planned Training
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{todayPlanned.title}</h3>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 text-gray-500" />
                  <span className="text-sm text-gray-600">{todayPlanned.plannedDuration} min</span>
                </div>
                {todayPlanned.plannedDistance && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3 text-gray-500" />
                    <span className="text-sm text-gray-600">{todayPlanned.plannedDistance} km</span>
                  </div>
                )}
              </div>
            </div>
            <Link to="/add-training">
              <Button size="sm">Mark Complete</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-gray-50 border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-gray-500" />
          Today's Training
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <p className="text-gray-500 mb-3">No training planned for today</p>
          <Link to="/add-training">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Training
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodayTraining;
