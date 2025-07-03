
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Clock, MapPin, Target, TrendingUp } from "lucide-react";
import { WeeklyPlanData } from "@/types/weeklyPlan";

interface WeeklySummaryCardProps {
  weekData: WeeklyPlanData;
}

const WeeklySummaryCard = ({ weekData }: WeeklySummaryCardProps) => {
  const { summary } = weekData;

  const getCompletionPercentage = () => {
    if (summary.plannedTrainingDays === 0) return 0;
    return Math.round((summary.completedTrainingDays / summary.plannedTrainingDays) * 100);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Weekly Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <BarChart3 className="h-5 w-5 mr-2" />
            Weekly Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {summary.completedTrainingDays}/{summary.plannedTrainingDays}
              </div>
              <div className="text-sm text-gray-600">Training Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {getCompletionPercentage()}%
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Total Distance</span>
              </div>
              <span className="font-semibold">{summary.totalDistance.toFixed(1)} km</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Total Duration</span>
              </div>
              <span className="font-semibold">{formatDuration(summary.totalDuration)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Training Load</span>
              </div>
              <span className="font-semibold">{summary.trainingLoad}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Intensity Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Intensity Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge className="bg-green-100 text-green-800">Low</Badge>
              <span className="font-semibold">{summary.intensityBreakdown.low}</span>
            </div>
            <div className="flex items-center justify-between">
              <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
              <span className="font-semibold">{summary.intensityBreakdown.medium}</span>
            </div>
            <div className="flex items-center justify-between">
              <Badge className="bg-red-100 text-red-800">High</Badge>
              <span className="font-semibold">{summary.intensityBreakdown.high}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(summary.activityBreakdown)
              .filter(([_, count]) => count > 0)
              .map(([activity, count]) => (
                <div key={activity} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{activity}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Rest Days */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recovery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {summary.restDays}
            </div>
            <div className="text-sm text-gray-600">Rest Days</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklySummaryCard;
