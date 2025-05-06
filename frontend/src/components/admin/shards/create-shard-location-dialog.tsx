import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { addShardLocationSchema, type AddShardLocationSchema } from '@shared/schemas/shard.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import FormInputControl from '@/components/form/form-input';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { createShardLocation } from '@/utils/api-client';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

const CreateShardLocationDialog = () => {
  const form = useForm<AddShardLocationSchema>({
    resolver: zodResolver(addShardLocationSchema),
    defaultValues: {
        location: '',
        description: '',
    },
  })

  const { mutate } = useMutation({
    mutationFn: async (data: AddShardLocationSchema) => {
      await createShardLocation(data)
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success('Shard location created successfully!',{
        position: 'top-right',
        closeButton: true,
      })
    },
    onError: (error: any) => {
      toast.dismiss();
      toast.error('Error creating shard location: ' + error.message, {
        position: 'top-right',
        closeButton: true,
      })
    },
  })

  const onSubmit = async (data: AddShardLocationSchema) => {
    mutate(data);
  }


  return (
    <DialogContent className='sm:max-w-[425px] font-jersey15 -translate-y-52'>
      <DialogHeader>
        <DialogTitle className='text-center text-3xl'>Create a shard location</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          <FormInputControl 
            name='location'
            label='Location'
            placeholder='Chicago, IL'
            form={form}
          />
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-center text-xl underline flex items-center justify-center'>
                  Description
                </FormLabel>
                <FormControl>
                <Textarea 
                  placeholder='Description of the shard location. This is optional.'
                  className='resize-none h-24 text-center text-2xl placeholder:text-base'
                  {...field}
                  {...form}
                />
                </FormControl>
              </FormItem>
            )}
            />
          <div className='flex justify-center items-center mt-4'>
            <Button className='w-[130px] text-xl hover:scale-105 active:scale-95' type='submit'>Add</Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  )
}

export default CreateShardLocationDialog