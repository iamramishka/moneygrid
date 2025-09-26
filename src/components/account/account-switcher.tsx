"use client";
import React, { useRef, useState } from 'react';
import { useAccounts } from '@/contexts/account-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
  } from '@/components/ui/dialog';
import { Users, Edit, Trash2, PlusCircle, Loader } from 'lucide-react';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Account } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';


export function AccountSwitcher() {
  const { accounts, activeAccountId, activeAccount, switchAccount, addAccount, updateAccountName, deleteAccount } = useAccounts();
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleAddAccount = async () => {
    if (newAccountName.trim()) {
        setLoading(prev => ({...prev, add: true}));
        await addAccount(newAccountName.trim());
        setNewAccountName('');
        toast({ title: "Account Created", description: `Successfully created "${newAccountName.trim()}".` });
        setLoading(prev => ({...prev, add: false}));
    }
  }

  const handleUpdateAccount = async () => {
    if (editingAccount && editingAccount.name.trim()) {
        setLoading(prev => ({...prev, [editingAccount.id]: true}));
        await updateAccountName(editingAccount.id, editingAccount.name.trim());
        toast({ title: "Account Renamed", description: `Account renamed to "${editingAccount.name.trim()}".` });
        setEditingAccount(null);
        setLoading(prev => ({...prev, [editingAccount.id]: false}));
    }
  }

  const handleDeleteAccount = async () => {
    if (deletingAccount) {
        setLoading(prev => ({...prev, delete: true}));
        await deleteAccount(deletingAccount.id);
        toast({ title: "Account Deleted", description: `Successfully deleted "${deletingAccount.name}".`, variant: 'destructive' });
        setDeletingAccount(null);
        setIsManageOpen(false);
        setLoading(prev => ({...prev, delete: false}));
    }
  }


  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span className="hidden md:inline">{activeAccount?.name || 'No Account'}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Switch Account</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={activeAccountId || ''} onValueChange={switchAccount}>
            {accounts.map((account) => (
              <DropdownMenuRadioItem key={account.id} value={account.id}>
                {account.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setIsManageOpen(true)}>
            Manage Accounts
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Accounts</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex gap-2">
                <Input value={newAccountName} onChange={e => setNewAccountName(e.target.value)} placeholder="New account name" />
                <Button onClick={handleAddAccount} disabled={loading.add}>
                  {loading.add ? <Loader className="animate-spin" /> : <PlusCircle />} Add
                </Button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {accounts.map(acc => (
                    <div key={acc.id} className="flex items-center justify-between p-2 rounded-md border">
                        {editingAccount?.id === acc.id ? (
                            <Input value={editingAccount.name} onChange={e => setEditingAccount({...editingAccount, name: e.target.value})} autoFocus onBlur={handleUpdateAccount} onKeyDown={e => e.key === 'Enter' && handleUpdateAccount()}/>
                        ): (
                            <span>{acc.name}</span>
                        )}
                        <div className='flex items-center'>
                           {loading[acc.id] ? <Loader className="animate-spin mr-2" /> :
                           <>
                            <Button variant="ghost" size="icon" onClick={() => setEditingAccount(acc)}><Edit className="h-4 w-4"/></Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeletingAccount(acc)} disabled={accounts.length <= 1}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                           </>
                           }
                        </div>
                    </div>
                ))}
            </div>
          </div>
          <DialogFooter className="sm:justify-end border-t pt-4">
            <DialogClose asChild>
                <Button variant="secondary">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {deletingAccount && (
        <AlertDialog open={!!deletingAccount} onOpenChange={() => setDeletingAccount(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the "{deletingAccount.name}" account and all its plans. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} disabled={loading.delete} className="bg-destructive hover:bg-destructive/90">
                      {loading.delete ? <Loader className="animate-spin" /> : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
