
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const MAX_AVATAR_SIZE = 100 * 1024; // 100KB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface UserProfile {
    avatarUrl: string;
    name: string;
    email: string;
    phone: string;
    highestQualification: string;
    status: 'student' | 'graduate' | 'professional';
    organization: string;
    city: string;
    state: string;
    country: string;
}

export default function ProfilePage() {
  const { isLoggedIn, token } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login?redirect=/profile');
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
      const fetchProfile = async () => {
          if (!isLoggedIn || !token) return;
          setIsLoading(true);
          try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me/application-profile`, {
                  headers: { 'Authorization': `Bearer ${token}` }
              });
              if (!response.ok) throw new Error('Failed to fetch profile.');
              const data = await response.json();
              setProfile(data);
              setAvatarPreview(data.avatarUrl);
          } catch (error: any) {
              toast({ variant: 'destructive', title: 'Error', description: error.message });
          } finally {
              setIsLoading(false);
          }
      };
      fetchProfile();
  }, [isLoggedIn, token, toast]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast({ variant: 'destructive', title: 'Invalid file type', description: 'Please select a PNG, JPG, GIF, or WEBP file.' });
      return;
    }
    
    if (file.size > MAX_AVATAR_SIZE) {
      toast({ variant: 'destructive', title: 'Image too large', description: 'Please upload an image smaller than 100KB.' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
        toast({ title: 'Info', description: 'No password changes were made.'});
        return;
    }
     // Placeholder for API call
    console.log({ currentPassword, newPassword });
    toast({ title: 'Password Update', description: 'Password change functionality is not yet implemented.' });
  }

  if (isLoading) {
    return (
        <div className="container mx-auto p-4 md:p-8 flex-1 flex flex-col items-center">
             <header className="text-center my-8 md:my-16">
                <h1 className="text-3xl md:text-5xl font-headline text-primary">Your Profile</h1>
                <p className="text-muted-foreground mt-4 text-sm md:text-base">Manage your player stats.</p>
            </header>
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle><Skeleton className="h-6 w-32" /></CardTitle>
                    <CardDescription><Skeleton className="h-4 w-48" /></CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-24 w-24 rounded-full" />
                        <div className="space-y-2"><Skeleton className="h-10 w-32" /><Skeleton className="h-3 w-40" /></div>
                    </div>
                     <div className="border-t pt-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2"><Skeleton className="h-4 w-20 mb-2" /><Skeleton className="h-10 w-full" /></div>
                            <div className="space-y-2"><Skeleton className="h-4 w-20 mb-2" /><Skeleton className="h-10 w-full" /></div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }

  if (!profile) {
     return <div className="flex-1 flex items-center justify-center">Failed to load profile. Please try again.</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 flex-1 flex flex-col items-center">
      <header className="text-center my-8 md:my-16">
        <h1 className="text-3xl md:text-5xl font-headline text-primary">Your Profile</h1>
        <p className="text-muted-foreground mt-4 text-sm md:text-base">Manage your player stats.</p>
      </header>

      <form onSubmit={handleSaveChanges} className="w-full max-w-2xl">
        <Card>
            <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>Update your personal and organization information here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
                <Avatar className="h-24 w-24">
                <AvatarImage src={avatarPreview} alt={profile.name} data-ai-hint="user avatar" />
                <AvatarFallback>{profile.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>Change Avatar</Button>
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
                    <Input id="name" defaultValue={profile.name} disabled />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={profile.email} disabled />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue={profile.phone} disabled />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="qualification">Highest Qualification</Label>
                    <Input id="qualification" defaultValue={profile.highestQualification} disabled />
                    </div>
                </div>
            </div>

            <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-medium">Organization / Institute Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="org-name">Organization/Institute Name</Label>
                        <Input id="org-name" defaultValue={profile.organization} disabled />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="org-city">City</Label>
                        <Input id="org-city" defaultValue={profile.city} disabled />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="org-state">State</Label>
                        <Input id="org-state" defaultValue={profile.state} disabled />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="org-country">Country</Label>
                        <Input id="org-country" defaultValue={profile.country} disabled />
                    </div>
                </div>
            </div>
            
            <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-medium">Change Password</h3>
                <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                        <Input id="current-password" type={showCurrentPassword ? 'text' : 'password'} placeholder="Enter current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                        <Input id="new-password" type={showNewPassword ? 'text' : 'password'} placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowNewPassword(!showNewPassword)}>
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex justify-end pt-6 border-t">
                <Button type="submit">Save Changes</Button>
            </div>
            </CardContent>
        </Card>
      </form>
    </div>
  );
}
