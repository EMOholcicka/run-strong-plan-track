
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Training } from "@/types/training";

interface QuickStatsCardProps {
  training: Training;
}

const QuickStatsCard = ({ training }: QuickStatsCardProps) => {
  return (
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
          <span className="font-medium">{new Date(training.date).toLocaleDateString()}</span>
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
  );
};

export default QuickStatsCard;
