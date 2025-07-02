
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TrainerNotesCardProps {
  trainerNotes?: string;
}

const TrainerNotesCard = ({ trainerNotes }: TrainerNotesCardProps) => {
  const formatTrainerNotes = (notes: string) => {
    if (!notes) return null;
    
    // Split by newlines and process each line
    const lines = notes.split('\n');
    const formattedLines = lines.map((line, index) => {
      // Check if line starts with bullet point indicators
      if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')) {
        return (
          <li key={index} className="ml-4">
            {line.trim().replace(/^[•\-*]\s*/, '')}
          </li>
        );
      }
      // Regular line
      return line.trim() ? (
        <p key={index} className="mb-2">
          {line}
        </p>
      ) : (
        <br key={index} />
      );
    });

    // Check if we have any list items
    const hasListItems = lines.some(line => 
      line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')
    );

    if (hasListItems) {
      return (
        <div>
          {formattedLines.map((line, index) => {
            if (line.type === 'li') {
              return line;
            }
            return line;
          })}
        </div>
      );
    }

    return <div>{formattedLines}</div>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trainer Notes</CardTitle>
      </CardHeader>
      <CardContent>
        {trainerNotes ? (
          <div className="text-gray-700 leading-relaxed">
            {formatTrainerNotes(trainerNotes)}
          </div>
        ) : (
          <p className="text-gray-500 italic">No trainer notes for this training.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default TrainerNotesCard;
