
'use server';
/**
 * @fileOverview A server action for verifying internship certificates.
 *
 * - verifyCertificate - A function that fetches certificate details by its number from the API.
 */

import type { Certificate } from '@/lib/mock-data';

/**
 * Finds a certificate by its number by calling the verification API.
 * The search is case-insensitive on the API side.
 *
 * @param certificateNumber - The certificate number to search for.
 * @returns The certificate object if found, otherwise null.
 */
export async function verifyCertificate(certificateNumber: string): Promise<Certificate | null> {
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
    const adaptedCertificate: Certificate = {
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

    return adaptedCertificate;

  } catch (error) {
    console.error('An error occurred while fetching the certificate:', error);
    return null;
  }
}
