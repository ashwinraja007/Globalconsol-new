
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn } = useAuth();

  useEffect(() => {
    // --- APPLY ROYAL BLUE & GOLDEN YELLOW THEME ---
    document.documentElement.style.setProperty('--brand-primary', '21, 101, 192'); // #1565C0
    document.documentElement.style.setProperty('--brand-primary-dark', '13, 71, 161'); // #0D47A1
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(email, password);
      toast({
        title: "Login successful",
        description: "Welcome to the Admin Panel!",
      });
      navigate('/admin');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50 font-sans">
      {/* Abstract Animated Glassmorphism Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[60%] rounded-full bg-[#1565C0]/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-[#D4A62A]/15 blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-md bg-white/70 backdrop-blur-2xl border border-white shadow-[0_8px_40px_rgba(0,0,0,0.08)] rounded-[2rem] overflow-hidden relative z-10">
        <CardHeader className="text-center pt-10 pb-4">
          <div className="mx-auto mb-6 bg-white shadow-md p-4 rounded-2xl inline-block border border-slate-100">
             <img src="/logo.png" alt="Brand Logo" className="h-10 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
          </div>
          <CardTitle className="text-3xl font-extrabold text-slate-800 tracking-tight">Welcome Back</CardTitle>
          <p className="text-sm text-slate-500 mt-2 font-medium">Access your enterprise dashboard</p>
        </CardHeader>
        <CardContent className="px-10 pb-10">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-600 font-semibold ml-1">Work Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@globalconsolidator.com"
                className="bg-white/50 border-slate-200 focus:border-[#1565C0] focus:ring-4 focus:ring-[#1565C0]/10 rounded-2xl h-12 px-4 transition-all duration-300 shadow-sm"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-slate-600 font-semibold ml-1">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="bg-white/50 border-slate-200 focus:border-[#1565C0] focus:ring-4 focus:ring-[#1565C0]/10 rounded-2xl h-12 px-4 transition-all duration-300 shadow-sm"
                required
              />
            </div>
            <Button type="submit" className="w-full h-12 rounded-2xl bg-[#1565C0] hover:bg-[#0D47A1] shadow-lg shadow-[#1565C0]/25 text-white font-bold tracking-wide mt-4 transition-all duration-300" disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
