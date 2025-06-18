
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlannedTraining } from '@/types/training';
import { DraggableTrainingCard } from './DraggableTrainingCard';
import { useDragDrop } from '@/contexts/DragDropContext';
import { Plus } from 'lucide-react';

interface DroppableDayProps {
  date: Date;
  dayName: string;
  trainings: PlannedTraining[];
  isToday: boolean;
  onAddTraining: (date: Date) => void;
  onEditTraining: (training: PlannedTraining) => void;
  onDropTraining: (trainingId: string, newDate: string) => void;
}

export const DroppableDay: React.FC<DroppableDayProps> = ({
  date,
  dayName,
  trainings,
  isToday,
  onAddTraining,
  onEditTraining,
  onDropTraining
}) => {
  const { draggingTraining, dragOver, setDragOver } = useDragDrop();
  const dayId = date.toISOString().split('T')[0];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(dayId);
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggingTraining) {
      onDropTraining(draggingTraining.id, dayId);
    }
    setDragOver(null);
  };

  const isDragOver = dragOver === dayId;

  return (
    <Card 
      className={`${isToday ? 'ring-2 ring-blue-500' : ''} ${
        isDragOver ? 'bg-blue-50 border-blue-300' : ''
      } transition-colors`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardHeader className="pb-3">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-500">
            {dayName}
          </div>
          <div className={`text-2xl font-bold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
            {date.getDate()}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2 min-h-[200px]">
        {trainings.length > 0 ? (
          trainings.map((training) => (
            <DraggableTrainingCard
              key={training.id}
              training={training}
              onEdit={onEditTraining}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddTraining(date)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Plan
            </Button>
          </div>
        )}
        
        {isDragOver && (
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center text-blue-600">
            Drop training here
          </div>
        )}
      </CardContent>
    </Card>
  );
};
