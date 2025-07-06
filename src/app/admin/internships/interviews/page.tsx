'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function InterviewsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheduled Interviews</CardTitle>
        <CardDescription>Manage and view all scheduled interviews.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>A list of scheduled interviews will be displayed here.</p>
      </CardContent>
    </Card>
  );
}
