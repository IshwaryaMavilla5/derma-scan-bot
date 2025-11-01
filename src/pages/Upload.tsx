import { useState, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, Upload as UploadIcon, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';

export default function Upload() {
  const { user, loading } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size must be less than 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) {
      toast.error('Please select an image first');
      return;
    }

    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-skin', {
        body: { imageBase64: image },
      });

      if (error) throw error;

      if (data && data.predictions && data.predictions.length > 0) {
        const topPrediction = data.predictions[0];
        
        // Save to database
        await supabase.from('scans').insert({
          user_id: user.id,
          image_url: image,
          disease_name: topPrediction.name || 'Unknown',
          confidence: Math.round((topPrediction.confidence || 0) * 100),
          recommendation: topPrediction.recommendation || 'Please consult a dermatologist for proper diagnosis.',
        });

        // Navigate to results
        navigate('/results', { 
          state: { 
            result: {
              diseaseName: topPrediction.name || 'Unknown',
              confidence: Math.round((topPrediction.confidence || 0) * 100),
              recommendation: topPrediction.recommendation || 'Please consult a dermatologist for proper diagnosis.',
              imageUrl: image,
            }
          } 
        });
      } else {
        toast.error('No predictions received from AI');
      }
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast.error(error.message || 'Failed to analyze image');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 pb-20 md:pt-20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Upload Skin Image
          </h1>
          <p className="text-muted-foreground">
            Take or upload a clear photo of your skin concern for AI analysis
          </p>
        </div>

        <Card className="p-6 md:p-8 shadow-card">
          {!image ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/10 to-accent/10 mb-4">
                  <UploadIcon className="w-10 h-10 text-primary" />
                </div>
                <p className="text-lg font-medium mb-2">Upload an image</p>
                <p className="text-sm text-muted-foreground mb-4">
                  PNG, JPG up to 10MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                  >
                    <UploadIcon className="mr-2 h-4 w-4" />
                    Choose File
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      fileInputRef.current?.click();
                    }}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Take Photo
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={image}
                  alt="Selected skin"
                  className="w-full h-auto max-h-96 object-contain rounded-2xl"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-4 right-4 rounded-full"
                  onClick={() => setImage(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity py-6 text-lg rounded-2xl"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Image'
                )}
              </Button>
            </div>
          )}
        </Card>

        <Card className="mt-6 p-4 bg-accent/5 border border-accent/20">
          <p className="text-sm text-muted-foreground text-center">
            💡 <strong>Tip:</strong> For best results, ensure good lighting and capture the affected area clearly
          </p>
        </Card>
      </div>
    </div>
  );
}