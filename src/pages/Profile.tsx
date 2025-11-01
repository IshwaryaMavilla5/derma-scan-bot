import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Shield, Calendar, LogOut, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Profile {
  full_name: string;
  email: string;
  role: string;
  created_at: string;
  avatar_url?: string;
}

export default function Profile() {
  const { user, signOut, loading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scanCount, setScanCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadScanCount();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile(data);
        setFullName(data.full_name);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadScanCount = async () => {
    try {
      const { data, error } = await supabase
        .from('scans')
        .select('id', { count: 'exact' })
        .eq('user_id', user!.id);

      if (error) throw error;
      setScanCount(data?.length || 0);
    } catch (error) {
      console.error('Error loading scan count:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user!.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
      setEditing(false);
      loadProfile();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 pb-20 md:pt-20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your account settings and information
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle>{profile?.full_name || 'User'}</CardTitle>
                  <Badge variant="outline" className="mt-1">
                    {profile?.role === 'doctor' ? 'Doctor' : 'Patient'}
                  </Badge>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(!editing)}
              >
                {editing ? 'Cancel' : 'Edit'}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {editing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{profile?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Shield className="w-4 h-4" />
                    <span className="capitalize">{profile?.role}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Member since{' '}
                      {profile?.created_at && format(new Date(profile.created_at), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Activity Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
                  <p className="text-2xl font-bold">{scanCount}</p>
                  <p className="text-sm text-muted-foreground">Total Scans</p>
                </div>
                {profile?.role === 'patient' && scanCount > 0 && (
                  <div className="p-4 rounded-lg bg-gradient-to-br from-secondary/10 to-emerald-500/10">
                    <p className="text-2xl font-bold">
                      {format(new Date(profile.created_at), 'MMM yyyy')}
                    </p>
                    <p className="text-sm text-muted-foreground">Last Scan</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Button
            variant="destructive"
            onClick={signOut}
            className="w-full"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}