
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const MAX_AVATAR_SIZE = 100 * 1024; // 100KB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const profileFormSchema = z.object({
  firstName: z.string().min(2, "First name is required."),
  lastName: z.string().optional(),
  phone: z.string().min(10, "Please enter a valid phone number.").optional().or(z.literal('')),
  avatar: z.any().optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_AVATAR_SIZE, `Max image size is 100KB.`)
    .refine((files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), "Only .jpg, .png, .gif and .webp formats are supported."),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface AdminProfile {
    avatarUrl: string;
    name: string;
    email: string;
    phone: string;
    firstName: string;
    lastName?: string;
}

export default function AdminProfilePage() {
  const { isLoggedIn, isAdmin, token } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
  });

  const fetchProfile = useCallback(async () => {
    if (!isLoggedIn || !isAdmin || !token) return;
    setIsLoading(true);
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch profile.');
        
        const data = await response.json();
        
        const fullAvatarUrl = data.avatarUrl && !data.avatarUrl.startsWith('http') 
            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${data.avatarUrl}`
            : data.avatarUrl;
        
        const profileData: AdminProfile = {
          ...data,
          avatarUrl: fullAvatarUrl,
        };

        setProfile(profileData);
        setAvatarPreview(fullAvatarUrl);

        form.reset({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone,
        });

    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
        setIsLoading(false);
    }
  }, [isLoggedIn, isAdmin, token, toast, form]);

  useEffect(() => {
    if (!isLoggedIn || !isAdmin) {
      router.push('/login');
    } else {
      fetchProfile();
    }
  }, [isLoggedIn, isAdmin, router, fetchProfile]);

  const onProfileSubmit: SubmitHandler<ProfileFormValues> = async (values) => {
    if (!token) return;
    setIsSubmittingProfile(true);
    const { avatar, ...jsonData } = values;

    const formData = new FormData();
    formData.append('data', JSON.stringify(jsonData));

    if (avatar && avatar.length > 0) {
        formData.append('avatar', avatar[0]);
    }
    
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me/profile`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update profile.');
        }

        toast({ title: 'Success', description: 'Your profile has been updated.' });
        await fetchProfile();

    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Update Failed', description: error.message });
    } finally {
        setIsSubmittingProfile(false);
    }
  };
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
        toast({ variant: 'destructive', title: 'Missing Fields', description: 'Please fill out both password fields.'});
        return;
    }
    if (!token) return;
    setIsSubmittingPassword(true);

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me/password`, {
            method: 'PATCH',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
             },
            body: JSON.stringify({ currentPassword, newPassword }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update password.');
        }

        toast({ title: 'Success', description: 'Your password has been changed.' });
        setCurrentPassword('');
        setNewPassword('');
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Update Failed', description: error.message });
    } finally {
        setIsSubmittingPassword(false);
    }
  };

  if (isLoading) {
    return (
        <div className="w-full max-w-2xl mx-auto">
            <Card>
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
     return (
        <div className="flex-1 flex items-center justify-center p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Error</CardTitle>
                    <CardDescription>Could not load profile data. Please try refreshing the page.</CardDescription>
                </CardHeader>
            </Card>
        </div>
     );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onProfileSubmit)}>
          <Card>
            <CardHeader>
                <CardTitle>Admin Profile</CardTitle>
                <CardDescription>Update your personal information and password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
            <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={avatarPreview || 'https://placehold.co/100x100.png'} alt={profile.name} data-ai-hint="user avatar" />
                          <AvatarFallback>{profile.name?.[0] || 'A'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <FormControl>
                            <Input
                              type="file"
                              className="hidden"
                              accept={ACCEPTED_IMAGE_TYPES.join(',')}
                              {...rest}
                              onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => setAvatarPreview(reader.result as string);
                                      reader.readAsDataURL(file);
                                  }
                                  onChange(e.target.files);
                              }}
                            />
                          </FormControl>
                          <Button type="button" variant="outline" onClick={() => (rest.ref as React.RefObject<HTMLInputElement>)?.current?.click()}>
                            Change Avatar
                          </Button>
                          <p className="text-xs text-muted-foreground mt-2">Max 100KB. JPG, PNG, GIF, WEBP.</p>
                          <FormMessage />
                        </div>
                      </div>
                  </FormItem>
                  )}
              />
            
            <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="firstName" render={({ field }) => (
                      <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="lastName" render={({ field }) => (
                      <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={profile.email} disabled />
                    </div>
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isSubmittingProfile}>
                {isSubmittingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

       <form onSubmit={handlePasswordChange}>
         <Card>
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                        <Input id="current-password" type={showCurrentPassword ? 'text' : 'password'} placeholder="Enter current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} disabled={isSubmittingPassword}/>
                        <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                        <Input id="new-password" type={showNewPassword ? 'text' : 'password'} placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={isSubmittingPassword} />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowNewPassword(!showNewPassword)}>
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </CardContent>
             <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isSubmittingPassword}>
                    {isSubmittingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Password
                </Button>
            </CardFooter>
         </Card>
       </form>
    </div>
  );
}
