import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useShardLocationDeleteMutation } from '@/hooks/use-shard';
import type { ShardLocation } from '@shared/types/shard.types';
import type { Row } from '@tanstack/react-table';

interface DeleteShardLocationAlertProps {
  alertOpen: boolean;
  setAlertOpen: (open: boolean) => void;
  row: Row<ShardLocation>;
}

const DeleteShardLocationAlert = ({ alertOpen, setAlertOpen, row }: DeleteShardLocationAlertProps) => {
  const { mutate } = useShardLocationDeleteMutation();

  return (
    <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
      <AlertDialogContent className='font-jersey15 -translate-y-48'>
        <AlertDialogHeader>
        <AlertDialogTitle className='text-3xl text-center'>{`You are about to delete ${row.getValue('location')}. Are you sure?`}</AlertDialogTitle>
        <AlertDialogDescription className='text-center text-xl text-destructive font-bold'>
            This action cannot be undone.
        </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='flex justify-center mx-auto'>
        <AlertDialogAction
        onClick={() => {
          mutate(row.getValue('id'));
          setAlertOpen(false);
        }}
        className='text-lg bg-destructive hover:bg-destructive'
        >
            Delete
        </AlertDialogAction>
        <AlertDialogCancel 
          onClick={() => setAlertOpen(false)}
          className='text-lg dark:hover:text-white'
        >
            Cancel
        </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteShardLocationAlert