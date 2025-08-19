
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import * as api from '@/lib/api';
import type { Intern } from '@/lib/mock-data';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Search, Trash2, Loader2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export default function AdminOngoingInternsPage() {
    const [interns, setInterns] = useState<Intern[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [internToDelete, setInternToDelete] = useState<Intern | null>(null);
    const { token } = useAuth();
    const { toast } = useToast();

    const fetchInterns = useCallback(async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const data = await api.getInternsByStatus(token, 'Ongoing', searchTerm);
            setInterns(data);
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setIsLoading(false);
        }
    }, [token, searchTerm, toast]);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchInterns();
        }, 500);
        return () => clearTimeout(handler);
    }, [fetchInterns]);

    const handleDelete = async () => {
        if (!internToDelete || !token) return;
        try {
            await api.deleteApplication(internToDelete.id, token);
            setInterns(prev => prev.filter(i => i.id !== internToDelete.id));
            toast({ title: 'Success', description: `Application for ${internToDelete.internName} deleted.` });
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setInternToDelete(null);
        }
    };

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
                                {isLoading ? (
                                    <TableRow><TableCell colSpan={5} className="text-center h-24"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                                ) : interns.length > 0 ? (
                                    interns.map(intern => (
                                        <TableRow key={intern.id}>
                                            <TableCell className="font-medium">{intern.internName}</TableCell>
                                            <TableCell>{intern.internshipRole}</TableCell>
                                            <TableCell>{intern.email}</TableCell>
                                            <TableCell>{intern.phone}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="icon" asChild title="View & Manage Application">
                                                        <Link href={`/admin/ongoing-interns/${intern.id}`}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="destructive" size="icon" onClick={() => setInternToDelete(intern)} title="Delete Application">
                                                        <Trash2 className="h-4 w-4" />
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

             {internToDelete && (
                 <AlertDialog open={!!internToDelete} onOpenChange={() => setInternToDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the application for {internToDelete.internName}.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </>
    );
}
