

'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Application, InternshipStatus, ApiInternshipStatus, DetailedApplication } from '@/lib/mock-data';
import * as api from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, FilePenLine, Loader2, Calendar as CalendarIcon, ArrowUpDown, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import RichTextEditor from '@/components/rich-text-editor';
import { cn } from '@/lib/utils';
import TimePicker from '@/components/time-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';


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

const allApiStatuses: ApiInternshipStatus[] = ['In_Review', 'Shortlisted', 'Interview_Scheduled', 'Ongoing', 'Completed', 'Rejected', 'Withdrawn', 'Terminated'];

const statusApiToDisplayMap: Record<ApiInternshipStatus, InternshipStatus> = {
    'In_Review': 'In Review',
    'Shortlisted': 'Shortlisted',
    'Interview_Scheduled': 'Interview Scheduled',
    'Ongoing': 'Ongoing',
    'Completed': 'Completed',
    'Rejected': 'Rejected',
    'Withdrawn': 'Withdrawn',
    'Terminated': 'Terminated',
};

const formSchema = z.object({
    status: z.enum(allApiStatuses),
    interviewDate: z.date().optional(),
    interviewTime: z.string().optional(),
    interviewInstructions: z.string().optional(),
    comments: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.status === 'Interview_Scheduled') {
        if (!data.interviewDate) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Interview date is required.', path: ['interviewDate'] });
        }
        if (!data.interviewTime?.trim()) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Interview time is required.', path: ['interviewTime'] });
        }
        if (!data.interviewInstructions || data.interviewInstructions.length < 10) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Instructions must be at least 10 characters.', path: ['interviewInstructions'] });
        }
    }
});


export default function ApplicationsPage() {
    const [applicationList, setApplicationList] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [detailedApp, setDetailedApp] = useState<DetailedApplication | null>(null);
    const [isDialogLoading, setIsDialogLoading] = useState(false);
    const [viewingAppId, setViewingAppId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<ApiInternshipStatus | 'all'>('all');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const { toast } = useToast();
    const { token } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });
    
    const watchedStatus = form.watch('status');

    const fetchApplications = useCallback(async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const data = await api.getApplications(token, statusFilter, searchTerm);
            setApplicationList(data);
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    }, [token, statusFilter, searchTerm, toast]);
    
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchApplications();
        }, 500); // Debounce search/filter
        return () => clearTimeout(handler);
    }, [fetchApplications]);

    // Effect to open dialog from URL param
    useEffect(() => {
        const viewId = searchParams.get('view');
        if (viewId) {
            setViewingAppId(parseInt(viewId, 10));
        }
    }, [searchParams]);

    const sortedApplications = useMemo(() => {
        return [...applicationList].sort((a, b) => {
            const dateA = new Date(a.appliedDate).getTime();
            const dateB = new Date(b.appliedDate).getTime();
            if (sortDirection === 'asc') {
                return dateA - dateB;
            }
            return dateB - a.id;
        });
    }, [applicationList, sortDirection]);
    
    useEffect(() => {
        const fetchDetails = async () => {
            if (!viewingAppId || !token) return;

            setIsDialogLoading(true);
            setDetailedApp(null);
            try {
                const data = await api.getApplicationDetails(viewingAppId, token);
                setDetailedApp(data);
            } catch (error: any) {
                toast({ title: 'Error', description: `Failed to fetch details: ${error.message}`, variant: 'destructive' });
                setViewingAppId(null);
            } finally {
                setIsDialogLoading(false);
            }
        };

        if (viewingAppId) {
            fetchDetails();
        }
    }, [viewingAppId, token, toast]);
    
    useEffect(() => {
        if (detailedApp) {
            let interviewDate, interviewTime;
            if (detailedApp.interviewDetails?.date) {
                const dateObj = new Date(detailedApp.interviewDetails.date);
                interviewDate = dateObj;
                interviewTime = format(dateObj, 'hh:mm a');
            }

            form.reset({
                status: detailedApp.currentApplicationStatus,
                interviewDate: interviewDate,
                interviewTime: interviewTime,
                interviewInstructions: detailedApp.interviewDetails?.instructions || '',
                comments: detailedApp.comments || '',
            });
        }
    }, [detailedApp, form]);

    const handleCloseDialog = () => {
        setViewingAppId(null);
        // Remove the 'view' query param from URL
        const newPath = pathname.split('?')[0];
        router.replace(newPath, { scroll: false });
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!viewingAppId || !token) return;

        let payload: any = { status: values.status };
        if (values.status === 'Interview_Scheduled') {
            const [hour, minute, period] = values.interviewTime!.split(/[: ]/);
            const interviewDateTime = new Date(values.interviewDate!);
            let h = parseInt(hour);
            if (period.toUpperCase() === 'PM' && h < 12) h += 12;
            if (period.toUpperCase() === 'AM' && h === 12) h = 0;
            interviewDateTime.setHours(h);
            interviewDateTime.setMinutes(parseInt(minute));
            
            payload.interviewDate = interviewDateTime.toISOString();
            payload.interviewInstructions = values.interviewInstructions;
        } else {
            payload.adminComments = values.comments;
        }
        
        try {
            const updatedApp = await api.updateApplicationDetails(viewingAppId, payload, token);
            
            setApplicationList(prev => prev.map(app => app.id === updatedApp.id ? { ...app, status: updatedApp.status } : app));

            toast({
                title: 'Application Updated',
                description: `Application status changed to ${statusApiToDisplayMap[values.status]}.`,
            });
            handleCloseDialog();
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = new Set(sortedApplications.map(app => app.id));
            setSelectedRows(allIds);
        } else {
            setSelectedRows(new Set());
        }
    };

    const handleSelectRow = (appId: number, checked: boolean) => {
        const newSelectedRows = new Set(selectedRows);
        if (checked) {
            newSelectedRows.add(appId);
        } else {
            newSelectedRows.delete(appId);
        }
        setSelectedRows(newSelectedRows);
    };

    const handleDeleteSelected = async () => {
        if (!token) return;

        try {
            const result = await api.deleteManyApplications(Array.from(selectedRows), token);
            setApplicationList(prev => prev.filter(app => !selectedRows.has(app.id)));
            setSelectedRows(new Set());
            toast({
                title: 'Applications Deleted',
                description: result.message,
            });
        } catch (error: any) {
            toast({
                title: 'Error Deleting Applications',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setIsDeleteDialogOpen(false);
        }
    };

    const pathname = usePathname();


    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle>Internship Applications</CardTitle>
                            <CardDescription>Review and manage all incoming applications.</CardDescription>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                            {selectedRows.size > 0 && (
                                <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete ({selectedRows.size})
                                </Button>
                            )}
                             <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ApiInternshipStatus | 'all')}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    {allApiStatuses.map(status => (
                                        <SelectItem key={status} value={status}>
                                            {statusApiToDisplayMap[status]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">
                                        <Checkbox
                                            checked={!isLoading && sortedApplications.length > 0 && selectedRows.size === sortedApplications.length}
                                            onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                                            aria-label="Select all"
                                        />
                                    </TableHead>
                                    <TableHead>Applicant</TableHead>
                                    <TableHead>Application #</TableHead>
                                    <TableHead>Internship</TableHead>
                                    <TableHead>
                                        <Button variant="ghost" className="pl-0 hover:bg-transparent" onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}>
                                            Applied On
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow><TableCell colSpan={7} className="text-center h-24"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                                ) : sortedApplications.length > 0 ? (
                                    sortedApplications.map(app => (
                                        <TableRow key={app.id} data-state={selectedRows.has(app.id) && "selected"}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedRows.has(app.id)}
                                                    onCheckedChange={(checked) => handleSelectRow(app.id, checked as boolean)}
                                                    aria-label={`Select row for ${app.applicantName}`}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{app.applicantName}</TableCell>
                                            <TableCell className="font-mono text-xs">{app.applicationNumber}</TableCell>
                                            <TableCell>{app.internshipTitle}</TableCell>
                                            <TableCell>{format(new Date(app.appliedDate), 'dd-MM-yy')}</TableCell>
                                            <TableCell>
                                                <Badge variant={statusColors[statusApiToDisplayMap[app.status]]}>{statusApiToDisplayMap[app.status]}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="icon" onClick={() => setViewingAppId(app.id)} title="View & Edit Application">
                                                    <FilePenLine className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center h-24">
                                            No applications found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!viewingAppId} onOpenChange={handleCloseDialog}>
                <DialogContent className="sm:max-w-6xl h-[90vh] flex flex-col">
                    {isDialogLoading ? (
                        <div className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
                    ) : !detailedApp ? (
                        <div className="flex-1 flex items-center justify-center"><p>Could not load application details.</p></div>
                    ) : (
                        <Form {...form}>
                         <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
                            <DialogHeader>
                                <DialogTitle>Application Details</DialogTitle>
                                <DialogDescription>
                                    {detailedApp.title}
                                </DialogDescription>
                            </DialogHeader>
                           
                            <div className="grid md:grid-cols-2 gap-8 mt-4 overflow-hidden flex-1">
                                <div className="space-y-6 py-2 overflow-y-auto pr-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                                        <div><Label>Applicant Name</Label><p className="text-sm text-muted-foreground">{detailedApp.applicantName}</p></div>
                                        <div><Label>Applicant Phone</Label><p className="text-sm text-muted-foreground">{detailedApp.applicantPhone}</p></div>
                                        <div className="sm:col-span-2"><Label>Applicant Email</Label><p className="text-sm text-muted-foreground">{detailedApp.applicantEmail}</p></div>
                                    </div>
                                    <div className="border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                                        <div><Label>Application ID</Label><p className="text-sm text-muted-foreground font-mono">{detailedApp.applicationId}</p></div>
                                        <div><Label>Application Date</Label><p className="text-sm text-muted-foreground">{format(new Date(detailedApp.applicationDate), 'dd-MM-yy')}</p></div>
                                    </div>
                                    <div className="border-t pt-4"><Label>Why are you applying for this internship?</Label><p className="text-sm text-muted-foreground mt-1">{detailedApp.whyApply}</p></div>
                                    <div className="border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                                        <div><Label>Highest Qualification</Label><p className="text-sm text-muted-foreground">{detailedApp.highestQualification}</p></div>
                                        <div><Label>Current Status</Label><p className="text-sm text-muted-foreground capitalize">{detailedApp.currentStatus}</p></div>
                                        <div className="sm:col-span-2"><Label>Organization/Institute</Label><p className="text-sm text-muted-foreground">{detailedApp.organization}</p></div>
                                        <div><Label>City</Label><p className="text-sm text-muted-foreground">{detailedApp.city}</p></div>
                                        <div><Label>State</Label><p className="text-sm text-muted-foreground">{detailedApp.state}</p></div>
                                        <div><Label>Country</Label><p className="text-sm text-muted-foreground">{detailedApp.country}</p></div>
                                    </div>
                                    {(detailedApp.alternativeEmail || detailedApp.alternativePhone) && (
                                        <div className="border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                                            {detailedApp.alternativeEmail && <div className="sm:col-span-2"><Label>Alternative Email</Label><p className="text-sm text-muted-foreground">{detailedApp.alternativeEmail}</p></div>}
                                            {detailedApp.alternativePhone && <div><Label>Alternative Phone</Label><p className="text-sm text-muted-foreground">{detailedApp.alternativePhone}</p></div>}
                                        </div>
                                    )}
                                     {detailedApp.comments && (
                                        <div className="border-t pt-4 sm:col-span-2">
                                            <h4 className="font-semibold text-primary mb-2">Admin Comments</h4>
                                            <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: detailedApp.comments }} />
                                        </div>
                                    )}
                                     {detailedApp.currentApplicationStatus === 'Interview_Scheduled' && detailedApp.interviewDetails?.date && (
                                        <div className="border-t pt-4 sm:col-span-2 grid gap-y-4 gap-x-6">
                                            <h4 className="font-semibold text-primary">Interview Details</h4>
                                            <div><Label>Interview Date</Label><p className="text-sm text-muted-foreground">{format(parseISO(detailedApp.interviewDetails.date), 'PPP')}</p></div>
                                            <div><Label>Interview Time</Label><p className="text-sm text-muted-foreground">{format(parseISO(detailedApp.interviewDetails.date), 'p')}</p></div>
                                            <div className="sm:col-span-2"><Label>Interview Instructions</Label><div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: detailedApp.interviewDetails.instructions || ''}} /></div>
                                        </div>
                                    )}
                                </div>
                                <div className="border-l pl-8 flex flex-col gap-6 overflow-y-auto">
                                    <div className="relative flex-1 rounded-md overflow-hidden border min-h-[400px]">
                                        {detailedApp.resumeUrl ? (
                                            <iframe
                                                src={detailedApp.resumeUrl}
                                                title={`Resume for ${detailedApp.applicantName}`}
                                                className="w-full h-full"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                                No resume uploaded.
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-4 border-t pt-6">
                                        <FormField control={form.control} name="status" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Update Application Status</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        {allApiStatuses.map(status => <SelectItem key={status} value={status}>{statusApiToDisplayMap[status]}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )} />

                                        {watchedStatus === 'Interview_Scheduled' ? (
                                            <div className="space-y-4 p-4 border rounded-md">
                                                <h4 className="font-medium">Schedule Interview</h4>
                                                <FormField control={form.control} name="interviewDate" render={({ field }) => (
                                                    <FormItem className="flex flex-col"><FormLabel>Interview Date</FormLabel>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <FormControl>
                                                                    <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                                        {field.value ? format(field.value, "dd-MM-yy") : <span>Pick a date</span>}
                                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0" align="start">
                                                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                                            </PopoverContent>
                                                        </Popover>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                 <FormField control={form.control} name="interviewTime" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Interview Time</FormLabel>
                                                        <FormControl>
                                                            <TimePicker value={field.value} onChange={field.onChange} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="interviewInstructions" render={({ field }) => (
                                                    <FormItem><FormLabel>Interview Instructions</FormLabel><FormControl><RichTextEditor value={field.value || ''} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                            </div>
                                        ) : (
                                            <FormField control={form.control} name="comments" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Admin Comments</FormLabel>
                                                    <FormControl><RichTextEditor value={field.value || ''} onChange={field.onChange} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter className="mt-6 pt-4 border-t">
                                <Button type="button" variant="ghost" onClick={handleCloseDialog}>Cancel</Button>
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                    )}
                </DialogContent>
            </Dialog>

            {isDeleteDialogOpen && (
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete {selectedRows.size} selected application(s).
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteSelected}>
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </>
    );
}
