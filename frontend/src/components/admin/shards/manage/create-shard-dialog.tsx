import FormInputControl from '@/components/form/form-input'
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { type CreateShardSchema } from '@shared/schemas/shard.schemas'
import { useForm } from 'react-hook-form'

const CreateShardDialog = () => {

  const form = useForm<CreateShardSchema>({
    defaultValues: {
        name: '',
        locationId: 0,
        description: '',
        totalMemMB: 0,
        totalDiskSpaceMB: 0,
        totalCPUCores: 0,
        daemonFileDirectory: '/var/lib/lunith/volumes',
    }
  })
  return (
    <DialogContent className='font-jersey15'>
      <DialogHeader>
        <DialogTitle className='text-4xl font-bold text-center'>
            Create a Shard
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form>
          <FormInputControl 
            form={form}
            name='name'
            label='Shard Name'
            placeholder=''   
          />
          <FormInputControl 
            form={form}
            name='locationId'
            label='Location ID (change this to dropdown)'
            placeholder=''
          />
        </form>
      </Form>
    </DialogContent>
  )
}

export default CreateShardDialog