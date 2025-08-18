
'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as api from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required."),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  countryCode: z.string().min(1, "Country code is required."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(['user', 'admin'], { required_error: "Please select a role." }),
  qualification: z.string().min(2, "Qualification is required."),
  currentStatus: z.enum(['student', 'graduate', 'professional'], { required_error: "Please select a status." }),
  orgName: z.string().min(2, "Organization name is required."),
  orgCity: z.string().min(2, "City is required."),
  orgState: z.string().min(2, "State is required."),
  orgCountry: z.string().min(2, "Country is required."),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddNewUserPage() {
    const { toast } = useToast();
    const router = useRouter();
    const { token } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            countryCode: '+91',
            password: '',
            role: 'user',
            qualification: '',
            currentStatus: 'student',
            orgName: '',
            orgCity: '',
            orgState: '',
            orgCountry: '',
        },
    });

    async function onSubmit(values: FormValues) {
        if (!token) {
            toast({ title: 'Error', description: 'Authentication token not found.', variant: 'destructive' });
            return;
        }
        try {
            await api.createUser(values, token);
            toast({
                title: "User Created!",
                description: `The account for ${values.firstName} has been created.`,
            });
            router.push('/admin/users');
        } catch (error: any) {
             toast({
                title: "Failed to create user",
                description: error.message,
                variant: 'destructive',
            });
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New User</CardTitle>
                <CardDescription>Fill out the form to create a new user account.</CardDescription>
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
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input type={showPassword ? 'text' : 'password'} {...field} />
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
                                Create User
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
