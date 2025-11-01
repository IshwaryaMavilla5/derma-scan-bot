import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, AlertTriangle, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Scan {
  id: string;
  image_url: string;
  disease_name: string;
  confidence: number;
  recommendation: string;
  created_at: string;
  status: string;
}

export default function History() {
  const { user, loading } = useAuth();
  const [scans, setScans] = useState<Scan[]>([]);
  const [filteredScans, setFilteredScans] = useState<Scan[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loadingScans, setLoadingScans] = useState(true);

  useEffect(() => {
    if (user) {
      loadScans();
    }
  }, [user]);

  useEffect(() => {
    applyFilter();
  }, [filter, scans]);

  const loadScans = async () => {
    try {
      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScans(data || []);
    } catch (error) {
      console.error('Error loading scans:', error);
    } finally {
      setLoadingScans(false);
    }
  };

  const applyFilter = () => {
    if (filter === 'all') {
      setFilteredScans(scans);
    } else if (filter === 'high-risk') {
      setFilteredScans(scans.filter(scan => scan.confidence > 70));
    } else {
      setFilteredScans(scans.filter(scan => scan.confidence <= 70));
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
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Scan History
          </h1>
          <p className="text-muted-foreground">
            View and track your previous skin analyses
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter scans" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scans</SelectItem>
                <SelectItem value="high-risk">High Confidence</SelectItem>
                <SelectItem value="low-risk">Low Confidence</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span>{filteredScans.length} scans</span>
          </div>
        </div>

        {loadingScans ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredScans.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No scans found</p>
            <Button asChild>
              <a href="/upload">Upload Your First Scan</a>
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScans.map((scan) => (
              <Card
                key={scan.id}
                className="overflow-hidden hover:shadow-card transition-shadow cursor-pointer group"
              >
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <img
                    src={scan.image_url}
                    alt={scan.disease_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {scan.confidence > 70 && (
                    <div className="absolute top-2 right-2 bg-destructive/90 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs">
                      <AlertTriangle className="w-3 h-3" />
                      High
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{scan.disease_name}</h3>
                    <Badge variant={scan.confidence > 70 ? 'destructive' : 'default'}>
                      {scan.confidence}% Confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {scan.recommendation}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(scan.created_at), 'MMM dd, yyyy')}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}