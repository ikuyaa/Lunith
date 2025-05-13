import { type UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Textarea } from '../ui/textarea';

interface FormInputProps {
    form: UseFormReturn<any>
    name: string;
    placeholder?: string;
    label: string;
}

const FormTextboxControl = ({ form, name, label }: FormInputProps) => {
  return (
    <FormField
      control={form.control}
      name={name} 
      render={({ field }) => (
        <FormItem className='flex flex-col items-center text-center'>
          <FormLabel className='text-xl underline underline-offset-2'>{label}</FormLabel>
          <FormControl>
            <Textarea 
              className='w-[280px] text-center p-1' {...field}
            />
          </FormControl>
            <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormTextboxControl