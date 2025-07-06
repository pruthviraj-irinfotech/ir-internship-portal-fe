'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminOngoingInternsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ongoing Interns</CardTitle>
        <CardDescription>View and manage interns currently in your programs.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>A list of all interns with an "Ongoing" status will be displayed here.</p>
      </CardContent>
    </Card>
  );
}
