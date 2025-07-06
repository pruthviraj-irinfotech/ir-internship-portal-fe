'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { certificates, Certificate } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search } from 'lucide-react';
import Image from 'next/image';

export default function VerifyCertificatePage() {
  const [certificateId, setCertificateId] = useState('');
  const [foundCertificate, setFoundCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateId) {
      toast({
        title: 'Error',
        description: 'Please enter a certificate ID.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setSearched(false);
    setFoundCertificate(null);

    // Simulate API call
    setTimeout(() => {
      const cert = certificates.find(c => c.id.toLowerCase() === certificateId.toLowerCase());
      if (cert) {
        setFoundCertificate(cert);
        toast({
          title: 'Certificate Found!',
          description: `Details for certificate #${cert.id} are displayed below.`,
        });
      } else {
        toast({
          title: 'Not Found',
          description: 'No certificate was found with that ID.',
          variant: 'destructive',
        });
      }
      setIsLoading(false);
      setSearched(true);
    }, 1500);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 flex-1 flex flex-col items-center">
      <header className="text-center my-8 md:my-16">
        <h1 className="text-3xl md:text-5xl font-headline text-primary">Verify Certificate</h1>
        <p className="text-muted-foreground mt-4 text-sm md:text-base">
          Enter a certificate ID to verify its authenticity.
        </p>
      </header>

      <Card className="w-full max-w-md">
        <form onSubmit={handleSearch}>
          <CardHeader>
            <CardTitle>Certificate Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="certificateId">Certificate ID</Label>
              <div className="relative">
                <Input
                  id="certificateId"
                  placeholder="e.g., CERT12345"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  disabled={isLoading}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Verify'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {isLoading && (
         <div className="text-center py-16 w-full max-w-4xl mt-8">
           <Loader2 className="animate-spin mx-auto h-8 w-8 text-primary" />
           <p className="mt-4 text-muted-foreground">Searching for certificate...</p>
         </div>
      )}

      {foundCertificate && (
        <Card className="w-full max-w-4xl mt-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">Certificate of Completion</CardTitle>
            <CardDescription>ID: {foundCertificate.id}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-8">
             <div className="relative w-full max-w-3xl aspect-[4/3]">
              <Image
                src={foundCertificate.imageUrl}
                alt={`Certificate for ${foundCertificate.internName}`}
                fill
                className="object-contain"
                data-ai-hint="certificate document"
              />
            </div>
            <div className="w-full border-t pt-8 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-left">
               <div className="space-y-1">
                  <Label>Intern Name</Label>
                  <p className="text-lg font-semibold">{foundCertificate.internName}</p>
              </div>
              <div className="space-y-1">
                  <Label>Role</Label>
                  <p>{foundCertificate.internshipRole} at {foundCertificate.company}</p>
              </div>
               <div className="space-y-1">
                  <Label>Internship Duration</Label>
                  <p>{foundCertificate.duration}</p>
              </div>
               <div className="space-y-1">
                  <Label>Date Approved</Label>
                  <p>{foundCertificate.approvedDate}</p>
              </div>
              <div className="md:col-span-2 space-y-1">
                  <Label>Description</Label>
                  <p className="text-muted-foreground text-sm">{foundCertificate.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {searched && !foundCertificate && !isLoading && (
        <div className="text-center py-16 border-2 border-dashed border-border w-full max-w-4xl mt-8">
          <p className="text-muted-foreground">Certificate not found.</p>
          <p className="text-xs mt-2">Please check the ID and try again.</p>
        </div>
      )}
    </div>
  );
}
