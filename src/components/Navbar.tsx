import { Link, useLocation } from 'react-router-dom';
import { Home, Upload, History, Info, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) setUserRole(data.role);
        });
    }
  }, [user]);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/upload', icon: Upload, label: 'Upload' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/about', icon: Info, label: 'About' },
  ];

  if (userRole === 'doctor') {
    navItems.splice(3, 0, { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 md:top-0 md:bottom-auto">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent">
              <span className="text-white font-bold text-lg">DS</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              DermaSight
            </span>
          </div>

          <div className="flex items-center justify-around w-full md:justify-center md:space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex flex-col md:flex-row items-center gap-1 h-auto py-2 px-4 transition-all ${
                      active
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs md:text-sm">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="w-5 h-5" />
              </Button>
            </Link>
            {user && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={signOut}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};