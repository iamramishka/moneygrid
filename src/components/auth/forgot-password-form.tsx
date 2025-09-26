"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface ForgotPasswordFormProps {
    onSwitchToLogin: () => void;
}

export function ForgotPasswordForm({ onSwitchToLogin }: ForgotPasswordFormProps) {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleReset = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await resetPassword(email);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        }
        setLoading(false);
    }

  return (
    <CardContent className="space-y-4">
        {error && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {success && (
            <Alert>
                <AlertTitle>Check your email</AlertTitle>
                <AlertDescription>A password reset link has been sent to your email address.</AlertDescription>
            </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <Button onClick={handleReset} disabled={loading} className="w-full">
            {loading && <Loader className="animate-spin" />}
            {!loading && "Send Reset Link"}
        </Button>
        <div className="mt-4 text-center text-sm">
          Remembered your password?{' '}
          <Button variant="link" className="p-0 h-auto text-sm" onClick={onSwitchToLogin}>
            Login
          </Button>
        </div>
      </CardContent>
  );
}
