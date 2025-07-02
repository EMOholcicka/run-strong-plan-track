
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface CadenceCardProps {
  cadenceAvg?: number;
  cadenceMax?: number;
}

const CadenceCard = ({ cadenceAvg, cadenceMax }: CadenceCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 mr-2 text-blue-500" />
          Cadence
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          {cadenceAvg && (
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-500">{cadenceAvg}</p>
              <p className="text-sm text-gray-500">Average SPM</p>
            </div>
          )}
          {cadenceMax && (
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{cadenceMax}</p>
              <p className="text-sm text-gray-500">Maximum SPM</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CadenceCard;
