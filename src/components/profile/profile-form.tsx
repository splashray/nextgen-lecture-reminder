
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/auth-context';
import { User } from '@/types/auth';
import { toast } from '@/components/ui/use-toast';

interface ProfileFormProps {
  isStudent?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ isStudent = false }) => {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    level: user?.level || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        department: user.department || '',
        level: user.level || '',
        bio: user.bio || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(formData as Partial<User>);
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profile & Settings</h2>
        <p className="text-muted-foreground">
          View and update your personal information
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.profileImage} alt={user?.name} />
                <AvatarFallback>{user?.name ? getInitials(user.name) : 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user?.name}</CardTitle>
                <CardDescription>{isStudent ? 'Student ID:' : 'Staff ID:'} {user?.id}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              {isStudent ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <Input
                      id="level"
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Tell us about yourself"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button type="submit">Save Changes</Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};
