
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { TrainingProvider, useTraining } from "@/contexts/TrainingContext";
import { Calendar, Activity, Clock, MapPin, Dumbbell, Flame, Weight } from "lucide-react";

const MicroCycleContent = () => {
  const { getWeeklyStats, getPlannedWeeklyStatsForWeek } = useTraining();
  
  // Get stats for previous 3 weeks, current week, and next week
  const getWeekData = (weekOffset: number) => {
    const actualStats = getWeeklyStats(weekOffset);
    const plannedStats = getPlannedWeeklyStatsForWeek(weekOffset);
    
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + 1 + (weekOffset * 7)); // Monday start
    
    const weekStart = new Date(monday);
    const weekEnd = new Date(monday);
    weekEnd.setDate(monday.getDate() + 6); // Sunday end
    
    return {
      weekStart,
      weekEnd,
      actualStats,
      plannedStats,
      weekOffset
    };
  };

  // Desktop order: 3 weeks ago to next week
  const desktopWeeks = [
    getWeekData(-3), // 3 weeks ago
    getWeekData(-2), // 2 weeks ago
    getWeekData(-1), // Last week
    getWeekData(0),  // Current week
    getWeekData(1)   // Next week
  ];

  // Mobile order: Current week first, then next week, then previous weeks
  const mobileWeeks = [
    getWeekData(0),  // Current week
    getWeekData(1),  // Next week
    getWeekData(-1), // Previous week
    getWeekData(-2), // 2 weeks ago
    getWeekData(-3)  // 3 weeks ago
  ];

  const formatDateRange = (start: Date, end: Date) => {
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${startStr} - ${endStr}`;
  };

  const getWeekLabel = (weekOffset: number) => {
    if (weekOffset === -3) return "3 Weeks Ago";
    if (weekOffset === -2) return "2 Weeks Ago";
    if (weekOffset === -1) return "Previous Week";
    if (weekOffset === 0) return "Current Week";
    if (weekOffset === 1) return "Next Week";
    return "";
  };

  const getCardStyle = (weekOffset: number) => {
    if (weekOffset === 0) return "ring-2 ring-blue-500 bg-blue-50";
    if (weekOffset === 1) return "bg-green-50 border-green-200";
    return "bg-gray-50";
  };

  const WeekCard = ({ week, index }: { week: any; index: number }) => (
    <Card key={index} className={getCardStyle(week.weekOffset)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-center">
          {getWeekLabel(week.weekOffset)}
        </CardTitle>
        <p className="text-xs text-gray-500 text-center">
          {formatDateRange(week.weekStart, week.weekEnd)}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Running Stats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Activity className="h-3 w-3 text-blue-600" />
              <span className="text-xs text-gray-600">Running</span>
            </div>
            <span className="text-sm font-medium">
              {week.weekOffset <= 0 
                ? week.actualStats.totalSessions - week.actualStats.strengthDuration / 60
                : Math.round(week.plannedStats.totalSessions * 0.7) // Estimate for future weeks
              }
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3 text-blue-600" />
              <span className="text-xs text-gray-600">Distance</span>
            </div>
            <span className="text-sm font-medium">
              {week.weekOffset <= 0 
                ? `${week.actualStats.totalDistance.toFixed(1)} km`
                : `${week.plannedStats.totalPlannedDistance.toFixed(1)} km`
              }
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3 text-blue-600" />
              <span className="text-xs text-gray-600">Duration</span>
            </div>
            <span className="text-sm font-medium">
              {week.weekOffset <= 0 
                ? `${week.actualStats.runningDuration} min`
                : `${Math.round(week.plannedStats.totalPlannedDuration * 0.7)} min`
              }
            </span>
          </div>
        </div>

        <div className="border-t pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Dumbbell className="h-3 w-3 text-purple-600" />
              <span className="text-xs text-gray-600">Strength</span>
            </div>
            <span className="text-sm font-medium">
              {week.weekOffset <= 0 
                ? Math.round(week.actualStats.strengthDuration / 60)
                : Math.round(week.plannedStats.totalSessions * 0.3)
              }
            </span>
          </div>
        </div>

        <div className="border-t pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Flame className="h-3 w-3 text-orange-600" />
              <span className="text-xs text-gray-600">Load</span>
            </div>
            <span className="text-sm font-medium">
              {week.weekOffset <= 0 
                ? Math.round(week.actualStats.totalDuration * 2.5) // Estimated Garmin load
                : Math.round(week.plannedStats.totalPlannedDuration * 2.5)
              }
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Flame className="h-3 w-3 text-red-600" />
              <span className="text-xs text-gray-600">Calories</span>
            </div>
            <span className="text-sm font-medium">
              {week.weekOffset <= 0 
                ? Math.round(week.actualStats.totalDuration * 8) // Estimated calories
                : Math.round(week.plannedStats.totalPlannedDuration * 8)
              }
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Weight className="h-3 w-3 text-gray-600" />
              <span className="text-xs text-gray-600">Weight</span>
            </div>
            <span className="text-sm font-medium">
              {week.weekOffset <= 0 ? "72.5 kg" : "72.3 kg"} {/* Mock data */}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Micro Cycle Overview</h1>
          <p className="text-gray-600">Track your training load development and progression over time</p>
        </div>

        {/* Desktop Layout: Horizontal */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-6">
          {desktopWeeks.map((week, index) => (
            <WeekCard key={index} week={week} index={index} />
          ))}
        </div>

        {/* Mobile Layout: Vertical, Current Week First */}
        <div className="grid grid-cols-1 lg:hidden gap-4">
          {mobileWeeks.map((week, index) => (
            <WeekCard key={index} week={week} index={index} />
          ))}
        </div>

        {/* Training Load Trend */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Training Load Progression
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                Your training load shows a progressive increase with planned recovery periods.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {desktopWeeks[3].actualStats.totalDuration}
                  </p>
                  <p className="text-sm text-gray-500">Current Week Load (min)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {desktopWeeks[4].plannedStats.totalPlannedDuration}
                  </p>
                  <p className="text-sm text-gray-500">Next Week Planned (min)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round(((desktopWeeks[3].actualStats.totalDuration - desktopWeeks[2].actualStats.totalDuration) / desktopWeeks[2].actualStats.totalDuration * 100))}%
                  </p>
                  <p className="text-sm text-gray-500">Week-over-Week Change</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

const MicroCycle = () => {
  return (
    <TrainingProvider>
      <MicroCycleContent />
    </TrainingProvider>
  );
};

export default MicroCycle;
