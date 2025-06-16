
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { TrainingProvider, useTraining } from "@/contexts/TrainingContext";
import { Activity, Calendar, Clock, TrendingUp, Plus } from "lucide-react";

const DashboardContent = () => {
  const { trainings, plannedTrainings } = useTraining();
  
  const recentTrainings = trainings.slice(0, 3);
  const totalTrainings = trainings.length;
  const thisWeekTrainings = trainings.filter(t => {
    const trainingDate = new Date(t.date);
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    return trainingDate >= weekStart;
  }).length;
  
  const totalDistance = trainings
    .filter(t => t.type === 'running')
    .reduce((sum, t) => sum + (t.distance || 0), 0);

  const upcomingPlanned = plannedTrainings
    .filter(p => new Date(p.date) >= new Date())
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Track your fitness journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trainings</CardTitle>
              <Activity className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTrainings}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{thisWeekTrainings}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
              <TrendingUp className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDistance.toFixed(1)} km</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
              <Clock className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalTrainings > 0 ? Math.round(trainings.reduce((sum, t) => sum + t.duration, 0) / totalTrainings) : 0} min
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Trainings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Trainings</CardTitle>
              <Link to="/trainings">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentTrainings.map((training) => (
                <div key={training.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${training.type === 'running' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium">{training.title}</h3>
                      <p className="text-sm text-gray-500">{training.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{training.duration} min</p>
                    {training.distance && <p className="text-sm text-gray-500">{training.distance} km</p>}
                  </div>
                </div>
              ))}
              
              <Link to="/add-training">
                <Button className="w-full" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Training
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Upcoming Planned */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Upcoming Plans</CardTitle>
              <Link to="/weekly-plan">
                <Button variant="outline" size="sm">View Plan</Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingPlanned.length > 0 ? (
                upcomingPlanned.map((planned) => (
                  <div key={planned.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${planned.type === 'running' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium">{planned.title}</h3>
                        <p className="text-sm text-gray-500">{planned.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{planned.plannedDuration} min</p>
                      {planned.plannedDistance && <p className="text-sm text-gray-500">{planned.plannedDistance} km</p>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No upcoming planned trainings</p>
                  <Link to="/weekly-plan">
                    <Button className="mt-4" size="sm">
                      Plan Your Week
                    </Button>
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

const Index = () => {
  return (
    <TrainingProvider>
      <DashboardContent />
    </TrainingProvider>
  );
};

export default Index;
