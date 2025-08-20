

'use client';

import Link from 'next/link';
import React, { useState, useCallback } from 'react';
import { Clock, IndianRupee, HelpCircle, MapPin, Tag, Activity, Eye, Loader2 } from 'lucide-react';
import type { Internship, ApiInternshipStatus, MyGameApplication, MyApplication, UserApplicationDetails } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import * as api from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { format, parseISO } from 'date-fns';

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
  
  if (!internship) {
    return null;
  }
  
  const applicationStatus = application?.status;
  const postedDate = internship.postedDate;
  
  const isMyGamesPage = applicationStatus === 'Ongoing' || applicationStatus === 'Completed';

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
    
    if (isMyGamesPage) {
        const detailPage = applicationStatus.toLowerCase();
        return (
             <Button size="sm" asChild>
                <Link href={`/${detailPage}/${application!.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
            </Button>
        );
    }

    if (!applicationStatus) {
        return (
            <Button size="sm" asChild>
                <Link href={`/apply/${internship.id}`}>Apply Now</Link>
            </Button>
        );
    }

    // This is for the /applied page
    return (
        <Button size="sm" asChild>
            <Link href={`/applied/${application!.id}`}>
                View Status
            </Link>
        </Button>
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
            <Badge variant={statusDisplayMap[applicationStatus as keyof typeof statusDisplayMap].variant}>
                {statusDisplayMap[applicationStatus as keyof typeof statusDisplayMap].text}
            </Badge>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">Posted {format(new Date(postedDate), 'dd-MM-yy')}</p>
        {renderActionButton()}
      </CardFooter>
    </Card>
  );
}
