"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface SignupFormProps {
    onSwitchToLogin: () => void;
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
    const { signup } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        setLoading(true);
        setError(null);
        try {
            await signup(email, password, firstName, lastName);
        } catch (err: any) {
            setError(err.message);
        }
        setLoading(false);
    }

  return (
    <CardContent className="space-y-4">
    {error && (
        <Alert variant="destructive">
            <AlertTitle>Signup Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    )}
    <div className="space-y-2">
        <Label htmlFor="first-name">First name</Label>
        <Input id="first-name" placeholder="Max" required value={firstName} onChange={e => setFirstName(e.target.value)} />
    </div>
    <div className="space-y-2">
        <Label htmlFor="last-name">Last name</Label>
        <Input id="last-name" placeholder="Robinson" required value={lastName} onChange={e => setLastName(e.target.value)} />
    </div>
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
    </div>
    <div className="space-y-2">
      <Label htmlFor="password">Password</Label>
      <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSignup()} />
    </div>
    <Button onClick={handleSignup} disabled={loading} className="w-full">
        {loading ? <Loader className="animate-spin" /> : "Create an account"}
    </Button>
    <div className="mt-4 text-center text-sm">
      Already have an account?{' '}
      <Button variant="link" className="p-0 h-auto text-sm" onClick={onSwitchToLogin}>
        Login
      </Button>
    </div>
  </CardContent>
  );
}
