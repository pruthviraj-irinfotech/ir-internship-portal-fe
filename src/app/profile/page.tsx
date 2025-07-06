'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const MAX_AVATAR_SIZE = 100 * 1024; // 100KB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function ProfilePage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState("https://placehold.co/100x100.png");

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login?redirect=/profile');
    }
  }, [isLoggedIn, router]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast({
        variant: 'destructive',
        title: 'Invalid file type',
        description: 'Please select a PNG, JPG, GIF, or WEBP file.',
      });
      return;
    }
    
    if (file.size > MAX_AVATAR_SIZE) {
      toast({
        variant: 'destructive',
        title: 'Image too large',
        description: 'Please upload an image smaller than 100KB.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  if (!isLoggedIn) {
    return null; // or a loading spinner
  }

  return (
    <div className="container mx-auto p-4 md:p-8 flex-1 flex flex-col items-center">
      <header className="text-center my-8 md:my-16">
        <h1 className="text-3xl md:text-5xl font-headline text-primary">Your Profile</h1>
        <p className="text-muted-foreground mt-4 text-sm md:text-base">Manage your player stats.</p>
      </header>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Update your personal and organization information here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarPreview} alt="Player Avatar" data-ai-hint="user avatar" />
              <AvatarFallback>P1</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>Change Avatar</Button>
              <Input 
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                className="hidden"
                accept={ACCEPTED_IMAGE_TYPES.join(',')}
              />
              <p className="text-xs text-muted-foreground mt-2">Max 100KB. JPG, PNG, GIF, WEBP.</p>
            </div>
          </div>
          
          <div className="border-t pt-6 space-y-4">
             <h3 className="text-lg font-medium">Personal Information</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="Player One" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="player1@email.com" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="+91">
                      <SelectTrigger className="w-[110px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+91">+91 (IN)</SelectItem>
                        <SelectItem value="+1">+1 (US)</SelectItem>
                        <SelectItem value="+44">+44 (UK)</SelectItem>
                        <SelectItem value="+61">+61 (AU)</SelectItem>
                        <SelectItem value="+971">+971 (AE)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input id="phone-number" placeholder="123-456-7890" defaultValue="1234567890" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qualification">Highest Qualification</Label>
                  <Input id="qualification" defaultValue="B.Tech in Computer Science" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue="student">
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                      <SelectItem value="professional">Working Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h3 className="text-lg font-medium">Organization / Institute Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="org-name">Organization/Institute Name</Label>
                    <Input id="org-name" placeholder="e.g., University of Example" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="org-city">City</Label>
                    <Input id="org-city" placeholder="e.g., Exampleville" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="org-state">State</Label>
                    <Input id="org-state" placeholder="e.g., Examplestate" />
                </div>
            </div>
          </div>
          
          <div className="border-t pt-6 space-y-4">
            <h3 className="text-lg font-medium">Change Password</h3>
             <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" placeholder="Enter current password" />
              </div>
               <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" placeholder="Enter new password" />
              </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
