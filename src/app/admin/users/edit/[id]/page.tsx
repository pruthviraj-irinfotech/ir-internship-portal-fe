
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { DetailedUser } from '@/lib/mock-data';
import * as api from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required."),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  countryCode: z.string().min(1, "Country code is required."),
  password: z.string().min(8, "Password must be at least 8 characters.").optional().or(z.literal('')),
  role: z.enum(['user', 'admin'], { required_error: "Please select a role." }),
  qualification: z.string().min(2, "Qualification is required."),
  currentStatus: z.enum(['student', 'graduate', 'professional'], { required_error: "Please select a status." }),
  orgName: z.string().min(2, "Organization name is required."),
  orgCity: z.string().min(2, "City is required."),
  orgState: z.string().min(2, "State is required."),
  orgCountry: z.string().min(2, "Country is required."),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditUserPage() {
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const { token } = useAuth();
    const userId = parseInt(params.id as string, 10);
    
    const [user, setUser] = useState<DetailedUser | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const fetchUser = useCallback(async () => {
        if (!token || isNaN(userId)) return;

        try {
            const data = await api.getUserById(userId, token);
            setUser(data);
            form.reset({
                firstName: data.profile.firstName,
                lastName: data.profile.lastName || '',
                email: data.email,
                phone: data.profile.phone,
                countryCode: data.profile.countryCode,
                password: '', // Don't pre-fill password
                role: data.role,
                qualification: data.education?.[0]?.qualification || '',
                currentStatus: data.education?.[0]?.currentStatus || 'student',
                orgName: data.education?.[0]?.orgName || '',
                orgCity: data.education?.[0]?.orgCity || '',
                orgState: data.education?.[0]?.orgState || '',
                orgCountry: data.education?.[0]?.orgCountry || '',
            });
        } catch (error) {
             toast({ title: "Error!", description: "User not found.", variant: 'destructive' });
            router.push('/admin/users');
        }
    }, [userId, form, router, toast, token]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    if (!user) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    async function onSubmit(values: FormValues) {
        if (!token) return;

        const updatePayload: Partial<FormValues> = {};
        
        // Compare with fetched data to only send changed values
        if(values.firstName !== user?.profile.firstName) updatePayload.firstName = values.firstName;
        if(values.lastName !== user?.profile.lastName) updatePayload.lastName = values.lastName;
        if(values.email !== user?.email) updatePayload.email = values.email;
        if(values.phone !== user?.profile.phone) updatePayload.phone = values.phone;
        if(values.countryCode !== user?.profile.countryCode) updatePayload.countryCode = values.countryCode;
        if(values.role !== user?.role) updatePayload.role = values.role;
        if(values.qualification !== user?.education?.[0]?.qualification) updatePayload.qualification = values.qualification;
        if(values.currentStatus !== user?.education?.[0]?.currentStatus) updatePayload.currentStatus = values.currentStatus;
        if(values.orgName !== user?.education?.[0]?.orgName) updatePayload.orgName = values.orgName;
        if(values.orgCity !== user?.education?.[0]?.orgCity) updatePayload.orgCity = values.orgCity;
        if(values.orgState !== user?.education?.[0]?.orgState) updatePayload.orgState = values.orgState;
        if(values.orgCountry !== user?.education?.[0]?.orgCountry) updatePayload.orgCountry = values.orgCountry;
        
        if (values.password) {
            updatePayload.password = values.password;
        }

        if (Object.keys(updatePayload).length === 0) {
            toast({ title: "No changes", description: "No information was modified."});
            return;
        }

        try {
            await api.updateUser(userId, updatePayload, token);
            toast({
                title: "Success!",
                description: "The user has been updated successfully.",
            });
            router.push('/admin/users');
        } catch(error: any) {
             toast({ title: "Error!", description: error.message, variant: 'destructive'});
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit User</CardTitle>
                <CardDescription>Update the details for {user.profile.firstName} {user.profile.lastName || ''}.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="firstName" render={({ field }) => (
                                <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="lastName" render={({ field }) => (
                                <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="password" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password (Optional)</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input type={showPassword ? 'text' : 'password'} placeholder="Leave blank to keep current password" {...field} />
                                            <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                <span className="sr-only">Toggle password visibility</span>
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <FormField control={form.control} name="countryCode" render={({ field }) => (
                                <FormItem><FormLabel>Country Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem className="md:col-span-2"><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="role" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="user">User</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="qualification" render={({ field }) => (
                                <FormItem><FormLabel>Highest Qualification</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="currentStatus" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="student">Student</SelectItem>
                                            <SelectItem value="graduate">Graduate</SelectItem>
                                            <SelectItem value="professional">Working Professional</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="orgName" render={({ field }) => (
                                <FormItem><FormLabel>Organization/Institute</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <FormField control={form.control} name="orgCity" render={({ field }) => (
                                <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="orgState" render={({ field }) => (
                                <FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="orgCountry" render={({ field }) => (
                                <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
