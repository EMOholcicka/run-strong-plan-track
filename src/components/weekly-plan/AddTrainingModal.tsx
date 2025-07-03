
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ActivityType, IntensityLevel } from "@/types/weeklyPlan";

interface AddTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trainingData: any) => void;
  selectedDay: string | null;
}

const AddTrainingModal = ({ isOpen, onClose, onSave, selectedDay }: AddTrainingModalProps) => {
  const [formData, setFormData] = useState({
    activityType: '' as ActivityType,
    duration: '',
    distance: '',
    intensity: '' as IntensityLevel,
    heartRateZone: '',
    rpe: '',
    notes: ''
  });

  const activityTypes: ActivityType[] = [
    'Easy Run',
    'Intervals', 
    'Tempo Run',
    'Long Run',
    'Hill Run',
    'Strength Training',
    'Cross Training',
    'Rest'
  ];

  const intensityLevels: IntensityLevel[] = ['Low', 'Medium', 'High'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.activityType) {
      alert('Please select an activity type');
      return;
    }

    const trainingData = {
      activityType: formData.activityType,
      duration: formData.duration ? parseInt(formData.duration) : undefined,
      distance: formData.distance ? parseFloat(formData.distance) : undefined,
      intensity: formData.intensity || 'Medium',
      heartRateZone: formData.heartRateZone || undefined,
      rpe: formData.rpe ? parseInt(formData.rpe) : undefined,
      notes: formData.notes || undefined,
      status: 'planned' as const
    };

    onSave(trainingData);
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      activityType: '' as ActivityType,
      duration: '',
      distance: '',
      intensity: '' as IntensityLevel,
      heartRateZone: '',
      rpe: '',
      notes: ''
    });
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Training - {selectedDay}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="activityType">Activity Type</Label>
              <Select
                value={formData.activityType}
                onValueChange={(value) => setFormData({ ...formData, activityType: value as ActivityType })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="duration">Duration (min)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="45"
              />
            </div>

            <div>
              <Label htmlFor="distance">Distance (km)</Label>
              <Input
                id="distance"
                type="number"
                step="0.1"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                placeholder="8.5"
              />
            </div>

            <div>
              <Label htmlFor="intensity">Intensity</Label>
              <Select
                value={formData.intensity}
                onValueChange={(value) => setFormData({ ...formData, intensity: value as IntensityLevel })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select intensity" />
                </SelectTrigger>
                <SelectContent>
                  {intensityLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="heartRateZone">HR Zone</Label>
              <Input
                id="heartRateZone"
                value={formData.heartRateZone}
                onChange={(e) => setFormData({ ...formData, heartRateZone: e.target.value })}
                placeholder="2"
              />
            </div>

            <div>
              <Label htmlFor="rpe">RPE (1-10)</Label>
              <Input
                id="rpe"
                type="number"
                min="1"
                max="10"
                value={formData.rpe}
                onChange={(e) => setFormData({ ...formData, rpe: e.target.value })}
                placeholder="6"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Zone 2, Hill run, Technique focus..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Training
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTrainingModal;
