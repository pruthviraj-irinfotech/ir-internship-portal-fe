'use server';

/**
 * @fileOverview Generates certificate descriptions using AI based on intern details.
 *
 * - generateCertificateDescription - A function that generates the certificate description.
 * - GenerateCertificateDescriptionInput - The input type for the generateCertificateDescription function.
 * - GenerateCertificateDescriptionOutput - The return type for the generateCertificateDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCertificateDescriptionInputSchema = z.object({
  internName: z.string().describe('The name of the intern.'),
  internshipRole: z.string().describe('The role of the internship.'),
  startDate: z.string().describe('The start date of the internship (YYYY-MM-DD).'),
  endDate: z.string().describe('The end date of the internship (YYYY-MM-DD).'),
});
export type GenerateCertificateDescriptionInput = z.infer<
  typeof GenerateCertificateDescriptionInputSchema
>;

const GenerateCertificateDescriptionOutputSchema = z.object({
  certificateDescription: z
    .string()
    .describe('The generated certificate description.'),
});
export type GenerateCertificateDescriptionOutput = z.infer<
  typeof GenerateCertificateDescriptionOutputSchema
>;

export async function generateCertificateDescription(
  input: GenerateCertificateDescriptionInput
): Promise<GenerateCertificateDescriptionOutput> {
  return generateCertificateDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCertificateDescriptionPrompt',
  input: {schema: GenerateCertificateDescriptionInputSchema},
  output: {schema: GenerateCertificateDescriptionOutputSchema},
  prompt: `You are an AI assistant that specializes in creating certificate descriptions for internships.

  Given the following intern details, generate a compelling and informative certificate description.

  Intern Name: {{{internName}}}
  Internship Role: {{{internshipRole}}}
  Start Date: {{{startDate}}}
  End Date: {{{endDate}}}

  Certificate Description:`,
});

const generateCertificateDescriptionFlow = ai.defineFlow(
  {
    name: 'generateCertificateDescriptionFlow',
    inputSchema: GenerateCertificateDescriptionInputSchema,
    outputSchema: GenerateCertificateDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
