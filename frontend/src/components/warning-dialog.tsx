import { AlertDialogAction, AlertDialogTitle, AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger } from './ui/alert-dialog';
import { Button } from './ui/button';
interface WarningDialogProps {
  title: string;
  description?: string;
  selectedRowsLength: number;
  onDelete: () => void;
  triggerButtonText: string;
  buttonDisabled?: boolean;
  textDestructive?: boolean;

}

const WarningDialog = ({title, description, onDelete, triggerButtonText, buttonDisabled=false, textDestructive=false}: WarningDialogProps) => {
  const handleDelete = () => {
    onDelete();
  };

  return (
    <AlertDialog>
        <AlertDialogTrigger asChild> 
          <Button disabled={buttonDisabled} variant='ghost' 
            className={`text-center mx-auto text-base w-full p-0 ${textDestructive ? 'text-destructive' : ''}`}
          >
            {triggerButtonText}
          </Button>        
      </AlertDialogTrigger>
    <AlertDialogContent className='font-jersey15 -my-24'>
      <AlertDialogHeader>
        <AlertDialogTitle className='text-center text-2xl'>{title}</AlertDialogTitle>
        <AlertDialogDescription className='text-center text-xl'>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className='flex justify-center items-center mx-auto space-x-2'>
        <AlertDialogAction onClick={handleDelete} className='text-base bg-destructive'>
          Delete
        </AlertDialogAction>
        <AlertDialogCancel className='text-base'>
          Cancel
        </AlertDialogCancel>
      </AlertDialogFooter>
    </AlertDialogContent>
    </AlertDialog>
  )
}

export default WarningDialog