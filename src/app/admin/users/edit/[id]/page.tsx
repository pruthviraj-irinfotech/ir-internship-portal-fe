
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { users, User } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required."),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  countryCode: z.string().min(1, "Country code is required."),
  password: z.string().min(8, "Password must be at least 8 characters.").optional().or(z.literal('')),
  role: z.enum(['user', 'admin'], { required_error: "Please select a role." }),
  qualification: z.string().min(2, "Qualification is required."),
  status: z.enum(['student', 'graduate', 'professional'], { required_error: "Please select a status." }),
  orgName: z.string().min(2, "Organization name is required."),
  orgCity: z.string().min(2, "City is required."),
  orgState: z.string().min(2, "State is required."),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditUserPage() {
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const userId = params.id as string;
    
    const [user, setUser] = useState<User | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        const userToEdit = users.find(u => u.id === userId);
        if (userToEdit) {
            setUser(userToEdit);
            form.reset({
                ...userToEdit,
                password: '', // Don't pre-fill password
            });
        } else {
             toast({ title: "Error!", description: "User not found.", variant: 'destructive' });
            router.push('/admin/users');
        }
    }, [userId, form, router, toast]);

    if (!user) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    function onSubmit(values: FormValues) {
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
             toast({ title: "Error!", description: "Could not find user to update.", variant: 'destructive'});
             return;
        }

        const updatedUser = { ...users[userIndex], ...values };

        // Only update password if a new one is provided
        if (!values.password) {
            delete updatedUser.password;
        }

        users[userIndex] = updatedUser;
        
        toast({
            title: "Success!",
            description: "The user has been updated successfully.",
        });

        router.push('/admin/users');
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit User</CardTitle>
                <CardDescription>Update the details for {user.firstName} {user.lastName || ''}.</CardDescription>
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
                                <FormItem><FormLabel>New Password (Optional)</FormLabel><FormControl><Input type="password" placeholder="Leave blank to keep current password" {...field} /></FormControl><FormMessage /></FormItem>
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
                            <FormField control={form.control} name="status" render={({ field }) => (
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <FormField control={form.control} name="orgCity" render={({ field }) => (
                                <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="orgState" render={({ field }) => (
                                <FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
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
