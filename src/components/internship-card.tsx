import { Clock, DollarSign, Gift, MapPin } from 'lucide-react';
import type { Internship } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type InternshipCardProps = {
  internship: Internship;
};

export function InternshipCard({ internship }: InternshipCardProps) {
  return (
    <Card className="flex flex-col transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="text-base text-primary">{internship.title}</CardTitle>
        <CardDescription className="text-sm">{internship.company}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow text-xs space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span>{internship.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span>{internship.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          {internship.stipend.toLowerCase() === 'free' ? (
            <Gift className="w-4 h-4 text-muted-foreground" />
          ) : (
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          )}
          <span>{internship.stipend}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">Posted {internship.postedDate}</p>
        {internship.applied ? (
          <Badge variant="secondary">Applied</Badge>
        ) : (
          <Button size="sm">Apply Now</Button>
        )}
      </CardFooter>
    </Card>
  );
}
