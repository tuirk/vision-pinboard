import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Shield, Zap } from "lucide-react";
import welcomeImage from "@/assets/welcome-image.jpg";

interface AuthProps {
  onStart: () => void;
}

export const Auth = ({ onStart }: AuthProps) => {

  return (
    <div className="min-h-screen flex">
      {/* Left side - Info & CTA (1/3) */}
      <div className="w-1/3 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">Vision Board</CardTitle>
            <CardDescription className="text-muted-foreground">
              Create and organize your ideas visually
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium text-foreground">Privacy First</h3>
                  <p className="text-sm text-muted-foreground">We don't store anything on our servers. Your data stays in your browser.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium text-foreground">No Account Needed</h3>
                  <p className="text-sm text-muted-foreground">Start creating immediately. No sign-ups, no passwords, no hassle.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-foreground">Browser Cached</h3>
                  <p className="text-sm text-muted-foreground">Your work is saved locally. Clear your browser data and it's gone - so export regularly!</p>
                </div>
              </div>
            </div>
            
            <Button onClick={onStart} className="w-full" size="lg">
              Start Free
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Welcome Image (2/3) */}
      <div className="w-2/3 relative">
        <img
          src={welcomeImage}
          alt="Vision Board Welcome"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/20 to-transparent" />
        <div className="absolute bottom-8 left-8 text-primary-foreground">
          <h2 className="text-4xl font-bold mb-2">Organize Your Ideas</h2>
          <p className="text-xl opacity-90">Create visual boards to bring your thoughts to life</p>
        </div>
      </div>
    </div>
  );
};