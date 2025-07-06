'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminInternshipsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Internships</CardTitle>
        <CardDescription>Manage your company's internships here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>A list of internships with options to create, edit, and delete will be displayed here.</p>
      </CardContent>
    </Card>
  );
}
