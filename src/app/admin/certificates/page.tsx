
'use client';

import { useState, useEffect, useCallback } from 'react';
import * as api from '@/lib/api';
import type { CertificateListItem, CertificateStatus, DetailedCertificate } from '@/lib/mock-data';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Search, FileDown, Image as ImageIcon, PlusCircle, Eye, FilePenLine, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const statusColors: Record<CertificateStatus, 'default' | 'secondary' | 'destructive'> = {
    'Active': 'default',
    'On Hold': 'secondary',
    'Terminated': 'destructive',
};

export default function CertificatesIssuedPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [certificates, setCertificates] = useState<CertificateListItem[]>([]);
    const [isDialogLoading, setIsDialogLoading] = useState(false);
    const [selectedCertificate, setSelectedCertificate] = useState<DetailedCertificate | null>(null);
    const [certToDelete, setCertToDelete] = useState<CertificateListItem | null>(null);
    const { token } = useAuth();
    const { toast } = useToast();
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const fetchCertificates = useCallback(async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const data = await api.getCertificates(token, searchTerm);
            setCertificates(data);
        } catch (error: any) {
            toast({ title: 'Error', description: `Failed to fetch certificates: ${error.message}`, variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    }, [token, searchTerm, toast]);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchCertificates();
        }, 500); // Debounce search
        return () => clearTimeout(handler);
    }, [fetchCertificates]);

    const handleViewDetails = async (certId: number) => {
        if (!token) return;
        setIsDialogLoading(true);
        setSelectedCertificate(null);
        try {
            const data = await api.getCertificateById(certId, token);
            setSelectedCertificate(data);
        } catch (error: any) {
            toast({ title: 'Error', description: `Failed to fetch details: ${error.message}`, variant: 'destructive' });
        } finally {
            setIsDialogLoading(false);
        }
    };
    
    const handleDelete = async () => {
        if (!certToDelete || !token) return;
        try {
            await api.deleteCertificate(certToDelete.certificate_id, token);
            setCertificates(prev => prev.filter(c => c.certificate_id !== certToDelete.certificate_id));
            toast({ title: 'Success', description: 'Certificate deleted successfully.' });
        } catch (error: any) {
            toast({ title: 'Error', description: `Failed to delete certificate: ${error.message}`, variant: 'destructive' });
        } finally {
            setCertToDelete(null);
        }
    };

    const getFullUrl = (relativeUrl: string | null | undefined) => {
        if (!relativeUrl) return 'https://placehold.co/800x600.png';
        if (relativeUrl.startsWith('http')) return relativeUrl;
        return `${baseUrl}${relativeUrl}`;
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle>Issued Certificates</CardTitle>
                            <CardDescription>Search and manage all issued internship certificates.</CardDescription>
                        </div>
                         <div className='flex gap-2'>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search by name or ID..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                             <Button asChild>
                                <Link href="/admin/upload-certificate">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Upload
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Certificate ID</TableHead>
                                    <TableHead>Intern Name</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Date Approved</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow><TableCell colSpan={6} className="text-center h-24"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                                ) : certificates.length > 0 ? (
                                    certificates.map(cert => (
                                        <TableRow key={cert.certificate_id}>
                                            <TableCell className="font-mono">{cert.certificate_number}</TableCell>
                                            <TableCell className="font-medium">{cert.intern_name}</TableCell>
                                            <TableCell>{cert.role}</TableCell>
                                            <TableCell>{format(parseISO(cert.date_approved), 'dd-MM-yy')}</TableCell>
                                            <TableCell>
                                                <Badge variant={statusColors[cert.status] || 'Active'}>
                                                    {cert.status || 'Active'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="icon" onClick={() => handleViewDetails(cert.certificate_id)} title="View Details">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="outline" size="icon" asChild title="Edit Certificate">
                                                        <Link href={`/admin/certificates/edit/${cert.certificate_id}`}>
                                                            <FilePenLine className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="destructive" size="icon" onClick={() => setCertToDelete(cert)} title="Delete Certificate">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24">
                                            No certificates found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!selectedCertificate || isDialogLoading} onOpenChange={() => setSelectedCertificate(null)}>
                <DialogContent className="sm:max-w-2xl">
                    {isDialogLoading ? (
                        <div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
                    ) : !selectedCertificate ? (
                        <div className="p-12 text-center">Could not load certificate details.</div>
                    ) : (
                        <>
                            <DialogHeader>
                                <DialogTitle>Certificate Details</DialogTitle>
                                <DialogDescription>Viewing details for Certificate ID: {selectedCertificate.certificate_number}</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                                <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden border">
                                    <Image 
                                        src={getFullUrl(selectedCertificate.image_url)}
                                        alt={`Certificate for ${selectedCertificate.intern_details.name}`}
                                        fill
                                        className="object-contain"
                                        data-ai-hint="certificate document"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                    <div><Label className="text-sm text-muted-foreground">Intern Name</Label><p className="font-semibold">{selectedCertificate.intern_details.name}</p></div>
                                    <div><Label className="text-sm text-muted-foreground">Internship Role</Label><p>{selectedCertificate.intern_details.role}</p></div>
                                    <div><Label className="text-sm text-muted-foreground">Company</Label><p>{selectedCertificate.intern_details.company}</p></div>
                                    <div><Label className="text-sm text-muted-foreground">Duration</Label><p>{selectedCertificate.intern_details.duration}</p></div>
                                    <div><Label className="text-sm text-muted-foreground">Start Date</Label><p>{format(parseISO(selectedCertificate.start_date), 'dd-MM-yy')}</p></div>
                                    <div><Label className="text-sm text-muted-foreground">Date Approved</Label><p>{format(parseISO(selectedCertificate.issue_date), 'dd-MM-yy')}</p></div>
                                    <div><Label className="text-sm text-muted-foreground">Status</Label><p><Badge variant={statusColors[selectedCertificate.status]}>{selectedCertificate.status}</Badge></p></div>
                                    <div><Label className="text-sm text-muted-foreground">Uploaded By</Label><p>Admin (ID: {selectedCertificate.uploaded_by_id})</p></div>
                                    <div className="col-span-2"><Label className="text-sm text-muted-foreground">Description</Label><div className="text-sm" dangerouslySetInnerHTML={{ __html: selectedCertificate.description }} /></div>
                                </div>
                                <div className="flex gap-4 pt-4 border-t">
                                     <Button asChild className="w-full">
                                        <a href={getFullUrl(selectedCertificate.image_url)} target="_blank" rel="noopener noreferrer"><ImageIcon className="mr-2"/> View PNG</a>
                                     </Button>
                                     <Button asChild className="w-full">
                                        <a href={getFullUrl(selectedCertificate.pdf_url)} target="_blank" rel="noopener noreferrer"><FileDown className="mr-2"/> Download PDF</a>
                                     </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {certToDelete && (
                <AlertDialog open={!!certToDelete} onOpenChange={() => setCertToDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the certificate ({certToDelete.certificate_number}) for {certToDelete.intern_name}. This action cannot be undone.
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
