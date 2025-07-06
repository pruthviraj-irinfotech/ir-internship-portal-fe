'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminProfilePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Profile</CardTitle>
        <CardDescription>Manage your admin profile details here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Admin profile management form will be here.</p>
      </CardContent>
    </Card>
  );
}
