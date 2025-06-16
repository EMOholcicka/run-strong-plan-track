
import { RunningCategory } from '@/contexts/TrainingContext';

export const getCategoryStyle = (category: RunningCategory) => {
  switch (category) {
    case 'aerobic':
      return {
        bgClass: 'bg-green-50 border-green-200',
        textClass: 'text-green-800',
        badgeClass: 'bg-green-100 text-green-800'
      };
    case 'intervals':
      return {
        bgClass: 'bg-red-50 border-red-200',
        textClass: 'text-red-800',
        badgeClass: 'bg-red-100 text-red-800'
      };
    case 'tempo':
      return {
        bgClass: 'bg-orange-50 border-orange-200',
        textClass: 'text-orange-800',
        badgeClass: 'bg-orange-100 text-orange-800'
      };
    case 'hills':
      return {
        bgClass: 'bg-yellow-50 border-yellow-200',
        textClass: 'text-yellow-800',
        badgeClass: 'bg-yellow-100 text-yellow-800'
      };
    default:
      return {
        bgClass: 'bg-blue-50 border-blue-200',
        textClass: 'text-blue-800',
        badgeClass: 'bg-blue-100 text-blue-800'
      };
  }
};

export const getCategoryDisplayName = (category: RunningCategory) => {
  switch (category) {
    case 'aerobic':
      return 'Aerobic';
    case 'intervals':
      return 'Intervals';
    case 'tempo':
      return 'Tempo';
    case 'hills':
      return 'Hills';
    default:
      return 'Running';
  }
};
