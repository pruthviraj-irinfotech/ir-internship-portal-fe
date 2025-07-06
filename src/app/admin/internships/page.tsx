'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { internships, Internship } from '@/lib/mock-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PlusCircle, FilePenLine, Trash2, Search, ArrowUpDown } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function AdminInternshipsPage() {
  const [internshipList, setInternshipList] = useState<Internship[]>(internships);
  const [internshipToDelete, setInternshipToDelete] = useState<Internship | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  const handleDelete = (internshipId: number) => {
    // This removes the item from the mock data source for session persistence
    const index = internships.findIndex(i => i.id === internshipId);
    if (index > -1) {
        internships.splice(index, 1);
    }
    // This updates the local state to re-render the table
    setInternshipList(internships.slice());
    
    setInternshipToDelete(null);
    toast({
      title: 'Success!',
      description: 'The internship listing has been deleted.',
    });
  };
  
  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const filteredAndSortedInternships = useMemo(() => {
    const sorted = [...internshipList].sort((a, b) => {
      const dateA = new Date(a.postedDate).getTime();
      const dateB = new Date(b.postedDate).getTime();
      if (sortOrder === 'asc') {
        return dateA - dateB;
      }
      return dateB - dateA;
    });

    if (!searchTerm) {
      return sorted;
    }

    return sorted.filter(internship =>
      internship.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [internshipList, searchTerm, sortOrder]);


  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>All Internships</CardTitle>
              <CardDescription>Manage your company's internship listings here.</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by title..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" onClick={toggleSortOrder} className="w-full sm:w-auto">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Sort by Date
                </Button>
                <Button asChild className="w-full sm:w-auto">
                    <Link href="/admin/internships/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Post Internship
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
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Posted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedInternships.length > 0 ? (
                  filteredAndSortedInternships.map(internship => (
                    <TableRow key={internship.id}>
                      <TableCell className="font-medium">{internship.title}</TableCell>
                      <TableCell><Badge variant="outline">{internship.category}</Badge></TableCell>
                      <TableCell>{internship.duration}</TableCell>
                      <TableCell>{format(new Date(internship.postedDate), 'dd-MM-yy')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" asChild title="Edit Internship">
                            <Link href={`/admin/internships/edit/${internship.id}`}>
                              <FilePenLine className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            onClick={() => setInternshipToDelete(internship)}
                            title="Delete Internship"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No internships found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {internshipToDelete && (
        <AlertDialog
          open={!!internshipToDelete}
          onOpenChange={() => setInternshipToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                internship listing for "{internshipToDelete.title}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDelete(internshipToDelete.id)}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
