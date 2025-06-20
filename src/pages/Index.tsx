import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import TodayTraining from "@/components/TodayTraining";
import { useTrainings, usePlannedTrainings } from "@/hooks/useTrainings";
import { Activity, Calendar, Clock, MapPin, Plus, Target, TrendingUp, Users, Zap } from "lucide-react";

const Index = () => {
  // Limit trainings to 10 for dashboard - reasonable for landing page
  const { data: trainings = [] } = useTrainings(10);
  const { data: plannedTrainings = [] } = usePlannedTrainings();

  // Get recent trainings (last 5)
  const recentTrainings = trainings
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Get upcoming trainings (next 5 that are not completed)
  const upcomingTrainings = plannedTrainings
    .filter(t => !t.completed && new Date(t.plannedDate) >= new Date())
    .sort((a, b) => new Date(a.plannedDate).getTime() - new Date(b.plannedDate).getTime())
    .slice(0, 5);

  // Calculate stats
  const totalTrainings = trainings.length;
  const thisWeekTrainings = trainings.filter(t => {
    const trainingDate = new Date(t.date);
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay() + 1));
    return trainingDate >= weekStart;
  }).length;

  const totalDistance = trainings
    .filter(t => t.distance)
    .reduce((sum, t) => sum + (t.distance || 0), 0);

  const totalDuration = trainings.reduce((sum, t) => sum + t.duration, 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Training Dashboard</h1>
          <p className="text-gray-600">Track your progress and plan your workouts</p>
        </div>

        {/* Mobile Layout: Today's Training First */}
        <div className="lg:hidden mb-6">
          <TodayTraining />
        </div>

        {/* Stats Cards - Mobile: 2x2 grid with individual cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {/* Total Trainings */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium text-blue-800">Total Trainings</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg lg:text-2xl font-bold text-blue-700">{totalTrainings}</div>
              <p className="text-xs text-blue-600">
                {thisWeekTrainings} this week
              </p>
            </CardContent>
          </Card>
          
          {/* Total Distance */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium text-green-800">Total Distance</CardTitle>
              <MapPin className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg lg:text-2xl font-bold text-green-700">{totalDistance.toFixed(1)} km</div>
              <p className="text-xs text-green-600">
                Running distance
              </p>
            </CardContent>
          </Card>
          
          {/* Total Time */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium text-purple-800">Total Time</CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg lg:text-2xl font-bold text-purple-700">{Math.round(totalDuration / 60)}h</div>
              <p className="text-xs text-purple-600">
                Training hours
              </p>
            </CardContent>
          </Card>
          
          {/* Planned Sessions */}
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium text-orange-800">Planned Sessions</CardTitle>
              <Target className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg lg:text-2xl font-bold text-orange-700">{upcomingTrainings.length}</div>
              <p className="text-xs text-orange-600">
                Upcoming this week
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Desktop: Today's Training */}
          <div className="hidden lg:block">
            <TodayTraining />
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/add-training">
                <Button className="w-full justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  Log New Training
                </Button>
              </Link>
              <Link to="/weekly-plan">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Plan This Week
                </Button>
              </Link>
              <Link to="/trainings">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View All Trainings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Trainings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Recent Trainings
                </div>
                <Link to="/trainings">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentTrainings.length > 0 ? (
                <div className="space-y-3">
                  {recentTrainings.map((training) => (
                    <Link 
                      key={training.id} 
                      to={`/training/${training.id}`}
                      className="block hover:bg-gray-50 p-3 rounded-lg transition-colors border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`p-1 rounded-full ${training.type === 'running' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                            {training.type === 'running' ? <Activity className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
                          </div>
                          <span className="font-medium text-sm">{training.title}</span>
                        </div>
                        <span className="text-xs text-gray-500">{formatDate(training.date)}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {training.duration} min
                        </div>
                        {training.distance && (
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {training.distance} km
                          </div>
                        )}
                        {training.calories && (
                          <div className="flex items-center">
                            <Zap className="h-3 w-3 mr-1" />
                            {training.calories} cal
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">No trainings logged yet</p>
                  <Link to="/add-training">
                    <Button size="sm">Log Your First Training</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Trainings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Trainings
                </div>
                <Link to="/weekly-plan">
                  <Button variant="ghost" size="sm">View Plan</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingTrainings.length > 0 ? (
                <div className="space-y-3">
                  {upcomingTrainings.map((training) => (
                    <div key={training.id} className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`p-1 rounded-full ${training.type === 'running' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                            {training.type === 'running' ? <Activity className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
                          </div>
                          <span className="font-medium text-sm">{training.title}</span>
                        </div>
                        <span className="text-xs text-gray-500">{formatDate(training.plannedDate)}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {training.plannedDuration} min
                        </div>
                        {training.plannedDistance && (
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {training.plannedDistance} km
                          </div>
                        )}
                      </div>
                      {training.notes && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-1">{training.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">No upcoming trainings planned</p>
                  <Link to="/weekly-plan">
                    <Button size="sm">Plan Your Week</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
