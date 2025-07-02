
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TraineeNotesCardProps {
  traineeNotes?: string;
  rating?: number;
}

const TraineeNotesCard = ({ traineeNotes, rating }: TraineeNotesCardProps) => {
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(10)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/10)</span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Trainee Notes</span>
          {rating && (
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 text-yellow-500" />
              {renderRating(rating)}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {traineeNotes ? (
          <p className="text-gray-700 leading-relaxed">{traineeNotes}</p>
        ) : (
          <p className="text-gray-500 italic">No trainee notes for this training.</p>
        )}
        {rating && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              {rating <= 3 ? 'Easy session' : 
               rating <= 6 ? 'Moderate effort' : 
               rating <= 8 ? 'Hard session' : 'Very challenging'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TraineeNotesCard;
