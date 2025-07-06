'use client';

import { useState, useEffect } from 'react';
import { certificates, Certificate } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, FileDown, Image as ImageIcon, PlusCircle, Eye, FilePenLine } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CertificatesIssuedPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCertificates, setFilteredCertificates] = useState<Certificate[]>(certificates);
    const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

    useEffect(() => {
        const results = certificates.filter(cert =>
            cert.internName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCertificates(results);
    }, [searchTerm, certificates]);

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
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCertificates.length > 0 ? (
                                    filteredCertificates.map(cert => (
                                        <TableRow key={cert.id}>
                                            <TableCell className="font-mono">{cert.id}</TableCell>
                                            <TableCell className="font-medium">{cert.internName}</TableCell>
                                            <TableCell>{cert.internshipRole}</TableCell>
                                            <TableCell>{cert.approvedDate}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="icon" onClick={() => setSelectedCertificate(cert)} title="View Details">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="outline" size="icon" asChild title="Edit Certificate">
                                                        <Link href={`/admin/certificates/edit/${cert.id}`}>
                                                            <FilePenLine className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="outline" size="icon" asChild title="View PNG">
                                                        <a href={cert.imageUrl} target="_blank" rel="noopener noreferrer">
                                                            <ImageIcon className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                    <Button variant="outline" size="icon" asChild title="View PDF">
                                                         <a href={cert.pdfUrl} target="_blank" rel="noopener noreferrer">
                                                            <FileDown className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24">
                                            No certificates found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {selectedCertificate && (
                 <Dialog open={!!selectedCertificate} onOpenChange={(isOpen) => !isOpen && setSelectedCertificate(null)}>
                    <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Certificate Details</DialogTitle>
                            <DialogDescription>Viewing details for Certificate ID: {selectedCertificate.id}</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                            <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden border">
                                <Image 
                                    src={selectedCertificate.imageUrl}
                                    alt={`Certificate for ${selectedCertificate.internName}`}
                                    fill
                                    className="object-contain"
                                    data-ai-hint="certificate document"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                <div>
                                    <Label className="text-sm text-muted-foreground">Intern Name</Label>
                                    <p className="font-semibold">{selectedCertificate.internName}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-muted-foreground">Internship Role</Label>
                                    <p>{selectedCertificate.internshipRole}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-muted-foreground">Company</Label>
                                    <p>{selectedCertificate.company}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-muted-foreground">Duration</Label>
                                    <p>{selectedCertificate.duration}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-muted-foreground">Start Date</Label>
                                    <p>{selectedCertificate.startDate}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-muted-foreground">Date Approved</Label>
                                    <p>{selectedCertificate.approvedDate}</p>
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-sm text-muted-foreground">Description</Label>
                                    <p className="text-sm">{selectedCertificate.description}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-muted-foreground">Uploaded By</Label>
                                    <p>{selectedCertificate.uploadedBy}</p>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
