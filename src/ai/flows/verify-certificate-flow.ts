'use server';
/**
 * @fileOverview A Genkit flow for verifying internship certificates.
 *
 * - verifyCertificate - A function that fetches certificate details by its number.
 */

import { ai } from '@/ai/genkit';
import { certificates, Certificate } from '@/lib/mock-data';
import { z } from 'zod';

// Define the output schema based on the Certificate type
const CertificateSchema = z.object({
  id: z.number(),
  applicationId: z.number(),
  certificateNumber: z.string(),
  internName: z.string(),
  internshipRole: z.string(),
  company: z.string(),
  duration: z.string(),
  approvedDate: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  pdfUrl: z.string().optional(),
  startDate: z.string().optional(),
  uploadedBy: z.number().optional(),
  status: z.enum(['Active', 'On Hold', 'Terminated']),
});

const CertificateVerificationOutputSchema = CertificateSchema.nullable();


// The main function that will be called from the frontend.
export async function verifyCertificate(certificateNumber: string): Promise<Certificate | null> {
  return verifyCertificateFlow(certificateNumber);
}

const verifyCertificateFlow = ai.defineFlow(
  {
    name: 'verifyCertificateFlow',
    inputSchema: z.string(),
    outputSchema: CertificateVerificationOutputSchema,
  },
  async (certificateNumber): Promise<Certificate | null> => {
    // In a real application, you would query your database here.
    // For this example, we'll use the mock data.
    const cert = certificates.find(c => c.certificateNumber.toLowerCase() === certificateNumber.toLowerCase());

    if (cert) {
      return cert;
    }

    return null;
  }
);
