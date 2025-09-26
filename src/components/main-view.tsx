"use client";

import { useAuth } from '@/contexts/auth-context';
import { useAccounts } from '@/contexts/account-context';
import { WelcomeDialog } from '@/components/account/welcome-dialog';
import { DashboardView } from '@/components/dashboard/dashboard-view';
import { PlanView } from '@/components/plan/plan-view';
import { Header } from '@/components/layout/header';
import { useState } from 'react';
import { Skeleton } from './ui/skeleton';
import { AuthView } from './auth/auth-view';

type ViewState = {
  view: 'dashboard' | 'plan';
  planId: string | null;
}

export function MainView() {
  const { user, loading: authLoading } = useAuth();
  const { accounts, loading: accountsLoading } = useAccounts();
  const [viewState, setViewState] = useState<ViewState>({ view: 'dashboard', planId: null });

  const navigateToPlan = (planId: string) => {
    setViewState({ view: 'plan', planId });
  };

  const navigateToDashboard = () => {
    setViewState({ view: 'dashboard', planId: null });
  };
  
  if (authLoading || (user && accountsLoading)) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="p-4 border-b">
          <div className="container mx-auto flex justify-between items-center">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </header>
        <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
           <div className="space-y-4">
              <Skeleton className="h-10 w-64" />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
              <Skeleton className="h-64 w-full" />
           </div>
        </main>
      </div>
    );
  }

  if (!user) {
     return <AuthView />
  }
  
  if (accounts.length === 0) {
    return <WelcomeDialog />;
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        {viewState.view === 'dashboard' ? (
          <DashboardView onSelectPlan={navigateToPlan} />
        ) : (
          <PlanView planId={viewState.planId!} onBack={navigateToDashboard} />
        )}
      </main>
    </div>
  );
}
