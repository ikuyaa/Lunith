import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface DeleteShardLocationAlertProps {
  title: string;
  description?: string;
  alertOpen: boolean;
  setAlertOpen: (open: boolean) => void;
  onDelete: () => void;
}

const DeleteShardLocationAlert = ({ alertOpen, setAlertOpen, title, onDelete, description="This action cannot be undone." }: DeleteShardLocationAlertProps) => {
  return (
    <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
      <AlertDialogContent className='font-jersey15 -translate-y-48'>
        <AlertDialogHeader>
        <AlertDialogTitle className='text-3xl text-center'>{title}</AlertDialogTitle>
        <AlertDialogDescription className='text-center text-xl text-destructive font-bold'>
          {description}
        </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='flex justify-center mx-auto'>
        <AlertDialogAction
        onClick={() => {
          onDelete();
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