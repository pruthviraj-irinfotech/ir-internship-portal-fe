
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { users, User } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const MAX_AVATAR_SIZE = 100 * 1024; // 100KB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function AdminProfilePage() {
  const { isLoggedIn, isAdmin } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !isAdmin) {
      router.push('/login');
      return;
    }
    const admin = users.find(u => u.role === 'admin');
    if (admin) {
        setAdminUser(admin);
        setAvatarPreview(admin.avatarUrl);
    }
  }, [isLoggedIn, isAdmin, router]);

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

  const handleSaveChanges = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast({
        title: 'Profile Updated',
        description: 'Your changes have been saved successfully.',
    });
    // Here you would typically handle form submission, API calls etc.
    // For mock data, we can update the preview, but won't persist it.
  };
  
  if (!adminUser) {
    return (
        <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
        <form onSubmit={handleSaveChanges}>
            <CardHeader>
                <CardTitle>Admin Profile</CardTitle>
                <CardDescription>Update your personal information and password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
                <Avatar className="h-24 w-24">
                <AvatarImage src={avatarPreview} alt="Admin Avatar" data-ai-hint="user avatar" />
                <AvatarFallback>{adminUser.firstName?.[0] || 'A'}</AvatarFallback>
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
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue={adminUser.firstName} />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue={adminUser.lastName} />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={adminUser.email} disabled />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue={adminUser.phone} />
                    </div>
                </div>
            </div>

            <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-medium">Change Password</h3>
                <div className="space-y-2">
                    <Label>Current Password</Label>
                    <div className="relative">
                        <Input type={showCurrentPassword ? 'text' : 'password'} placeholder="Enter current password" />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">Toggle current password visibility</span>
                        </Button>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>New Password</Label>
                    <div className="relative">
                        <Input type={showNewPassword ? 'text' : 'password'} placeholder="Enter new password" />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowNewPassword(!showNewPassword)}>
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">Toggle new password visibility</span>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex justify-end pt-4">
                <Button type="submit">Save Changes</Button>
            </div>
            </CardContent>
      </form>
    </Card>
  );
}
