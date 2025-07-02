
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit } from "lucide-react";
import RichTextarea from "@/components/ui/rich-textarea";

interface EditTrainingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onOpen: () => void;
  formData: any;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const EditTrainingDialog = ({ 
  isOpen, 
  onOpenChange, 
  onOpen, 
  formData, 
  onInputChange, 
  onSubmit 
}: EditTrainingDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={onOpen}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Training</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => onInputChange('title', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={(value: any) => onInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="cycling">Cycling</SelectItem>
                  <SelectItem value="swimming">Swimming</SelectItem>
                  <SelectItem value="strength">Strength Training</SelectItem>
                  <SelectItem value="yoga">Yoga</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (min) *</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => onInputChange('duration', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="distance">Distance (km)</Label>
              <Input
                id="distance"
                type="number"
                step="0.1"
                value={formData.distance}
                onChange={(e) => onInputChange('distance', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (1-10)</Label>
              <Select value={formData.rating} onValueChange={(value) => onInputChange('rating', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Rate difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(10)].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1} - {i === 0 ? 'Super Easy' : i === 9 ? 'Could not finish' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stravaLink">Strava Link</Label>
              <Input
                id="stravaLink"
                type="url"
                placeholder="https://strava.com/..."
                value={formData.stravaLink}
                onChange={(e) => onInputChange('stravaLink', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="garminLink">Garmin Link</Label>
              <Input
                id="garminLink"
                type="url"
                placeholder="https://connect.garmin.com/..."
                value={formData.garminLink}
                onChange={(e) => onInputChange('garminLink', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="trainerNotes">Trainer Notes</Label>
            <RichTextarea
              value={formData.trainerNotes}
              onChange={(value) => onInputChange('trainerNotes', value)}
              placeholder="Coach notes and feedback... Use toolbar for formatting"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="traineeNotes">Trainee Notes</Label>
            <RichTextarea
              value={formData.traineeNotes}
              onChange={(value) => onInputChange('traineeNotes', value)}
              placeholder="Your thoughts and feelings about the training... Use toolbar for formatting"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button type="submit" className="flex-1">
              Update Training
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTrainingDialog;
