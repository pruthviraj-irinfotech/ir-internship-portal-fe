
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
import { PlusCircle, FilePenLine, Trash2, Search, Eye } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function AdminInternshipsPage() {
  const [internshipList, setInternshipList] = useState<Internship[]>(internships);
  const [internshipToDelete, setInternshipToDelete] = useState<Internship | null>(null);
  const [viewingInternship, setViewingInternship] = useState<Internship | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleDelete = (internshipId: number) => {
    const index = internships.findIndex(i => i.id === internshipId);
    if (index > -1) {
        internships.splice(index, 1);
    }
    setInternshipList(internships.slice());
    
    setInternshipToDelete(null);
    toast({
      title: 'Success!',
      description: 'The internship listing has been deleted.',
    });
  };

  const handleStatusChange = (internshipId: number, active: boolean) => {
    const updatedInternships = internshipList.map(internship => 
        internship.id === internshipId ? { ...internship, active } : internship
    );
    setInternshipList(updatedInternships);

    const index = internships.findIndex(i => i.id === internshipId);
    if (index > -1) {
        internships[index].active = active;
    }
    toast({
      title: 'Status Updated',
      description: `The internship has been set to ${active ? 'active' : 'inactive'}.`,
    });
  };

  const filteredInternships = useMemo(() => {
    let results = [...internshipList];

    if (searchTerm) {
      results = results.filter(internship =>
        internship.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Default sort by posted date desc
    return results.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
  }, [internshipList, searchTerm]);


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
                  <TableHead>Posted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInternships.length > 0 ? (
                  filteredInternships.map(internship => (
                    <TableRow key={internship.id}>
                      <TableCell className="font-medium">{internship.title}</TableCell>
                      <TableCell><Badge variant="outline">{internship.category}</Badge></TableCell>
                      <TableCell>{format(new Date(internship.postedDate), 'dd-MM-yy')}</TableCell>
                       <TableCell>
                        <Switch
                          checked={internship.active}
                          onCheckedChange={(checked) => handleStatusChange(internship.id, checked)}
                          aria-label={`Toggle status for ${internship.title}`}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                           <Button variant="outline" size="icon" onClick={() => setViewingInternship(internship)} title="View Details">
                            <Eye className="h-4 w-4" />
                          </Button>
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

      {viewingInternship && (
        <Dialog open={!!viewingInternship} onOpenChange={() => setViewingInternship(null)}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{viewingInternship.title}</DialogTitle>
                    <DialogDescription>{viewingInternship.company} - {viewingInternship.location}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div><Label className="text-sm text-muted-foreground">Duration</Label><p>{viewingInternship.duration}</p></div>
                      <div><Label className="text-sm text-muted-foreground">Category</Label><p><Badge variant="outline">{viewingInternship.category}</Badge></p></div>
                      <div><Label className="text-sm text-muted-foreground">Amount</Label><p>{viewingInternship.amount}</p></div>
                      <div><Label className="text-sm text-muted-foreground">Posted</Label><p>{format(new Date(viewingInternship.postedDate), 'dd-MM-yy')}</p></div>
                    </div>
                    <div className="space-y-4 border-t pt-4">
                        <div><Label>Short Description</Label><div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: viewingInternship.description || ''}} /></div>
                        <div><Label>Detailed Description</Label><div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: viewingInternship.detailedDescription || ''}} /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 border-t pt-4">
                      <div>
                        <Label>Who Can Apply</Label>
                        <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: viewingInternship.whoCanApply || ''}} />
                      </div>
                       <div>
                        <Label>Perks & Benefits</Label>
                        <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: viewingInternship.perksAndBenefits || ''}} />
                      </div>
                      <div>
                        <Label>Selection Process</Label>
                        <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: viewingInternship.selectionProcess || ''}} />
                      </div>
                       <div>
                        <Label>Announcements</Label>
                        <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: viewingInternship.announcements || ''}} />
                      </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
      )}
    </>
  );
}
