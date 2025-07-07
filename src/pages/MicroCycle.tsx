
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { microCycleService, type WeekStats } from "@/services/microCycleService";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Activity, Clock, MapPin, Dumbbell, Flame, Weight } from "lucide-react";

const MicroCycle = () => {
  const { data: microCycleData, isLoading } = useQuery({
    queryKey: ['microCycle'],
    queryFn: () => microCycleService.getMicroCycleData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

  const WeekCard = ({ week, index }: { week: WeekStats; index: number }) => (
    <Card key={index} className={getCardStyle(week.week_offset)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-center">
          {getWeekLabel(week.week_offset)}
        </CardTitle>
        <p className="text-xs text-gray-500 text-center">
          {formatDateRange(week.week_start, week.week_end)}
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
            <span className="text-sm font-medium">{week.running_sessions}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3 text-blue-600" />
              <span className="text-xs text-gray-600">Distance</span>
            </div>
            <span className="text-sm font-medium">{week.total_distance.toFixed(1)} km</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3 text-blue-600" />
              <span className="text-xs text-gray-600">Duration</span>
            </div>
            <span className="text-sm font-medium">{week.running_duration} min</span>
          </div>
        </div>

        <div className="border-t pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Dumbbell className="h-3 w-3 text-purple-600" />
              <span className="text-xs text-gray-600">Strength</span>
            </div>
            <span className="text-sm font-medium">{week.strength_sessions}</span>
          </div>
        </div>

        <div className="border-t pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Flame className="h-3 w-3 text-orange-600" />
              <span className="text-xs text-gray-600">Load</span>
            </div>
            <span className="text-sm font-medium">{week.total_load}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Flame className="h-3 w-3 text-red-600" />
              <span className="text-xs text-gray-600">Calories</span>
            </div>
            <span className="text-sm font-medium">{week.total_calories}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Weight className="h-3 w-3 text-gray-600" />
              <span className="text-xs text-gray-600">Weight</span>
            </div>
            <span className="text-sm font-medium">{week.weight}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-8">
            <p className="text-gray-500">Loading micro cycle data...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!microCycleData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-8">
            <p className="text-gray-500">No micro cycle data available</p>
          </div>
        </main>
      </div>
    );
  }

  // Desktop order: 3 weeks ago to next week
  const desktopWeeks = [...microCycleData.weeks].sort((a, b) => a.week_offset - b.week_offset);

  // Mobile order: Current week first, then next week, then previous weeks
  const mobileWeeks = [
    ...microCycleData.weeks.filter(w => w.week_offset === 0),
    ...microCycleData.weeks.filter(w => w.week_offset === 1),
    ...microCycleData.weeks.filter(w => w.week_offset < 0).sort((a, b) => b.week_offset - a.week_offset)
  ];

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
                    {microCycleData.current_week_load}
                  </p>
                  <p className="text-sm text-gray-500">Current Week Load (min)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {microCycleData.next_week_planned}
                  </p>
                  <p className="text-sm text-gray-500">Next Week Planned (min)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {microCycleData.week_over_week_change}%
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

export default MicroCycle;
