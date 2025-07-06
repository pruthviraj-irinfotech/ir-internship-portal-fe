'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ApplicationsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Internship Applications</CardTitle>
        <CardDescription>Review and manage all incoming applications.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>A list of applications will be displayed here, with filtering and search options.</p>
      </CardContent>
    </Card>
  );
}
