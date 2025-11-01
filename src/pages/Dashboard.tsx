import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Activity, AlertTriangle, Users, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Scan {
  id: string;
  disease_name: string;
  confidence: number;
  created_at: string;
  status: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [allScans, setAllScans] = useState<Scan[]>([]);
  const [stats, setStats] = useState({
    totalScans: 0,
    highRiskCases: 0,
    patientsScanned: 0,
  });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user) {
      checkUserRole();
    }
  }, [user]);

  const checkUserRole = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user!.id)
        .single();

      if (data) {
        setUserRole(data.role);
        if (data.role === 'doctor') {
          loadDashboardData();
        } else {
          setLoadingData(false);
        }
      }
    } catch (error) {
      console.error('Error checking role:', error);
      setLoadingData(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      // Get all scans with patient info
      const { data: scansData, error } = await supabase
        .from('scans')
        .select(`
          id,
          disease_name,
          confidence,
          created_at,
          status,
          user_id,
          profiles!scans_user_id_fkey (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const scans = scansData || [];
      setAllScans(scans as any);

      // Calculate stats
      const highRisk = scans.filter(scan => scan.confidence > 70).length;
      const uniquePatients = new Set(scans.map(scan => scan.user_id)).size;

      setStats({
        totalScans: scans.length,
        highRiskCases: highRisk,
        patientsScanned: uniquePatients,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (userRole !== 'doctor') {
    return <Navigate to="/" replace />;
  }

  const statCards = [
    { title: 'Total Scans', value: stats.totalScans, icon: FileText, color: 'from-primary to-accent' },
    { title: 'High-Risk Cases', value: stats.highRiskCases, icon: AlertTriangle, color: 'from-destructive to-orange-500' },
    { title: 'Patients Scanned', value: stats.patientsScanned, icon: Users, color: 'from-secondary to-emerald-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 pb-20 md:pt-20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Doctor Dashboard
          </h1>
          <p className="text-muted-foreground">
            Overview of patient scans and high-risk cases
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="shadow-card hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Patient Scans
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allScans.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No scans available</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allScans.slice(0, 10).map((scan) => (
                      <TableRow key={scan.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{scan.profiles?.full_name || 'Unknown'}</p>
                            <p className="text-xs text-muted-foreground">{scan.profiles?.email || ''}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{scan.disease_name}</TableCell>
                        <TableCell>
                          <Badge variant={scan.confidence > 70 ? 'destructive' : 'default'}>
                            {scan.confidence}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(scan.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Badge variant={scan.confidence > 70 ? 'destructive' : 'outline'}>
                            {scan.confidence > 70 ? 'High Risk' : 'Normal'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}