'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminInternshipsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Internships</CardTitle>
        <CardDescription>Manage your company's internship listings here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>A list of all internships with options to edit and delete will be displayed here.</p>
      </CardContent>
    </Card>
  );
}
