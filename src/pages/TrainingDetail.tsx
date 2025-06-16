
import { useParams, Link, Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { TrainingProvider, useTraining } from "@/contexts/TrainingContext";
import { Activity, Clock, MapPin, Zap, Calendar, Heart, ArrowLeft, Edit } from "lucide-react";

const TrainingDetailContent = () => {
  const { id } = useParams<{ id: string }>();
  const { getTrainingById } = useTraining();
  
  if (!id) {
    return <Navigate to="/trainings" replace />;
  }
  
  const training = getTrainingById(id);
  
  if (!training) {
    return <Navigate to="/trainings" replace />;
  }

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
                  <Calendar className="h-4 w-4 mr-2" />
                  {training.date}
                </div>
              </div>
            </div>
            
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Stats */}
          <div className="lg:col-span-2 space-y-6">
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

            {training.heartRate && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-500" />
                    Heart Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-red-500">{training.heartRate.avg}</p>
                      <p className="text-sm text-gray-500">Average BPM</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-red-600">{training.heartRate.max}</p>
                      <p className="text-sm text-gray-500">Maximum BPM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {training.exercises && training.exercises.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Exercises</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {training.exercises.map((exercise, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium">{exercise.name}</h3>
                          <p className="text-sm text-gray-500">
                            {exercise.sets} sets × {exercise.reps} reps
                            {exercise.weight && ` @ ${exercise.weight}kg`}
                          </p>
                        </div>
                        <Zap className="h-5 w-5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Notes Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                {training.notes ? (
                  <p className="text-gray-700 leading-relaxed">{training.notes}</p>
                ) : (
                  <p className="text-gray-500 italic">No notes added for this training.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium capitalize">{training.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium">{training.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-medium">{training.duration} min</span>
                </div>
                {training.distance && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Distance</span>
                    <span className="font-medium">{training.distance} km</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

const TrainingDetail = () => {
  return (
    <TrainingProvider>
      <TrainingDetailContent />
    </TrainingProvider>
  );
};

export default TrainingDetail;
