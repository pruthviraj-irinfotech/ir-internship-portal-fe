'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PostNewInternshipPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Post New Internship</CardTitle>
        <CardDescription>Fill in the form below to create a new internship listing.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>A form to add a new internship will be here.</p>
      </CardContent>
    </Card>
  );
}
