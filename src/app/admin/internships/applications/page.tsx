'use client';

import { useState, useMemo } from 'react';
import { applications, Application, internships, InternshipStatus } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

const statusColors: Record<InternshipStatus, 'default' | 'secondary' | 'destructive'> = {
    'Selected': 'default',
    'Interview Scheduled': 'default',
    'Ongoing': 'default',
    'Shortlisted': 'default',
    'In Review': 'secondary',
    'Withdrawn': 'destructive',
    'Rejected': 'destructive',
};

export default function ApplicationsPage() {
    const [applicationList, setApplicationList] = useState<Application[]>(applications);
    const [viewingApplication, setViewingApplication] = useState<Application | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { toast } = useToast();

    const handleStatusChange = (applicationId: string, newStatus: InternshipStatus) => {
        const appIndex = applicationList.findIndex(app => app.id === applicationId);
        if (appIndex === -1) return;

        // Update application status
        const updatedApplications = [...applicationList];
        updatedApplications[appIndex].status = newStatus;
        setApplicationList(updatedApplications);

        // Also update the original internship object's status for user-facing consistency
        const internship = internships.find(i => i.id === updatedApplications[appIndex].internshipId);
        if (internship) {
            internship.status = newStatus;
        }

        toast({
            title: 'Status Updated',
            description: `Application status changed to ${newStatus}.`,
        });
    };

    const filteredApplications = useMemo(() => {
        return applicationList.filter(app =>
            app.internshipTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.userName.toLowerCase().includes(searchTerm.toLowerCase())
        ).sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime());
    }, [applicationList, searchTerm]);

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle>Internship Applications</CardTitle>
                            <CardDescription>Review and manage all incoming applications.</CardDescription>
                        </div>
                        <div className="relative w-full sm:w-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by title or name..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Applicant</TableHead>
                                    <TableHead>Internship</TableHead>
                                    <TableHead>Applied On</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredApplications.length > 0 ? (
                                    filteredApplications.map(app => (
                                        <TableRow key={app.id}>
                                            <TableCell className="font-medium">{app.userName}</TableCell>
                                            <TableCell>{app.internshipTitle}</TableCell>
                                            <TableCell>{format(new Date(app.applicationDate), 'dd-MM-yy')}</TableCell>
                                            <TableCell>
                                                <Select onValueChange={(value) => handleStatusChange(app.id, value as InternshipStatus)} defaultValue={app.status}>
                                                    <SelectTrigger className="w-[180px] h-9">
                                                        <SelectValue>
                                                          <Badge variant={statusColors[app.status]}>{app.status}</Badge>
                                                        </SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {(Object.keys(statusColors) as InternshipStatus[]).map(status => (
                                                            <SelectItem key={status} value={status}>
                                                                {status}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="icon" onClick={() => setViewingApplication(app)} title="View Application">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24">
                                            No applications found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {viewingApplication && (
                <Dialog open={!!viewingApplication} onOpenChange={() => setViewingApplication(null)}>
                    <DialogContent className="sm:max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>Application Details</DialogTitle>
                            <DialogDescription>
                                {viewingApplication.userName}'s application for "{viewingApplication.internshipTitle}".
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-6">
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                                <div><Label>Applicant Name</Label><p className="text-sm text-muted-foreground">{viewingApplication.userName}</p></div>
                                <div><Label>Applicant Email</Label><p className="text-sm text-muted-foreground">{viewingApplication.userEmail}</p></div>
                                <div><Label>Applicant Phone</Label><p className="text-sm text-muted-foreground">{viewingApplication.userPhone}</p></div>
                                <div><Label>Application ID</Label><p className="text-sm text-muted-foreground font-mono">{viewingApplication.id}</p></div>
                                <div><Label>Application Date</Label><p className="text-sm text-muted-foreground">{format(new Date(viewingApplication.applicationDate), 'dd-MM-yy')}</p></div>
                                <div><Label>Resume</Label><Button variant="link" size="sm" asChild className="p-0 h-auto"><Link href={viewingApplication.resumeUrl} target="_blank">View Resume</Link></Button></div>
                            </div>

                            <div className="border-t pt-4">
                               <Label>Why are you applying for this internship?</Label>
                               <p className="text-sm text-muted-foreground mt-1">{viewingApplication.whyApply}</p>
                            </div>
                            
                            <div className="border-t pt-4 grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                                <div><Label>Highest Qualification</Label><p className="text-sm text-muted-foreground">{viewingApplication.qualification}</p></div>
                                <div><Label>Current Status</Label><p className="text-sm text-muted-foreground capitalize">{viewingApplication.userStatus}</p></div>
                                <div className="md:col-span-3"><Label>Organization/Institute</Label><p className="text-sm text-muted-foreground">{viewingApplication.orgName}</p></div>
                                <div><Label>City</Label><p className="text-sm text-muted-foreground">{viewingApplication.orgCity}</p></div>
                                <div><Label>State</Label><p className="text-sm text-muted-foreground">{viewingApplication.orgState}</p></div>
                                <div><Label>Country</Label><p className="text-sm text-muted-foreground">{viewingApplication.orgCountry}</p></div>
                            </div>
                            
                            {(viewingApplication.altEmail || viewingApplication.altPhone) && (
                                <div className="border-t pt-4 grid grid-cols-2 gap-y-4 gap-x-6">
                                    {viewingApplication.altEmail && <div><Label>Alternative Email</Label><p className="text-sm text-muted-foreground">{viewingApplication.altEmail}</p></div>}
                                    {viewingApplication.altPhone && <div><Label>Alternative Phone</Label><p className="text-sm text-muted-foreground">{viewingApplication.altPhone}</p></div>}
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
