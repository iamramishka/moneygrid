"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface LoginFormProps {
    onSwitchToSignup: () => void;
    onSwitchToForgotPassword: () => void;
}

export function LoginForm({ onSwitchToSignup, onSwitchToForgotPassword }: LoginFormProps) {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            await login(email, password);
        } catch (err: any) {
            setError(err.message);
        }
        setLoading(false);
    }

  return (
    <CardContent className="space-y-4">
        {error && (
            <Alert variant="destructive">
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Button variant="link" className="ml-auto p-0 h-auto text-sm" onClick={onSwitchToForgotPassword}>
                Forgot your password?
            </Button>
          </div>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()}/>
        </div>
        <Button onClick={handleLogin} disabled={loading} className="w-full">
          {loading ? <Loader className="animate-spin" /> : "Login"}
        </Button>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Button variant="link" className="p-0 h-auto text-sm" onClick={onSwitchToSignup}>
              Sign up
          </Button>
        </div>
      </CardContent>
  );
}
