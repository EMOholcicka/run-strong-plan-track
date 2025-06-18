
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlannedTraining } from '@/types/training';
import { useDragDrop } from '@/contexts/DragDropContext';
import { Clock, MapPin, Edit } from 'lucide-react';
import { getCategoryStyle, getCategoryDisplayName } from '@/utils/runningCategories';

interface DraggableTrainingCardProps {
  training: PlannedTraining;
  onEdit: (training: PlannedTraining) => void;
}

export const DraggableTrainingCard: React.FC<DraggableTrainingCardProps> = ({
  training,
  onEdit
}) => {
  const { setDraggingTraining } = useDragDrop();

  const handleDragStart = (e: React.DragEvent) => {
    setDraggingTraining(training);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggingTraining(null);
  };

  const getTrainingCardStyle = () => {
    if (training.completed) {
      return 'bg-green-50 border-green-200';
    }
    
    if (training.type === 'running' && training.category) {
      return getCategoryStyle(training.category).bgClass;
    }
    
    return training.type === 'running' 
      ? 'bg-blue-50 border-blue-200' 
      : 'bg-purple-50 border-purple-200';
  };

  const getTrainingBadgeStyle = () => {
    if (training.completed) {
      return 'bg-green-100 text-green-800';
    }
    
    if (training.type === 'running' && training.category) {
      return getCategoryStyle(training.category).badgeClass;
    }
    
    return training.type === 'running'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-purple-100 text-purple-800';
  };

  const getTrainingTypeDisplay = () => {
    if (training.type === 'running' && training.category) {
      return getCategoryDisplayName(training.category);
    }
    return training.type;
  };

  return (
    <div
      draggable={!training.completed}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`p-3 rounded-lg border ${getTrainingCardStyle()} ${
        !training.completed ? 'cursor-move hover:shadow-md transition-shadow' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className={`text-xs px-2 py-1 rounded-full ${getTrainingBadgeStyle()}`}>
          {getTrainingTypeDisplay()}
        </span>
        
        {!training.completed && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(training)}
            className="h-6 w-6 p-0"
          >
            <Edit className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="font-medium text-sm">{training.title}</div>
        
        <div className="flex items-center text-xs text-gray-600">
          <Clock className="h-3 w-3 mr-1" />
          <span>{training.plannedDuration} min</span>
        </div>
        
        {training.plannedDistance && (
          <div className="flex items-center text-xs text-gray-600">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{training.plannedDistance} km</span>
          </div>
        )}
        
        {training.notes && (
          <div className="text-xs text-gray-600 line-clamp-2">
            {training.notes}
          </div>
        )}
      </div>
    </div>
  );
};
