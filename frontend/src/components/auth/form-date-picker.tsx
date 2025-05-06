import { FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { RegisterDatePicker } from '../ui/date-picker'
import { type UseFormReturn } from 'react-hook-form'

interface FormDatePickerProps {
    form: UseFormReturn<any>;
}

const FormDatePicker = ({form}: FormDatePickerProps) => {
  return (
    <FormField 
        control={form.control}
        name="dateOfBirth"
        render={({ field }) => (
            <FormItem className='text-center'>
                <RegisterDatePicker field={field} />
                <FormMessage />
            </FormItem>
        )}
    />
  )
}

export default FormDatePicker