import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { trainingService } from '@/services/trainingService';
import { Training, PlannedTraining } from '@/types/training';
import { useToast } from '@/hooks/use-toast';

// Query Keys
export const TRAINING_KEYS = {
  all: ['trainings'] as const,
  lists: () => [...TRAINING_KEYS.all, 'list'] as const,
  list: (filters: string) => [...TRAINING_KEYS.lists(), { filters }] as const,
  details: () => [...TRAINING_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...TRAINING_KEYS.details(), id] as const,
  planned: ['planned-trainings'] as const,
  infinite: () => [...TRAINING_KEYS.all, 'infinite'] as const,
};

// Trainings Hooks
export const useTrainings = (limit?: number) => {
  return useQuery({
    queryKey: [...TRAINING_KEYS.lists(), { limit }],
    queryFn: () => trainingService.getTrainings(limit),
  });
};

// Infinite query for lazy loading
export const useInfiniteTrainings = (pageSize: number = 10) => {
  return useInfiniteQuery({
    queryKey: TRAINING_KEYS.infinite(),
    queryFn: ({ pageParam = 0 }) => trainingService.getTrainings(pageSize, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < pageSize) return undefined;
      return allPages.length * pageSize;
    },
    initialPageParam: 0,
  });
};

export const useTraining = (id: string) => {
  return useQuery({
    queryKey: TRAINING_KEYS.detail(id),
    queryFn: () => trainingService.getTrainingById(id),
    enabled: !!id,
  });
};

export const useCreateTraining = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (trainingData: Omit<Training, 'id' | 'createdAt' | 'updatedAt'>) => {
      console.log('useCreateTraining mutationFn called with:', trainingData);
      console.log('trainingService:', trainingService);
      console.log('trainingService.createTraining:', trainingService.createTraining);
      return trainingService.createTraining(trainingData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINING_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: TRAINING_KEYS.infinite() });
      toast({
        title: "Training added",
        description: "Your training has been successfully recorded.",
      });
    },
    onError: (error) => {
      console.error('useCreateTraining error:', error);
      toast({
        title: "Error",
        description: "Failed to add training. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateTraining = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Training> }) =>
      trainingService.updateTraining(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: TRAINING_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: TRAINING_KEYS.infinite() });
      queryClient.invalidateQueries({ queryKey: TRAINING_KEYS.detail(data.id) });
      toast({
        title: "Training updated",
        description: "Your training has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update training. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteTraining = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: trainingService.deleteTraining,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINING_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: TRAINING_KEYS.infinite() });
      toast({
        title: "Training deleted",
        description: "Your training has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete training. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Planned Trainings Hooks
export const usePlannedTrainings = () => {
  return useQuery({
    queryKey: TRAINING_KEYS.planned,
    queryFn: trainingService.getPlannedTrainings,
  });
};

export const useCreatePlannedTraining = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: trainingService.createPlannedTraining,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINING_KEYS.planned });
      toast({
        title: "Training planned",
        description: "Your training has been successfully planned.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to plan training. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdatePlannedTraining = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<PlannedTraining> }) =>
      trainingService.updatePlannedTraining(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINING_KEYS.planned });
      toast({
        title: "Plan updated",
        description: "Your training plan has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update plan. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useDeletePlannedTraining = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: trainingService.deletePlannedTraining,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINING_KEYS.planned });
      toast({
        title: "Plan deleted",
        description: "Your training plan has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete plan. Please try again.",
        variant: "destructive",
      });
    },
  });
};
