
import { useState } from "react";
import { Calendar, Plus, Clock, MapPin, Heart, Target, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import DayTrainingCard from "@/components/weekly-plan/DayTrainingCard";
import WeeklySummaryCard from "@/components/weekly-plan/WeeklySummaryCard";
import AddTrainingModal from "@/components/weekly-plan/AddTrainingModal";
import { useWeeklyPlan } from "@/hooks/useWeeklyPlan";

const WeeklyPlan = () => {
  const [selectedWeek, setSelectedWeek] = useState(0); // 0 = current week, 1 = next week, -1 = last week
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  
  const { weekData, updateTraining, addTraining, deleteTraining } = useWeeklyPlan(selectedWeek);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const getWeekDateRange = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + 1 + (selectedWeek * 7));
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    return {
      start: monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      end: sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  };

  const handleAddTraining = (day: string) => {
    setSelectedDay(day);
    setIsAddModalOpen(true);
  };

  const handleSaveTraining = (trainingData: any) => {
    addTraining(selectedDay!, trainingData);
    setIsAddModalOpen(false);
    setSelectedDay(null);
  };

  const weekRange = getWeekDateRange();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Weekly Training Plan</h1>
              <p className="text-gray-600">Managing training schedule for athlete</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedWeek(selectedWeek - 1)}
                >
                  ← Previous
                </Button>
                <Badge variant="outline" className="text-sm">
                  {weekRange.start} - {weekRange.end}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedWeek(selectedWeek + 1)}
                >
                  Next →
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Daily Training View */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Daily Training Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {days.map((day, index) => (
                    <DayTrainingCard
                      key={day}
                      day={day}
                      dayIndex={index}
                      training={weekData.days[day]}
                      selectedWeek={selectedWeek}
                      onAddTraining={() => handleAddTraining(day)}
                      onUpdateTraining={updateTraining}
                      onDeleteTraining={deleteTraining}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Summary Sidebar */}
          <div className="lg:col-span-1">
            <WeeklySummaryCard weekData={weekData} />
          </div>
        </div>

        {/* Add Training Modal */}
        <AddTrainingModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setSelectedDay(null);
          }}
          onSave={handleSaveTraining}
          selectedDay={selectedDay}
        />
      </main>
    </div>
  );
};

export default WeeklyPlan;
