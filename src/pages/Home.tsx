import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Activity, FileText, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';

export default function Home() {
  const { user, loading } = useAuth();

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

  const features = [
    {
      icon: Upload,
      title: 'Upload Image',
      description: 'Capture or upload a clear photo of your skin concern',
      step: '1',
    },
    {
      icon: Activity,
      title: 'AI Analysis',
      description: 'Our AI analyzes the image using advanced dermatology models',
      step: '2',
    },
    {
      icon: FileText,
      title: 'Get Report',
      description: 'Receive detailed insights and recommendations instantly',
      step: '3',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 pb-20 md:pt-20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-soft mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent leading-tight">
            AI-Powered Skin Health Companion
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Get instant AI-powered analysis of skin conditions with confidence scores and personalized recommendations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/upload">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-lg px-8 py-6 rounded-2xl shadow-soft"
              >
                <Upload className="mr-2 h-5 w-5" />
                Start Analysis
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 rounded-2xl border-2 hover:bg-accent/10 transition-colors"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* How It Works */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="p-6 hover:shadow-card transition-shadow border-2 hover:border-primary/20 relative overflow-hidden group"
                >
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                  <div className="relative">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent text-white font-bold text-xl shadow-soft">
                        {feature.step}
                      </div>
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Trust Section */}
        <Card className="mt-16 p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/10">
          <div className="text-center space-y-4">
            <Shield className="w-12 h-12 text-primary mx-auto" />
            <h3 className="text-2xl font-bold">Secure & Confidential</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your health data is encrypted and protected. We never share your information with third parties. 
              DermaSight is designed to complement professional medical advice, not replace it.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}