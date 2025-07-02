
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { Exercise } from "@/types/training";

interface ExercisesCardProps {
  exercises: Exercise[];
}

const ExercisesCard = ({ exercises }: ExercisesCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exercises</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">{exercise.name}</h3>
                <p className="text-sm text-gray-500">
                  {exercise.sets} sets × {exercise.reps} reps
                  {exercise.weight && ` @ ${exercise.weight}kg`}
                </p>
              </div>
              <Zap className="h-5 w-5 text-gray-400" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExercisesCard;
