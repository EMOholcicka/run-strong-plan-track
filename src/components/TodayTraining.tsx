import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTrainings } from "@/hooks/useTrainings";
import { weeklyPlanService } from "@/services/weeklyPlanService";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Plus, Activity, Clock, MapPin, MoreHorizontal } from "lucide-react";

const TodayTraining = () => {
  const { data: trainings = [] } = useTrainings();
  
  const { data: plannedTrainings = [] } = useQuery({
    queryKey: ['plannedTrainings', 'today'],
    queryFn: () => weeklyPlanService.getTodaysPlannedTrainings(),
  });
  
  const today = new Date().toISOString().split('T')[0];
  const todayTrainings = trainings.filter(t => t.date === today);
  const todayPlanned = plannedTrainings.find(p => p.plannedDate === today && !p.completed);
  
  if (todayTrainings.length > 0) {
    const displayTrainings = todayTrainings.slice(0, 2);
    const hasMore = todayTrainings.length > 2;
    
    return (
      <Card className="bg-green-50 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-green-600" />
            Today's Training - Completed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {displayTrainings.map((training) => (
            <div key={training.id} className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{training.title}</h3>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-gray-500" />
                    <span className="text-sm text-gray-600">{training.duration} min</span>
                  </div>
                  {training.distance && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <span className="text-sm text-gray-600">{training.distance} km</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-green-600">
                <Activity className="h-6 w-6" />
              </div>
            </div>
          ))}
          
          {hasMore && (
            <div className="flex items-center justify-center pt-2 border-t">
              <div className="flex items-center text-sm text-gray-500">
                <MoreHorizontal className="h-4 w-4 mr-1" />
                +{todayTrainings.length - 2} more training{todayTrainings.length - 2 > 1 ? 's' : ''}
              </div>
            </div>
          )}
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
