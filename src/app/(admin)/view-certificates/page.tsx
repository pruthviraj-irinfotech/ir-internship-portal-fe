'use client';

import { useState, useEffect } from 'react';
import { certificates, Certificate } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, FileDown, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function ViewCertificatesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCertificates, setFilteredCertificates] = useState<Certificate[]>(certificates);

    useEffect(() => {
        const results = certificates.filter(cert =>
            cert.internName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCertificates(results);
    }, [searchTerm]);

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <CardTitle>View Certificates</CardTitle>
                        <CardDescription>Search and manage all issued internship certificates.</CardDescription>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search by name or ID..."
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
                                                <Button variant="outline" size="icon" asChild>
                                                    <a href={cert.imageUrl} target="_blank" rel="noopener noreferrer" title="View PNG">
                                                        <ImageIcon className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                                <Button variant="outline" size="icon" asChild>
                                                     <a href={cert.pdfUrl} target="_blank" rel="noopener noreferrer" title="View PDF">
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
    );
}
