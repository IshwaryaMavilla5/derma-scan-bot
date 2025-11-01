import { Card } from '@/components/ui/card';
import { Shield, Brain, Lock, AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

export default function About() {
  const features = [
    {
      icon: Brain,
      title: 'Advanced AI Technology',
      description: 'Powered by Autoderm AI v2.2, trained on thousands of dermatological images to provide accurate analysis.',
    },
    {
      icon: Shield,
      title: 'Medical-Grade Accuracy',
      description: 'Our AI provides confidence scores and detailed recommendations to help you understand your skin health.',
    },
    {
      icon: Lock,
      title: 'Privacy Protected',
      description: 'Your images and health data are encrypted and never shared with third parties. Complete confidentiality guaranteed.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 pb-20 md:pt-20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-soft mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            About DermaSight
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your trusted AI companion for skin health analysis and monitoring
          </p>
        </div>

        <Card className="p-8 mb-8 shadow-card">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            DermaSight is designed to make preliminary skin health assessment accessible to everyone. 
            Using state-of-the-art artificial intelligence, we analyze skin conditions and provide 
            instant feedback to help you make informed decisions about your skin health.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Our platform combines the power of advanced machine learning with an intuitive interface, 
            making it easy for anyone to understand their skin condition and take appropriate action.
          </p>
        </Card>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="p-6 hover:shadow-card transition-shadow"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>

        <Card className="p-8 mb-8 shadow-card">
          <h2 className="text-2xl font-bold mb-4">Technology Stack</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>🤖 <strong>AI Model:</strong> Autoderm AI v2.2 - Advanced dermatology recognition</p>
            <p>⚛️ <strong>Frontend:</strong> React with TypeScript for a responsive, type-safe experience</p>
            <p>🎨 <strong>UI/UX:</strong> Tailwind CSS with custom medical-grade design system</p>
            <p>🔐 <strong>Backend:</strong> Lovable Cloud with secure authentication and data storage</p>
            <p>💬 <strong>Chat:</strong> DermaBot for interactive result explanations</p>
          </div>
        </Card>

        <Card className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100">Medical Disclaimer</h3>
              <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                DermaSight is an AI-powered screening tool designed to provide preliminary information about 
                potential skin conditions. It is <strong>not a substitute for professional medical advice, 
                diagnosis, or treatment</strong>. Always consult a qualified healthcare provider or dermatologist 
                for accurate diagnosis and treatment recommendations.
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                If you notice any concerning changes in your skin, persistent symptoms, or high-risk indicators, 
                please seek immediate medical attention from a licensed healthcare professional.
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Built for hackathons and educational purposes</p>
          <p className="mt-2">© 2025 DermaSight. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}