
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import type { Certificate, CertificateStatus } from '@/lib/mock-data';

const statusColors: Record<CertificateStatus, 'default' | 'secondary' | 'destructive'> = {
    'Active': 'default',
    'On Hold': 'secondary',
    'Terminated': 'destructive',
};

async function verifyCertificateApi(certificateNumber: string): Promise<Certificate | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    console.error('API base URL is not configured.');
    return null;
  }
  
  if (!certificateNumber) {
      return null;
  }

  try {
    const response = await fetch(`${baseUrl}/api/certificates/verify/${certificateNumber}`);
    
    if (response.status === 404) {
        return null; // Certificate not found
    }

    if (!response.ok) {
        // Log other server-side errors
        console.error('API error:', response.status, await response.text());
        return null;
    }

    const data = await response.json();
    
    // Adapt the API response to the existing Certificate type
    return {
        id: 0,
        applicationId: 0,
        certificateNumber: certificateNumber,
        internName: data.internName,
        internshipRole: data.role,
        company: 'IR INFOTECH',
        duration: data.internshipDuration,
        approvedDate: data.certificateDate,
        description: data.description,
        imageUrl: data.imageUrl.startsWith('http') ? data.imageUrl : `${baseUrl}${data.imageUrl}`,
        status: data.certificateStatus,
    };

  } catch (error) {
    console.error('An error occurred while fetching the certificate:', error);
    return null;
  }
}

export default function VerifyCertificatePage() {
  const [certificateId, setCertificateId] = useState('');
  const [foundCertificate, setFoundCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
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

    try {
      const cert = await verifyCertificateApi(certificateId);
      
      if (cert) {
        setFoundCertificate(cert);
        toast({
          title: 'Certificate Found!',
          description: `Details for certificate #${cert.certificateNumber} are displayed below.`,
        });
      } else {
        toast({
          title: 'Not Found',
          description: 'No certificate was found with that ID.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error("Verification failed:", error);
      toast({
        title: 'An error occurred',
        description: 'Could not verify the certificate. Please try again later.',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
    setSearched(true);
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
                  placeholder="e.g., CERT-2024-001"
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
            <CardDescription>ID: {foundCertificate.certificateNumber}</CardDescription>
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
                  <p>{foundCertificate.internshipRole}</p>
              </div>
               <div className="space-y-1">
                  <Label>Internship Duration</Label>
                  <p>{foundCertificate.duration}</p>
              </div>
               <div className="space-y-1">
                  <Label>Date Approved</Label>
                  <p>{format(new Date(foundCertificate.approvedDate), 'dd-MM-yy')}</p>
              </div>
               <div className="space-y-1">
                  <Label>Status</Label>
                  <p>
                      <Badge variant={statusColors[foundCertificate.status] || 'default'}>
                          {foundCertificate.status}
                      </Badge>
                  </p>
              </div>
              <div className="md:col-span-2 space-y-1">
                  <Label>Description</Label>
                  <div className="text-muted-foreground text-sm" dangerouslySetInnerHTML={{ __html: foundCertificate.description }} />
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
