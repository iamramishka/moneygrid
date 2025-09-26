"use client";

import { AccountSwitcher } from '@/components/account/account-switcher';
import { useAuth } from '@/contexts/auth-context';
import { Coins, LogOut } from 'lucide-react';
import { Button } from '../ui/button';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-2 items-center">
            <Coins className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-headline font-bold text-primary">
            MoneyGrid
          </h1>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {user && (
            <>
              <AccountSwitcher />
              <Button variant="ghost" size="icon" onClick={logout} title="Log out">
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
