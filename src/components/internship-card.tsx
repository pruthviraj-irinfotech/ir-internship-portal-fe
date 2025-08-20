

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

const ViewStatusDialog = ({ application, internship }: { application: MyApplication, internship: Internship }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [details, setDetails] = useState<UserApplicationDetails | null>(null);
    const { token } = useAuth();
    const { toast } = useToast();

    const fetchDetails = useCallback(async () => {
        if (!token) return;
        setIsLoading(true);
        setDetails(null);
        try {
            const data = await api.getApplicationDetailsForUser(application.id, token);
            setDetails(data);
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
            setIsOpen(false);
        } finally {
            setIsLoading(false);
        }
    }, [token, application.id, toast]);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open && !details) {
            fetchDetails();
        }
    };
    
    const statusInfo = statusDisplayMap[application.status];

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="secondary" size="sm">View Status</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Application Status</DialogTitle>
                    <DialogDescription>
                        Status for your application to the "{internship.title}" role.
                    </DialogDescription>
                </DialogHeader>
                {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : !details ? (
                    <p className="text-center p-8">Could not load details.</p>
                ) : (
                    <div className="grid gap-4 py-4 text-sm max-h-[60vh] overflow-y-auto pr-4">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                             <Label>Status</Label>
                             <div className="text-right"><Badge variant={statusInfo.variant}>{statusInfo.text}</Badge></div>
                             <Label>Applied On</Label>
                             <p className="text-right">{format(parseISO(details.applicationDate), 'PPP')}</p>
                        </div>

                         {details.status === 'Interview_Scheduled' && details.interviewDate && (
                            <div className="border-t pt-4 mt-2 space-y-2">
                                <h4 className="font-semibold text-primary">Interview Scheduled</h4>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                    <Label>Date & Time</Label>
                                    <p className="text-right">{format(parseISO(details.interviewDate), 'PPP, p')}</p>
                                    <Label className="col-span-2">Instructions</Label>
                                    <div className="col-span-2 text-muted-foreground text-xs" dangerouslySetInnerHTML={{ __html: details.interviewInstructions || 'No instructions provided.' }} />
                                </div>
                            </div>
                        )}

                        {details.adminComments && (
                            <div className="border-t pt-4 mt-2 space-y-2">
                                <h4 className="font-semibold">Admin Comments</h4>
                                <div className="text-muted-foreground text-xs" dangerouslySetInnerHTML={{ __html: details.adminComments }} />
                            </div>
                        )}
                        
                        <p className="text-xs text-muted-foreground pt-4 border-t mt-2">
                            Note: Applications are reviewed for up to one month. If you have any queries, mail it to <b className="text-primary">hr@irinfotech.com</b>.
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};


export function InternshipCard({ internship: directInternship, application, isLoggedIn = false }: InternshipCardProps) {
  
  const internship = application ? application.internship : directInternship;
  
  if (!internship) {
    return null;
  }
  
  const applicationStatus = application?.status;
  const postedDate = internship.postedDate;

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

    return <ViewStatusDialog application={application as MyApplication} internship={internship} />;
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
        {applicationStatus && (applicationStatus as ApiInternshipStatus) && (
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
        <p className="text-xs text-muted-foreground">Posted {format(new Date(postedDate), 'dd-MM-yy')}</p>
        {renderActionButton()}
      </CardFooter>
    </Card>
  );
}
