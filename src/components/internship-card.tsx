

'use client';

import Link from 'next/link';
import React from 'react';
import { Clock, IndianRupee, HelpCircle, MapPin, Tag, Activity, Eye } from 'lucide-react';
import type { Internship, ApiInternshipStatus, MyGameApplication, MyApplication } from '@/lib/mock-data';
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
import { format } from 'date-fns';

type InternshipCardProps = {
  internship?: Internship;
  application?: MyGameApplication | MyApplication;
  isLoggedIn?: boolean;
};

const statusDisplayMap: Record<ApiInternshipStatus | 'Ongoing' | 'Completed', { text: string, variant: 'default' | 'secondary' | 'destructive' }> = {
    'In_Review': { text: 'In Review', variant: 'secondary'},
    'Shortlisted': { text: 'Shortlisted', variant: 'default' },
    'Interview_Scheduled': { text: 'Interview Scheduled', variant: 'default'},
    'Ongoing': { text: 'Ongoing', variant: 'default' },
    'Completed': { text: 'Completed', variant: 'default' },
    'Terminated': { text: 'Terminated', variant: 'destructive' },
    'Rejected': { text: 'Rejected', variant: 'destructive' },
    'Withdrawn': { text: 'Withdrawn', variant: 'destructive' },
};


export function InternshipCard({ internship: directInternship, application, isLoggedIn = false }: InternshipCardProps) {
  
  const internship = application ? application.internship : directInternship;
  const applicationStatus = application ? application.status : directInternship?.applicationStatus;
  const applicationDate = application ? application.applicationDate : directInternship?.applicationDate;

  if (!internship) {
    return null;
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
    
    // "My Games" page logic
    if (application && (application.status === 'Ongoing' || application.status === 'Completed')) {
        const detailPage = application.status.toLowerCase();
        return (
             <Button size="sm" asChild>
                <Link href={`/${detailPage}/${application.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
            </Button>
        );
    }

    // Home page or /applied page
    if (!applicationStatus) {
        return (
            <Button size="sm" asChild>
                <Link href={`/apply/${internship.id}`}>Apply Now</Link>
            </Button>
        );
    }
    
    const statusInfo = statusDisplayMap[applicationStatus];
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
                        <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
                    </div>
                    {applicationDate && <div className="flex justify-between items-center">
                        <p className="text-muted-foreground">Applied Date</p>
                        <p>{format(new Date(applicationDate), 'dd-MM-yy')}</p>
                    </div>}
                    <p className="text-xs text-muted-foreground pt-4 border-t mt-2">
                        Note: Applications are reviewed for up to one month. If you are not selected within this timeframe, the application will be automatically removed from your dashboard.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
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
              {parseFloat(internship.amount).toLocaleString('en-IN')}
              {internship.isMonthly ? '/month' : ''}
            </span>
          </div>
        )}
        {applicationStatus && (
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <span>Status: </span>
            <Badge variant={statusDisplayMap[applicationStatus as ApiInternshipStatus].variant}>
                {statusDisplayMap[applicationStatus as ApiInternshipStatus].text}
            </Badge>
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
