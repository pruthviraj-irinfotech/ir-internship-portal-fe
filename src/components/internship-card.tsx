
'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Clock, IndianRupee, HelpCircle, MapPin, Tag, FileDown, Upload, Paperclip, ListChecks, CheckCircle, UserX, Info, Activity } from 'lucide-react';
import type { Internship, InternshipStatus } from '@/lib/mock-data';
import { applications } from '@/lib/mock-data';
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
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Input } from './ui/input';
import { Label } from './ui/label';

type InternshipCardProps = {
  internship: Internship;
  isLoggedIn?: boolean;
};

const statusColors: Record<InternshipStatus, 'default' | 'secondary' | 'destructive'> = {
    'Completed': 'default',
    'Interview Scheduled': 'default',
    'Ongoing': 'default',
    'Shortlisted': 'default',
    'In Review': 'secondary',
    'Withdrawn': 'destructive',
    'Rejected': 'destructive',
    'Terminated': 'destructive',
};


export function InternshipCard({ internship, isLoggedIn = false }: InternshipCardProps) {
  const application = applications.find(app => app.internshipId === internship.id);
  const { toast } = useToast();
  const [newFile, setNewFile] = useState<File | null>(null);

  const handleUpload = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newFile) {
          toast({ variant: 'destructive', title: 'No file selected' });
          return;
      }
      // In a real app, this would handle the file upload to a server.
      toast({ title: "Success!", description: "Your document has been uploaded." });
      setNewFile(null);
      // Here you would typically update the mock data or refetch
  }
  
  const renderDialogContent = () => {
    if (!application) return null;

    switch(application.status) {
      case 'Interview Scheduled':
        return (
           <div className="border-t pt-4 mt-4 space-y-4">
              <h4 className="font-semibold text-primary flex items-center gap-2"><ListChecks /> Interview Details</h4>
              <div className="grid grid-cols-2 gap-2 text-left">
                  <p className="text-muted-foreground">Interview Date:</p>
                  <p>{application.interviewDate ? format(parseISO(application.interviewDate), 'PPP') : 'N/A'}</p>
                  <p className="text-muted-foreground">Interview Time:</p>
                  <p>{application.interviewTime || 'N/A'}</p>
              </div>
               <div className="text-left space-y-1">
                 <p className="text-muted-foreground">Instructions:</p>
                 <div className="text-sm" dangerouslySetInnerHTML={{ __html: application.interviewInstructions || 'No instructions provided.'}} />
              </div>
            </div>
        );
       case 'Terminated':
         if (!application.comments) return null;
         return (
            <div className="border-t pt-4 mt-4 space-y-2">
              <h4 className="font-semibold text-destructive flex items-center gap-2"><UserX /> Internship Terminated</h4>
              <Label>Reason:</Label>
              <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: application.comments}} />
            </div>
         );
      default:
        return null;
    }
  }

  const renderActionButton = () => {
    if (!isLoggedIn) {
        return (
            <Dialog>
                <DialogTrigger asChild>
                <Button size="sm">Apply Now</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Login Required</DialogTitle>
                    <DialogDescription>
                    It seems you haven't logged in to the platform. To continue, please login or create an account.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-4 pt-4">
                    <Button variant="outline" asChild>
                    <Link href={`/signup?redirect=/apply/${internship.id}`}>Create Account</Link>
                    </Button>
                    <Button asChild>
                    <Link href={`/login?redirect=/apply/${internship.id}`}>Login</Link>
                    </Button>
                </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (!internship.applied || !application) {
        return (
            <Button size="sm" asChild>
                <Link href={`/apply/${internship.id}`}>Apply Now</Link>
            </Button>
        );
    }
    
    switch (application.status) {
        case 'Ongoing':
            return (
                <Button size="sm" asChild>
                    <Link href={`/ongoing/${application.id}`}>View Details</Link>
                </Button>
            );
        case 'Completed':
             return (
                <Button size="sm" asChild>
                    <Link href={`/completed/${application.id}`}>View Details</Link>
                </Button>
            );
        case 'Interview Scheduled':
        case 'Rejected':
        case 'Terminated':
        case 'In Review':
        case 'Shortlisted':
        case 'Withdrawn':
             return (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="secondary" size="sm">View Status</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                        <DialogTitle>Application Status</DialogTitle>
                        <DialogDescription>
                            Status for your application to the "{internship.title}" role.
                        </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4 text-sm">
                            <div className="flex justify-between items-center">
                                <p className="text-muted-foreground">Status</p>
                                {internship.status && <Badge variant={statusColors[internship.status] || 'secondary'}>{internship.status}</Badge>}
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-muted-foreground">Applied Date</p>
                                <p>{internship.applicationDate ? format(new Date(internship.applicationDate), 'dd-MM-yy') : 'N/A'}</p>
                            </div>
                            
                            {renderDialogContent()}
                            
                            <p className="text-xs text-muted-foreground pt-4 border-t mt-2">
                                Note: Applications are reviewed for up to one month. If you are not selected within this timeframe, the application will be automatically removed from your dashboard.
                            </p>
                        </div>
                    </DialogContent>
                </Dialog>
            );
        default:
             return (
                <Button size="sm" asChild>
                    <Link href={`/apply/${internship.id}`}>Apply Now</Link>
                </Button>
            );
    }
  }


  return (
    <Card className="flex flex-col transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="text-base text-primary">
            <Link href={`/internships/${internship.id}`} className="hover:underline">
              {internship.title}
            </Link>
        </CardTitle>
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
        {(internship.category === 'Stipend' || internship.category === 'Paid') && internship.amount && (
          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-muted-foreground" />
            <span>
              {parseInt(internship.amount, 10).toLocaleString('en-IN')}
              {internship.isMonthly ? '/month' : ''}
            </span>
          </div>
        )}
        {internship.status && internship.applied && (
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <span>Status: </span>
            <Badge variant={statusColors[internship.status]}>{internship.status}</Badge>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">Posted {format(new Date(internship.postedDate), 'dd-MM-yy')}</p>
        {renderActionButton()}
      </CardFooter>
    </Card>
  );
}
