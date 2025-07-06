
'use client';

import { useParams, useRouter } from 'next/navigation';
import { internships } from '@/lib/mock-data';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ListChecks, Award, UserCheck, Megaphone } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';


export default function InternshipDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const internshipId = params.id as string;
  const internship = internships.find(i => i.id.toString() === internshipId);

  if (!internship) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Internship Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The internship you are looking for does not exist.</p>
            <Button onClick={() => router.push('/')} className="mt-4">
              Back to Internships
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    title,
    company,
    location,
    duration,
    category,
    amount,
    detailedDescription,
    selectionProcess,
    perksAndBenefits,
    whoCanApply,
    announcements
  } = internship;

  return (
    <div className="container mx-auto p-4 md:p-8 flex-1">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                 <h1 className="text-3xl md:text-4xl font-headline text-primary">{title}</h1>
                 <p className="text-muted-foreground mt-2 text-lg">{company} - {location}</p>
            </div>
            {isLoggedIn ? (
                <Button size="lg" asChild>
                    <Link href={`/apply/${internship.id}`}>Apply Now</Link>
                </Button>
            ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg">Apply Now</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Login Required</DialogTitle>
                      <DialogDescription>
                        It seems you haven't logged in to the platform. To continue, please login or create an account.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-4 pt-4">
                       <Button variant="outline" asChild>
                         <Link href={`/signup?redirect=/apply/${internship.id}`}>Create Account</Link>
                       </Button>
                      <Button asChild>
                          <Link href={`/login?redirect=/apply/${internship.id}`}>Login</Link>
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
            )}
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
            <Badge variant="outline">{duration}</Badge>
            <Badge variant="outline">{category}</Badge>
            {(category === 'Stipend' || category === 'Paid') && <Badge variant="outline">{amount}</Badge>}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <Card>
            <CardHeader>
              <CardTitle>Internship Role Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: detailedDescription || 'No detailed description available.' }} />
            </CardContent>
          </Card>

          {whoCanApply && whoCanApply.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5" /> Who Can Apply
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {whoCanApply.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              </CardContent>
            </Card>
          )}

           {selectionProcess && selectionProcess.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListChecks className="w-5 h-5" /> Selection Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {selectionProcess.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              </CardContent>
            </Card>
          )}

        </div>
        <div className="space-y-8">
           {perksAndBenefits && perksAndBenefits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" /> Perks and Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {perksAndBenefits.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              </CardContent>
            </Card>
          )}

          {announcements && announcements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5" /> Important Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {announcements.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
