
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PlannedTraining } from '@/types/training';

interface DragDropContextType {
  draggingTraining: PlannedTraining | null;
  setDraggingTraining: (training: PlannedTraining | null) => void;
  dragOver: string | null;
  setDragOver: (dayId: string | null) => void;
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
};

interface DragDropProviderProps {
  children: ReactNode;
}

export const DragDropProvider: React.FC<DragDropProviderProps> = ({ children }) => {
  const [draggingTraining, setDraggingTraining] = useState<PlannedTraining | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  return (
    <DragDropContext.Provider 
      value={{
        draggingTraining,
        setDraggingTraining,
        dragOver,
        setDragOver
      }}
    >
      {children}
    </DragDropContext.Provider>
  );
};
