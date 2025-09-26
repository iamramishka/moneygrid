"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Coins, Loader, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { LoginForm } from './login-form';
import { SignupForm } from './signup-form';
import { ForgotPasswordForm } from './forgot-password-form';
import { Separator } from '../ui/separator';

type AuthViewState = 'login' | 'signup' | 'forgot_password';

export function AuthView() {
    const [authViewState, setAuthViewState] = useState<AuthViewState>('login');

    const titles: Record<AuthViewState, string> = {
        login: 'Welcome Back',
        signup: 'Create an Account',
        forgot_password: 'Forgot Password'
    };

    const descriptions: Record<AuthViewState, string> = {
        login: 'Sign in to access your savings plans.',
        signup: 'Enter your information to get started.',
        forgot_password: 'Enter your email to reset your password.'
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <Coins className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-3xl text-primary">{titles[authViewState]}</CardTitle>
                    <CardDescription>{descriptions[authViewState]}</CardDescription>
                </CardHeader>
                
                {authViewState === 'login' && <LoginForm onSwitchToSignup={() => setAuthViewState('signup')} onSwitchToForgotPassword={() => setAuthViewState('forgot_password')} />}
                {authViewState === 'signup' && <SignupForm onSwitchToLogin={() => setAuthViewState('login')} />}
                {authViewState === 'forgot_password' && <ForgotPasswordForm onSwitchToLogin={() => setAuthViewState('login')} />}

            </Card>
        </div>
    )
}
