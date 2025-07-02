
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

interface HeartRateCardProps {
  heartRateAvg?: number;
  heartRateMax?: number;
}

const HeartRateCard = ({ heartRateAvg, heartRateMax }: HeartRateCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="h-5 w-5 mr-2 text-red-500" />
          Heart Rate
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          {heartRateAvg && (
            <div className="text-center">
              <p className="text-3xl font-bold text-red-500">{heartRateAvg}</p>
              <p className="text-sm text-gray-500">Average BPM</p>
            </div>
          )}
          {heartRateMax && (
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">{heartRateMax}</p>
              <p className="text-sm text-gray-500">Maximum BPM</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HeartRateCard;
