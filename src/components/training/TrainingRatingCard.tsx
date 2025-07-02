
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TrainingRatingCardProps {
  rating: number;
}

const TrainingRatingCard = ({ rating }: TrainingRatingCardProps) => {
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
        <CardTitle className="flex items-center">
          <Star className="h-5 w-5 mr-2 text-yellow-500" />
          Training Rating
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderRating(rating)}
        <p className="text-sm text-gray-500 mt-2">
          {rating <= 3 ? 'Easy session' : 
           rating <= 6 ? 'Moderate effort' : 
           rating <= 8 ? 'Hard session' : 'Very challenging'}
        </p>
      </CardContent>
    </Card>
  );
};

export default TrainingRatingCard;
