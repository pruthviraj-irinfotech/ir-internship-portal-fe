'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { internships } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileDown, Upload, Paperclip } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';

export default function OngoingInternshipDetailsPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  const internshipId = params.id;
  const internship = internships.find(i => i.id.toString() === internshipId);

  if (!isLoggedIn) {
    return null; // or a loading spinner
  }

  if (!internship || internship.status !== 'Ongoing') {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This internship could not be found or is not ongoing.</p>
            <Button onClick={() => router.push('/ongoing')} className="mt-4">
              Back to Ongoing Internships
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleUpload = (e: React.FormEvent) => {
      e.preventDefault();
      // In a real app, this would handle the file upload to a server.
      toast({ title: "Success!", description: "Your document has been uploaded." });
  }

  return (
    <div className="container mx-auto p-4 md:p-8 flex-1">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline text-primary">{internship.title}</h1>
        <p className="text-muted-foreground mt-2 text-lg">{internship.company}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Internship Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">{internship.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin Notes</CardTitle>
              <CardDescription>Updates and important information from the admin.</CardDescription>
            </CardHeader>
            <CardContent>
              {internship.adminNotes && internship.adminNotes.length > 0 ? (
                <ul className="space-y-4 list-disc list-inside text-muted-foreground">
                  {internship.adminNotes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No notes from the admin yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {internship.assignedDocuments && internship.assignedDocuments.length > 0 ? (
                internship.assignedDocuments.map((doc, index) => (
                   <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                     <div className="flex items-center gap-2 overflow-hidden">
                       <Paperclip className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                       <span className="text-sm truncate" title={doc.name}>{doc.name}</span>
                     </div>
                     <Button variant="ghost" size="icon" asChild>
                       <a href={doc.url} download>
                         <FileDown className="h-4 w-4" />
                       </a>
                     </Button>
                   </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No documents assigned yet.</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
             <CardHeader>
              <CardTitle>Upload Your Work</CardTitle>
              <CardDescription>Submit your completed assignments here.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload} className="space-y-4">
                <Input type="file" />
                <Button className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
