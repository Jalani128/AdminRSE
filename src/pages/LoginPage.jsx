import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../services/apiService';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      login(response.data.token);
      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl border-0">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
                  <img src="/adminlogo.png" alt="Logo" className="h-14 w-auto object-contain" />
          <h1 className="text-2xl font-bold text-navy-900">Admin Login</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your admin account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy-900 mb-2">Email Address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
              required
              className="border-gray-200 focus:border-primary focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-900 mb-2">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="border-gray-200 focus:border-primary focus:ring-primary"
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-primary hover:bg-primary-dark text-white transition-colors"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        {/* Credentials Hint */}
        
      </Card>
    </div>
  );
}
