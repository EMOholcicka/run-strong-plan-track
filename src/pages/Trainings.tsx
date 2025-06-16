
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import { TrainingProvider, useTraining } from "@/contexts/TrainingContext";
import { Activity, Clock, MapPin, Zap, Calendar, Eye } from "lucide-react";

const TrainingsContent = () => {
  const { trainings } = useTraining();
  const [filter, setFilter] = useState<'all' | 'running' | 'strength'>('all');
  
  const filteredTrainings = trainings.filter(training => 
    filter === 'all' || training.type === filter
  );

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
            <Card key={training.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-full ${training.type === 'running' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                    {training.type === 'running' ? <Activity className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${training.type === 'running' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                    {training.type}
                  </span>
                </div>
                <CardTitle className="text-lg">{training.title}</CardTitle>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {training.date}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
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
                
                {training.notes && (
                  <p className="text-sm text-gray-600 line-clamp-2">{training.notes}</p>
                )}
                
                <Link to={`/training/${training.id}`}>
                  <Button variant="outline" size="sm" className="w-full group-hover:bg-blue-50 group-hover:border-blue-200">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </Link>
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
      </main>
    </div>
  );
};

const Trainings = () => {
  return (
    <TrainingProvider>
      <TrainingsContent />
    </TrainingProvider>
  );
};

export default Trainings;
