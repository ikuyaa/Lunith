import { type UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

interface FormInputProps {
    form: UseFormReturn<any>
    name: string;
    placeholder?: string;
    inputType?: 'text' | 'email' | 'password' | 'number' | 'date';
    label: string;
    confirmPassword?: boolean;
}

const FormInputControl = ({ form, name, placeholder, inputType='text', label, confirmPassword=false }: FormInputProps) => {
  return (
    <FormField
      control={form.control}
      name={confirmPassword ? 'confirmPassword' : name} 
      render={({ field }) => (
        <FormItem className='flex flex-col items-center text-center'>
          <FormLabel className='text-xl underline underline-offset-2'>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} type={inputType} className='w-[200px] text-center text-xl placeholder:text-lg ' {...field} />
          </FormControl>
            <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormInputControl