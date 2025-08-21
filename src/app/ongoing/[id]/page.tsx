
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, File, Loader2, Trash2, Upload, FileDown } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import * as api from '@/lib/api';
import type { Document, ApplicationDetails } from '@/lib/mock-data';
import { getFullUrl } from '@/lib/utils';

function formatBytes(bytes: number, decimals = 2) {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default function UserOngoingInternshipDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { isLoggedIn, token } = useAuth();
    const { toast } = useToast();
    const appId = parseInt(params.id as string, 10);

    const [details, setDetails] = useState<ApplicationDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [newFile, setNewFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const fetchDetails = useCallback(async () => {
        if (!token || isNaN(appId)) return;
        setIsLoading(true);
        try {
            const data = await api.getOngoingInternshipDetails(appId, token);
            setDetails(data);
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: 'Ongoing internship application not found.' });
            router.replace('/my-games');
        } finally {
            setIsLoading(false);
        }
    }, [appId, token, router, toast]);

    useEffect(() => {
        if (!isLoggedIn) {
          router.push(`/login?redirect=/ongoing/${appId}`);
        } else {
            fetchDetails();
        }
    }, [isLoggedIn, router, appId, fetchDetails]);

    const handleDocDelete = async (docId: number) => {
        if (!token) return;
        try {
            await api.deleteDocument(docId, token);
            setDetails(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    userDocuments: prev.userDocuments?.filter(d => d.id !== docId),
                };
            });
            toast({ title: 'Document Deleted', description: 'The document has been removed.' });
        } catch (error: any) {
            toast({ title: 'Deletion Failed', description: error.message, variant: 'destructive' });
        }
    };
    
    const handleFileUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFile || !token) {
            toast({ variant: 'destructive', title: 'No file selected' });
            return;
        }
        setIsUploading(true);
        try {
            const uploadedDoc = await api.uploadDocument(appId, newFile, token);
            setDetails(prev => prev ? ({
                ...prev,
                userDocuments: [...(prev.userDocuments || []), uploadedDoc]
            }) : null);
            
            setNewFile(null);
            (e.target as HTMLFormElement).reset();
            toast({ title: 'File Uploaded', description: `${newFile.name} has been added.` });
        } catch (error: any) {
             toast({ title: 'Upload Failed', description: error.message, variant: 'destructive' });
        } finally {
            setIsUploading(false);
        }
    };

    if (isLoading || !details) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 flex-1">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">{details.internship.title}</h1>
                    <p className="text-muted-foreground">Ongoing Internship Details</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                     <Card>
                        <CardHeader><CardTitle>Documents for You</CardTitle><CardDescription>Documents provided by the admin.</CardDescription></CardHeader>
                        <CardContent>
                           <ul className="space-y-2">
                                {(details.adminDocuments || []).length > 0 ? (
                                    details.adminDocuments!.map(doc => (
                                        <li key={doc.id} className="flex items-center justify-between p-2 border rounded-md">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <File className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium truncate" title={doc.name}>{doc.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {format(parseISO(doc.uploadedAt), 'dd-MM-yy')} - {formatBytes(doc.sizeBytes)}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" asChild>
                                                <a href={getFullUrl(doc.url)} download={doc.name} title="Download Document">
                                                    <FileDown className="h-4 w-4" />
                                                </a>
                                            </Button>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">No documents assigned by admin yet.</p>
                                )}
                           </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Your Submitted Documents</CardTitle><CardDescription>Documents you have uploaded.</CardDescription></CardHeader>
                        <CardContent>
                           <ul className="space-y-2">
                                {(details.userDocuments || []).length > 0 ? (
                                    details.userDocuments!.map(doc => (
                                         <li key={doc.id} className="flex items-center justify-between p-2 border rounded-md">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <File className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium truncate" title={doc.name}>{doc.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {format(parseISO(doc.uploadedAt), 'dd-MM-yy')} - {formatBytes(doc.sizeBytes)}
                                                    </p>
                                                </div>
                                            </div>
                                             <div className="flex items-center">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <a href={getFullUrl(doc.url)} download={doc.name} title="Download Document">
                                                        <FileDown className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDocDelete(doc.id)} title="Delete Document">
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">You have not submitted any documents yet.</p>
                                )}
                           </ul>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Internship Information</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-4">
                            <div><Label>Your Name</Label><p>{details.userName}</p></div>
                            <div><Label>Internship Role</Label><p>{details.internship.title}</p></div>
                            <div><Label>Start Date</Label><p>{format(parseISO(details.applicationDate), 'PPP')}</p></div>
                             <div><Label>End Date</Label><p>{details.endDate ? format(parseISO(details.endDate), 'PPP') : 'Not set'}</p></div>
                             <div><Label>Reporting To</Label><p>{details.reportingTo || 'Not assigned'}</p></div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle>Upload New Document</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={handleFileUpload} className="space-y-4">
                                <Input type="file" onChange={(e) => setNewFile(e.target.files ? e.target.files[0] : null)} disabled={isUploading} />
                                <Button className="w-full" type="submit" disabled={!newFile || isUploading}>
                                    {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                    {isUploading ? 'Uploading...' : 'Upload'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
