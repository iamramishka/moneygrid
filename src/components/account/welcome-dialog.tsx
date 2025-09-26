"use client";

import { useState } from 'react';
import { useAccounts } from '@/contexts/account-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Loader } from 'lucide-react';
import { Label } from '../ui/label';

export function WelcomeDialog() {
  const [accountName, setAccountName] = useState('');
  const [loading, setLoading] = useState(false);
  const { addAccount } = useAccounts();

  const handleCreateAccount = async () => {
    if (accountName.trim() && !loading) {
      setLoading(true);
      try {
        await addAccount(accountName.trim());
      } catch (error) {
        console.error("Failed to create account", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
            <Coins className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl text-primary">Welcome to MoneyGrid</CardTitle>
          <CardDescription className="text-lg">Your smart digital savings tracker.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-6 text-muted-foreground">
            To get started, let's create your first savings account. You can name it anything you like, for example, "Emergency Fund" or "Dream Vacation".
          </p>
          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name</Label>
            <Input
              id="accountName"
              type="text"
              placeholder="e.g., Emergency Fund"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateAccount()}
              className="text-base"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full text-lg"
            size="lg"
            onClick={handleCreateAccount}
            disabled={!accountName.trim() || loading}
          >
            {loading ? <Loader className="animate-spin" /> : 'Get Started'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
