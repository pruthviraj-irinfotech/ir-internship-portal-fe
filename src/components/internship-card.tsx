'use client';

import Link from 'next/link';
import { Clock, IndianRupee, HelpCircle, MapPin, Tag } from 'lucide-react';
import type { Internship } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type InternshipCardProps = {
  internship: Internship;
  isLoggedIn?: boolean;
};

export function InternshipCard({ internship, isLoggedIn = false }: InternshipCardProps) {
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
        <div className="flex items-center gap-1">
          <Tag className="w-4 h-4 text-muted-foreground" />
          <span>{internship.category}</span>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger className="cursor-default ml-1">
                <HelpCircle className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-sm" side="top">
                <ul className="space-y-2 p-1">
                  <li><b>Paid:</b> Interns pay for this training-focused program.</li>
                  <li><b>Free:</b> Unpaid learning opportunities.</li>
                  <li><b>Stipend:</b> The company provides a payment to the intern.</li>
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {(internship.category === 'Stipend' || internship.category === 'Paid') && (
          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-muted-foreground" />
            <span>{internship.amount}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">Posted {internship.postedDate}</p>
        {isLoggedIn ? (
          internship.applied ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" size="sm">View Status</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Application Status</DialogTitle>
                  <DialogDescription>
                    Status for your application to the "{internship.title}" role.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 text-sm">
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">Status</p>
                    <Badge variant={internship.status === 'Shortlisted' ? 'default' : 'secondary'}>{internship.status}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">Applied Date</p>
                    <p>{internship.applicationDate}</p>
                  </div>
                  <p className="text-xs text-muted-foreground pt-4 border-t mt-2">
                    Note: Applications are reviewed for up to one month. If you are not selected within this timeframe, the application will be automatically removed from your dashboard.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Button size="sm">Apply Now</Button>
          )
        ) : (
          <Button size="sm" asChild>
            <Link href="/login">Apply Now</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
