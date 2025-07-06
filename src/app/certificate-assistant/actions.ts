'use server';

import { generateCertificateDescription, GenerateCertificateDescriptionInput } from '@/ai/flows/generate-certificate-description';
import { z } from 'zod';

const CertificateSchema = z.object({
  internName: z.string().min(2, "Intern name is required."),
  internshipRole: z.string().min(2, "Internship role is required."),
  startDate: z.string().min(1, "Start date is required."),
  endDate: z.string().min(1, "End date is required."),
});

export type FormState = {
  message: string;
  description?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function generateCertificateAction(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = CertificateSchema.safeParse(formData);

  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => issue.message);
    return {
      message: "Invalid form data",
      issues,
      fields: {
        internName: data.get("internName")?.toString() ?? '',
        internshipRole: data.get("internshipRole")?.toString() ?? '',
        startDate: data.get("startDate")?.toString() ?? '',
        endDate: data.get("endDate")?.toString() ?? '',
      }
    };
  }
  
  try {
    const result = await generateCertificateDescription(parsed.data as GenerateCertificateDescriptionInput);
    return {
      message: "success",
      description: result.certificateDescription,
    };
  } catch (e) {
    return {
      message: "AI generation failed. Please try again.",
      fields: parsed.data,
    }
  }
}
