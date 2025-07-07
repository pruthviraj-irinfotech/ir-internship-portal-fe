'use server';
/**
 * @fileOverview A server action for verifying internship certificates.
 *
 * - verifyCertificate - A function that fetches certificate details by its number.
 */

import { certificates, Certificate } from '@/lib/mock-data';

/**
 * Finds a certificate by its number from the mock data.
 * The search is case-insensitive.
 *
 * @param certificateNumber - The certificate number to search for.
 * @returns The certificate object if found, otherwise null.
 */
export async function verifyCertificate(certificateNumber: string): Promise<Certificate | null> {
  // In a real application, you would query your database here.
  // For this example, we'll use the mock data.
  const cert = certificates.find(c => c.certificateNumber.toLowerCase() === certificateNumber.toLowerCase());

  if (cert) {
    return cert;
  }

  return null;
}
