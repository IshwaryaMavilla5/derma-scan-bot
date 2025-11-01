import { useLocation, Navigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, MessageSquare, ArrowLeft, Save } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ResultState {
  result: {
    diseaseName: string;
    confidence: number;
    recommendation: string;
    imageUrl: string;
  };
}

export default function Results() {
  const location = useLocation();
  const state = location.state as ResultState;
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'bot'; message: string }>>([
    { role: 'bot', message: "Hi! I'm DermaBot 👋 I can explain your results and answer questions about skin health." }
  ]);
  const [userInput, setUserInput] = useState('');

  if (!state?.result) {
    return <Navigate to="/upload" replace />;
  }

  const { diseaseName, confidence, recommendation, imageUrl } = state.result;
  const isHighRisk = confidence > 70;

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    setChatMessages([...chatMessages, { role: 'user', message: userInput }]);
    
    // Simple mock responses
    setTimeout(() => {
      const responses = [
        `Based on your diagnosis of ${diseaseName}, it's important to follow the recommendations provided. Would you like more details?`,
        'Skin conditions can vary widely. The confidence score indicates how certain the AI is about this diagnosis.',
        'Remember, this is an AI analysis. Always consult with a dermatologist for professional medical advice.',
        'I recommend keeping track of any changes and consulting a healthcare provider if symptoms persist or worsen.',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatMessages(prev => [...prev, { role: 'bot', message: randomResponse }]);
    }, 1000);

    setUserInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 pb-20 md:pt-20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/upload">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Upload
          </Button>
        </Link>

        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Analysis Results
          </h1>
          <p className="text-muted-foreground">
            AI-powered skin condition analysis
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="p-6 shadow-card">
            <img
              src={imageUrl}
              alt="Analyzed skin"
              className="w-full h-auto rounded-xl mb-4"
            />
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>📸 Image captured and analyzed</p>
              <p>🤖 Processed by Autoderm AI v2.2</p>
            </div>
          </Card>

          <Card className="p-6 shadow-card space-y-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Detected Condition</h3>
              <p className="text-2xl font-bold text-foreground mb-3">{diseaseName}</p>
              <Badge
                variant={isHighRisk ? 'destructive' : 'default'}
                className="text-sm px-3 py-1"
              >
                {confidence}% Confidence
              </Badge>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                {isHighRisk ? <AlertCircle className="w-4 h-4 text-destructive" /> : <CheckCircle className="w-4 h-4 text-secondary" />}
                AI Recommendation
              </h3>
              <p className="text-foreground leading-relaxed">{recommendation}</p>
            </div>

            <div className="border-t pt-4">
              <Button
                variant="outline"
                className="w-full"
                asChild
              >
                <Link to="/history">
                  <Save className="mr-2 h-4 w-4" />
                  View in History
                </Link>
              </Button>
            </div>
          </Card>
        </div>

        {/* DermaBot Chat */}
        <Card className="p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold">DermaBot - Ask Me Anything</h2>
          </div>

          <ScrollArea className="h-64 mb-4 rounded-lg border p-4 bg-muted/30">
            <div className="space-y-4">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-primary to-accent text-white'
                        : 'bg-card border'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex gap-2">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about your results..."
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            >
              Send
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-3 text-center">
            DermaBot provides general information only. Always consult a healthcare professional.
          </p>
        </Card>
      </div>
    </div>
  );
}