
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { User, DetailedUser } from '@/lib/mock-data';
import * as api from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlusCircle, FilePenLine, Trash2, Search, Eye, Loader2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

export default function AdminUsersPage() {
  const [userList, setUserList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<DetailedUser | null>(null);
  const [isDialogLoading, setIsDialogLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const { token } = useAuth();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
        const data = await api.getUsers(token, searchTerm);
        setUserList(data);
    } catch (error: any) {
        toast({ title: 'Error fetching users', description: error.message, variant: 'destructive' });
    } finally {
        setIsLoading(false);
    }
  }, [token, searchTerm, toast]);

  useEffect(() => {
    const handler = setTimeout(() => {
        fetchUsers();
    }, 500); // Debounce search
    return () => clearTimeout(handler);
  }, [fetchUsers]);

  const handleDelete = async () => {
    if (!userToDelete || !token) return;
    
    try {
      await api.deleteUser(userToDelete.id, token);
      setUserList(prev => prev.filter(u => u.id !== userToDelete.id));
      toast({
        title: 'Success!',
        description: `User "${userToDelete.name}" has been deleted.`,
      });
    } catch (error: any) {
        toast({ title: 'Deletion Failed', description: error.message, variant: 'destructive' });
    } finally {
      setUserToDelete(null);
    }
  };

  const handleViewUser = async (userId: number) => {
    if (!token) return;
    setIsDialogLoading(true);
    setViewingUser(null);
    try {
        const data = await api.getUserById(userId, token);
        setViewingUser(data);
    } catch (error: any) {
        toast({ title: 'Error', description: `Failed to fetch user details: ${error.message}`, variant: 'destructive' });
    } finally {
        setIsDialogLoading(false);
    }
  }

  const getFullAvatarUrl = (relativeUrl: string | null | undefined) => {
      if (!relativeUrl) return 'https://placehold.co/100x100.png';
      if (relativeUrl.startsWith('http')) return relativeUrl;
      return `${baseUrl}${relativeUrl}`;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Manage your platform's users here.</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button asChild className="w-full sm:w-auto">
                <Link href="/admin/users/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add User
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                    <TableRow><TableCell colSpan={5} className="text-center h-24"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                ) : userList.length > 0 ? (
                  userList.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={getFullAvatarUrl(user.avatarUrl)} alt={user.name} data-ai-hint="user avatar" />
                            <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p>{user.name}</p>
                            <p className="text-xs text-muted-foreground">ID: {user.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleViewUser(user.id)} title="View Details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" asChild title="Edit User">
                            <Link href={`/admin/users/edit/${user.id}`}>
                              <FilePenLine className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => setUserToDelete(user)}
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {userToDelete && (
        <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the user account for "{userToDelete.name}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <Dialog open={!!viewingUser || isDialogLoading} onOpenChange={() => setViewingUser(null)}>
          <DialogContent className="sm:max-w-2xl">
              {isDialogLoading ? (
                  <div className="flex items-center justify-center p-12">
                      <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
              ) : !viewingUser ? (
                  <div className="p-12 text-center">Could not load user details.</div>
              ) : (
                  <>
                      <DialogHeader>
                          <DialogTitle>User Details</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-6">
                          <div className="flex items-start gap-4">
                              <Avatar className="h-24 w-24">
                                  <AvatarImage src={getFullAvatarUrl(viewingUser.profile.avatarUrl)} alt="User Avatar" data-ai-hint="user avatar" />
                                  <AvatarFallback>{viewingUser.profile.firstName?.[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                  <h3 className="text-xl font-semibold">{viewingUser.profile.firstName} {viewingUser.profile.lastName}</h3>
                                  <p className="text-muted-foreground">{viewingUser.email}</p>
                                  <p className="text-muted-foreground">{viewingUser.profile.countryCode} {viewingUser.profile.phone}</p>
                                  <Badge variant={viewingUser.role === 'admin' ? 'default' : 'secondary'} className="mt-2">{viewingUser.role}</Badge>
                              </div>
                          </div>
                          {viewingUser.education && viewingUser.education.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 border-t pt-4">
                                <div><Label>Qualification</Label><p className="text-sm text-muted-foreground">{viewingUser.education[0].qualification}</p></div>
                                <div><Label>Status</Label><p className="text-sm text-muted-foreground capitalize">{viewingUser.education[0].currentStatus}</p></div>
                                <div><Label>Organization</Label><p className="text-sm text-muted-foreground">{viewingUser.education[0].orgName}</p></div>
                                <div><Label>Location</Label><p className="text-sm text-muted-foreground">{viewingUser.education[0].orgCity}, {viewingUser.education[0].orgState}, {viewingUser.education[0].orgCountry}</p></div>
                            </div>
                          )}
                      </div>
                  </>
              )}
          </DialogContent>
      </Dialog>
    </>
  );
}
