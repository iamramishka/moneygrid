"use client";

import { AuthProvider } from "@/contexts/auth-context";
import { AccountProvider } from "@/contexts/account-context";
import { MainView } from "@/components/main-view";

export default function Home() {
  return (
    <AuthProvider>
      <AccountProvider>
        <MainView />
      </AccountProvider>
    </AuthProvider>
  );
}
