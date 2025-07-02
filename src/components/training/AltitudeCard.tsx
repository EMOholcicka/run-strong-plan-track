
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mountain } from "lucide-react";

interface AltitudeCardProps {
  altitudeMin?: number;
  altitudeMax?: number;
  altitudeGain?: number;
  altitudeLoss?: number;
}

const AltitudeCard = ({ altitudeMin, altitudeMax, altitudeGain, altitudeLoss }: AltitudeCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mountain className="h-5 w-5 mr-2 text-green-500" />
          Altitude
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          {altitudeMin !== undefined && (
            <div className="text-center">
              <p className="text-3xl font-bold text-green-500">{altitudeMin}</p>
              <p className="text-sm text-gray-500">Minimum (m)</p>
            </div>
          )}
          {altitudeMax !== undefined && (
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{altitudeMax}</p>
              <p className="text-sm text-gray-500">Maximum (m)</p>
            </div>
          )}
          {altitudeGain !== undefined && (
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-500">{altitudeGain}</p>
              <p className="text-sm text-gray-500">Gain (m)</p>
            </div>
          )}
          {altitudeLoss !== undefined && (
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600">{altitudeLoss}</p>
              <p className="text-sm text-gray-500">Loss (m)</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AltitudeCard;
