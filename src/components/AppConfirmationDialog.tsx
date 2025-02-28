import React, { FC, ReactNode, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import AppSpinner from './AppSpinner';

const AppConfirmationDialog: FC<{
  title?: string;
  description?: string;
  buttonElem: ReactNode;
  handleDialogAction?: (password?: string) => void | Promise<void>;
  requirePassword?: boolean;
}> = ({
  title = 'Are you absolutely sure?',
  description = 'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
  buttonElem,
  handleDialogAction,
  requirePassword = false,
}) => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
      if (requirePassword && !password) {
        toast({
          title: 'Error',
          description: 'Please enter your password to proceed.',
          variant: 'destructive',
        });
        return;
      }

      setLoading(true);

      try {
        await handleDialogAction?.(password);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>{buttonElem}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>

          {requirePassword && (
            <div className="mt-2">
              <p className="text-sm text-red-600 font-medium">
                To proceed, please confirm your password.
              </p>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2"
                disabled={loading}
              />
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={loading}>
              {loading ? <AppSpinner /> : 'Continue'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

export default AppConfirmationDialog;
