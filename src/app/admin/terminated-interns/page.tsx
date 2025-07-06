
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { applications, Application } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Search } from 'lucide-react';

export default function AdminTerminatedInternsPage() {
    const [terminatedApps] = useState<Application[]>(applications.filter(app => app.status === 'Terminated'));
    const [searchTerm, setSearchTerm] = useState('');

    const filteredApps = useMemo(() => {
        return terminatedApps.filter(app =>
            app.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.internshipTitle.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [terminatedApps, searchTerm]);

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <CardTitle>Terminated Interns</CardTitle>
                        <CardDescription>View interns whose programs were terminated.</CardDescription>
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
                                                    <Link href={`/admin/terminated-interns/${app.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">
                                        No terminated interns found.
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
