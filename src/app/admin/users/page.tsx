
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { users, User } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlusCircle, FilePenLine, Trash2, Search, Eye } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

export default function AdminUsersPage() {
  const [userList, setUserList] = useState<User[]>(users);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleDelete = (userId: number) => {
    const index = users.findIndex(u => u.id === userId);
    if (index > -1) {
      users.splice(index, 1);
    }
    setUserList(users.slice());
    setUserToDelete(null);
    toast({
      title: 'Success!',
      description: 'The user has been deleted.',
    });
  };

  const filteredUsers = useMemo(() => {
    let results = [...userList];
    if (searchTerm) {
      results = results.filter(user =>
        `${user.firstName} ${user.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return results;
  }, [userList, searchTerm]);

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
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} data-ai-hint="user avatar" />
                            <AvatarFallback>{user.firstName?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p>{`${user.firstName} ${user.lastName || ''}`}</p>
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
                          <Button variant="outline" size="icon" onClick={() => setViewingUser(user)} title="View Details">
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
                This will permanently delete the user account for "{userToDelete.firstName} {userToDelete.lastName || ''}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDelete(userToDelete.id)}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {viewingUser && (
        <Dialog open={!!viewingUser} onOpenChange={() => setViewingUser(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={viewingUser.avatarUrl} alt="User Avatar" data-ai-hint="user avatar" />
                  <AvatarFallback>{viewingUser.firstName?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{viewingUser.firstName} {viewingUser.lastName}</h3>
                  <p className="text-muted-foreground">{viewingUser.email}</p>
                  <p className="text-muted-foreground">{viewingUser.countryCode} {viewingUser.phone}</p>
                  <Badge variant={viewingUser.role === 'admin' ? 'default' : 'secondary'} className="mt-2">{viewingUser.role}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 border-t pt-4">
                <div><Label>Qualification</Label><p className="text-sm text-muted-foreground">{viewingUser.qualification}</p></div>
                <div><Label>Status</Label><p className="text-sm text-muted-foreground capitalize">{viewingUser.status}</p></div>
                <div><Label>Organization</Label><p className="text-sm text-muted-foreground">{viewingUser.orgName}</p></div>
                <div><Label>Location</Label><p className="text-sm text-muted-foreground">{viewingUser.orgCity}, {viewingUser.orgState}, {viewingUser.orgCountry}</p></div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
