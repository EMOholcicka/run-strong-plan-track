
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ExternalLinksCardProps {
  stravaLink?: string;
  garminLink?: string;
}

const ExternalLinksCard = ({ stravaLink, garminLink }: ExternalLinksCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>External Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {stravaLink && (
          <a
            href={stravaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full"
          >
            <Button variant="outline" className="w-full">
              View on Strava
            </Button>
          </a>
        )}
        {garminLink && (
          <a
            href={garminLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full"
          >
            <Button variant="outline" className="w-full">
              View on Garmin Connect
            </Button>
          </a>
        )}
      </CardContent>
    </Card>
  );
};

export default ExternalLinksCard;
