"use client";

import type { Account, Plan, ExtraSaving, Tile } from "@/lib/types";
import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { useAuth } from "./auth-context";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { LKR_VALUES } from "@/lib/lkr-values";

// Helper to generate simple unique IDs for local data
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

const generatePlanTiles = (duration: number, intensity: number, goal: number) => {
    let valueSet = LKR_VALUES;
    if (intensity <= 3) {
      valueSet = LKR_VALUES.filter(v => v <= 100);
    } else if (intensity <= 6) {
      valueSet = LKR_VALUES.filter(v => v >= 10 && v <= 1000);
    } else {
      valueSet = LKR_VALUES.filter(v => v >= 100);
    }
    if (valueSet.length === 0) valueSet = [100];
  
    const tiles: {day: number, amount: number, saved: boolean, savedDate: string | null}[] = [];
    let currentTotal = 0;
  
    for (let i = 1; i <= duration; i++) {
        const remainingDays = duration - i + 1;
        const idealAverage = (goal - currentTotal) / remainingDays;
        
        let bestFit = valueSet.reduce((prev, curr) => 
          Math.abs(curr - idealAverage) < Math.abs(prev - idealAverage) ? curr : prev
        );
        
        const randomIndex = Math.floor(Math.random() * valueSet.length);
        const randomValue = valueSet[randomIndex];

        const chosenAmount = Math.random() < 0.7 ? bestFit : randomValue;

        const amount = (i === duration) ? (goal-currentTotal > 0 ? goal-currentTotal : chosenAmount) : chosenAmount;
        
        tiles.push({
            day: i,
            amount: Math.round(amount / 1) * 1,
            saved: false,
            savedDate: null
        });
        currentTotal += amount;
    }

    let total = tiles.reduce((sum, t) => sum + t.amount, 0);
    let diff = goal - total;
    let attempts = 0;
    while(Math.abs(diff) > 0.1 && attempts < 100) {
        const tileToAdjustIndex = Math.floor(Math.random() * tiles.length);
        const adjustment = Math.random() * diff;
        tiles[tileToAdjustIndex].amount += adjustment;
        tiles[tileToAdjustIndex].amount = Math.max(0, Math.round(tiles[tileToAdjustIndex].amount));

        total = tiles.reduce((sum, t) => sum + t.amount, 0);
        diff = goal - total;
        attempts++;
    }
    tiles[tiles.length-1].amount = Math.max(0, Math.round(tiles[tiles.length-1].amount + diff));


    return tiles;
};


interface AccountContextType {
  accounts: Account[];
  activeAccountId: string | null;
  activeAccount: Account | null;
  loading: boolean;
  addAccount: (name: string) => Promise<void>;
  switchAccount: (id: string) => void;
  updateAccountName: (id: string, name: string) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  addPlan: (accountId: string, plan: Omit<Plan, "id" | "startDate" | "tiles" | "extraSavings" | "currency">) => Promise<void>;
  updatePlan: (accountId: string, planId: string, updates: Partial<Plan>) => Promise<void>;
  deletePlan: (accountId: string, planId: string) => Promise<void>;
  updateTile: (accountId: string, planId: string, tileId: string, updates: Partial<Pick<Tile, 'saved' | 'savedDate' | 'amount'>>) => Promise<void>;
  addExtraSaving: (accountId: string, planId: string, saving: Omit<ExtraSaving, 'id'>) => Promise<void>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const storageKey = user ? `budget-grid:data:${user.uid}` : 'budget-grid:data:guest';
  
  const [data, setData, isLoaded] = useLocalStorage<{ accounts: Account[], activeAccountId: string | null }>(storageKey, {
    accounts: [],
    activeAccountId: null,
  });

  const loading = !isLoaded;

  const activeAccount = useMemo(() => {
    if (loading || !data.activeAccountId) return null;
    return data.accounts.find((acc) => acc.id === data.activeAccountId) || null;
  }, [data, loading]);
  
  const addAccount = async (name: string) => {
    const newAccount: Account = { id: generateId(), name, plans: [] };
    setData(prevData => {
      const newAccounts = [...prevData.accounts, newAccount];
      return {
        accounts: newAccounts,
        activeAccountId: prevData.activeAccountId ?? newAccount.id,
      }
    });
  };
  
  const switchAccount = (id: string) => {
    setData(prevData => ({ ...prevData, activeAccountId: id }));
  };
  
  const updateAccountName = async (id: string, name: string) => {
    setData(prevData => ({
      ...prevData,
      accounts: prevData.accounts.map(acc => acc.id === id ? { ...acc, name } : acc),
    }));
  };
  
  const deleteAccount = async (id: string) => {
    setData(prevData => {
      const remainingAccounts = prevData.accounts.filter(acc => acc.id !== id);
      let newActiveId = prevData.activeAccountId;
      if (prevData.activeAccountId === id) {
          newActiveId = remainingAccounts.length > 0 ? remainingAccounts[0].id : null;
      }
      return {
        accounts: remainingAccounts,
        activeAccountId: newActiveId,
      }
    });
  };

  const addPlan = async (accountId: string, planData: Omit<Plan, "id" | "startDate" | "tiles" | "extraSavings" | "currency">) => {
    const tiles = generatePlanTiles(planData.duration, planData.intensity, planData.goal);
    const newPlan: Plan = {
      ...planData,
      id: generateId(),
      startDate: new Date().toISOString(),
      currency: 'LKR',
      extraSavings: [],
      tiles: tiles.map(tile => ({...tile, id: generateId()})),
    }

    setData(prevData => ({
      ...prevData,
      accounts: prevData.accounts.map(acc => 
        acc.id === accountId 
        ? { ...acc, plans: [...acc.plans, newPlan] } 
        : acc
      ),
    }));
  };
  
  const updatePlan = async (accountId: string, planId: string, updates: Partial<Plan>) => {
    setData(prevData => ({
      ...prevData,
      accounts: prevData.accounts.map(acc => {
        if (acc.id === accountId) {
          return {
            ...acc,
            plans: acc.plans.map(p => p.id === planId ? { ...p, ...updates } : p)
          };
        }
        return acc;
      })
    }));
  };
  
  const deletePlan = async (accountId: string, planId: string) => {
    setData(prevData => ({
      ...prevData,
      accounts: prevData.accounts.map(acc => 
        acc.id === accountId
        ? { ...acc, plans: acc.plans.filter(p => p.id !== planId) }
        : acc
      )
    }));
  };

  const updateTile = async (accountId: string, planId: string, tileId: string, updates: Partial<Pick<Tile, 'saved' | 'savedDate' | 'amount'>>) => {
    setData(prevData => ({
      ...prevData,
      accounts: prevData.accounts.map(acc => {
        if (acc.id === accountId) {
          return {
            ...acc,
            plans: acc.plans.map(p => {
              if (p.id === planId) {
                return {
                  ...p,
                  tiles: p.tiles.map(t => t.id === tileId ? { ...t, ...updates } : t)
                };
              }
              return p;
            })
          };
        }
        return acc;
      })
    }));
  };
  
  const addExtraSaving = async (accountId: string, planId: string, saving: Omit<ExtraSaving, 'id'>) => {
    const newSaving: ExtraSaving = {
      ...saving,
      id: generateId(),
    };
    setData(prevData => ({
      ...prevData,
      accounts: prevData.accounts.map(acc => {
        if (acc.id === accountId) {
          return {
            ...acc,
            plans: acc.plans.map(p => {
              if (p.id === planId) {
                return {
                  ...p,
                  extraSavings: [...p.extraSavings, newSaving]
                };
              }
              return p;
            })
          };
        }
        return acc;
      })
    }));
  };

  const value = {
    accounts: data.accounts,
    activeAccountId: data.activeAccountId,
    activeAccount,
    loading,
    addAccount,
    switchAccount,
    updateAccountName,
    deleteAccount,
    addPlan,
    updatePlan,
    deletePlan,
    updateTile,
    addExtraSaving,
    // Deprecated functions are removed
  };

  return (
    <AccountContext.Provider value={value as AccountContextType}>{children}</AccountContext.Provider>
  );
};

export const useAccounts = (): AccountContextType => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error("useAccounts must be used within an AccountProvider");
  }
  return context;
};
