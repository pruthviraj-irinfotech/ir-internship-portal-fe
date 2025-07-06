
'use client';

import { useState } from 'react';
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
import { PlusCircle, FilePenLine, Trash2 } from 'lucide-react';
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

export default function AdminInternshipsPage() {
  const [internshipList, setInternshipList] = useState<Internship[]>(internships);
  const [internshipToDelete, setInternshipToDelete] = useState<Internship | null>(null);
  const { toast } = useToast();

  const handleDelete = (internshipId: number) => {
    // This updates the local state to re-render the table
    const updatedList = internshipList.filter(i => i.id !== internshipId);
    setInternshipList(updatedList);
    
    // This removes the item from the mock data source for session persistence
    const index = internships.findIndex(i => i.id === internshipId);
    if (index > -1) {
        internships.splice(index, 1);
    }
    
    setInternshipToDelete(null);
    toast({
      title: 'Success!',
      description: 'The internship listing has been deleted.',
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>All Internships</CardTitle>
              <CardDescription>Manage your company's internship listings here.</CardDescription>
            </div>
            <Button asChild>
              <Link href="/admin/internships/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Post Internship
              </Link>
            </Button>
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
                {internshipList.length > 0 ? (
                  internshipList.map(internship => (
                    <TableRow key={internship.id}>
                      <TableCell className="font-medium">{internship.title}</TableCell>
                      <TableCell><Badge variant="outline">{internship.category}</Badge></TableCell>
                      <TableCell>{internship.duration}</TableCell>
                      <TableCell>{internship.postedDate}</TableCell>
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
                      No internships posted yet.
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
