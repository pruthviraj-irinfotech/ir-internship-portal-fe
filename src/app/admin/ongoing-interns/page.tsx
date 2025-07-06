
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { applications, Application } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, FilePenLine, Search, UserX, CheckCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export default function AdminOngoingInternsPage() {
    const [ongoingApps, setOngoingApps] = useState<Application[]>(applications.filter(app => app.status === 'Ongoing'));
    const [searchTerm, setSearchTerm] = useState('');
    const [appAction, setAppAction] = useState<{ action: 'complete' | 'terminate'; app: Application } | null>(null);
    const { toast } = useToast();

    const filteredApps = useMemo(() => {
        return ongoingApps.filter(app =>
            app.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.internshipTitle.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [ongoingApps, searchTerm]);

    const handleCompleteInternship = (appId: string) => {
        if (!appAction?.app) return;

        const appIndex = applications.findIndex(app => app.id === appId);
        if (appIndex !== -1) {
            applications[appIndex].status = 'Selected';
        }

        setOngoingApps(prev => prev.filter(app => app.id !== appId));
        
        toast({
            title: 'Internship Completed',
            description: `${appAction.app.userName}'s internship has been marked as completed.`,
        });

        setAppAction(null);
    };

    const handleTerminateInternship = (appId: string) => {
        if (!appAction?.app) return;
        const appIndex = applications.findIndex(app => app.id === appId);
        if (appIndex !== -1) {
            applications[appIndex].status = 'Terminated';
        }
        setOngoingApps(prev => prev.filter(app => app.id !== appId));
        toast({
            title: 'Internship Terminated',
            description: `${appAction.app.userName}'s internship has been marked as terminated.`,
            variant: 'destructive',
        });
        setAppAction(null);
    }

    const handleAction = () => {
        if (!appAction) return;
        if (appAction.action === 'complete') {
            handleCompleteInternship(appAction.app.id);
        } else {
            handleTerminateInternship(appAction.app.id);
        }
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle>Ongoing Interns</CardTitle>
                            <CardDescription>View and manage interns currently in your programs.</CardDescription>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or role..."
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
                                    <TableHead>Intern Name</TableHead>
                                    <TableHead>Internship Role</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredApps.length > 0 ? (
                                    filteredApps.map(app => (
                                        <TableRow key={app.id}>
                                            <TableCell className="font-medium">{app.userName}</TableCell>
                                            <TableCell>{app.internshipTitle}</TableCell>
                                            <TableCell>{app.userEmail}</TableCell>
                                            <TableCell>{app.userPhone}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="icon" asChild title="View Details">
                                                        <Link href={`/admin/ongoing-interns/${app.id}`}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="outline" size="icon" asChild title="Edit User Profile">
                                                        <Link href={`/admin/users/edit/${app.userId}`}>
                                                            <FilePenLine className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                     <Button variant="outline" size="icon" onClick={() => setAppAction({ action: 'complete', app })} title="Mark as Completed">
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="destructive" size="icon" onClick={() => setAppAction({ action: 'terminate', app })} title="Terminate Internship">
                                                        <UserX className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24">
                                            No ongoing interns found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {appAction && (
                <AlertDialog open={!!appAction} onOpenChange={() => setAppAction(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                {appAction.action === 'complete' ? 'Complete Internship?' : 'Terminate Internship?'}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {appAction.action === 'complete'
                                    ? `This will mark the internship for "${appAction.app.userName}" as completed. This action cannot be undone.`
                                    : `This will mark the internship for "${appAction.app.userName}" as terminated. This action cannot be undone.`
                                }
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleAction}>
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </>
    );
}
