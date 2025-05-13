import FormInputControl from '@/components/form/form-input'
import FormTextboxControl from '@/components/form/form-textbox'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { useShardLocationEditMutation } from '@/hooks/use-shard'
import { zodResolver } from '@hookform/resolvers/zod'
import { editShardLocationSchema, type EditShardLocationSchema } from '@shared/schemas/shard.schemas'
import type { ShardLocation } from '@shared/types/shard.types'
import type { Row, Table } from '@tanstack/react-table'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'

interface EditShardLocationDialogProps {
    dialogOpen: boolean
    setDialogOpen: (open: boolean) => void
    row: Row<ShardLocation>
    table: Table<ShardLocation>
}

const EditShardLocationDialog = ({dialogOpen, setDialogOpen, row, table}: EditShardLocationDialogProps) => {
  const form = useForm<EditShardLocationSchema>({
    resolver: zodResolver(editShardLocationSchema),
    defaultValues: {
        location: row.getValue('location'),
        description: row.getValue('description') || '',
    },
  });

  const shardLocationId = row.getValue('id')
  const { mutate } = useShardLocationEditMutation(String(shardLocationId));

  // Update form values when row data changes
  useEffect(() => {
    if (dialogOpen) {
      const latestRow = table.getRowModel().rowsById[row.id];
      if (latestRow) {
        form.reset({
          location: latestRow.getValue('location'),
          description: latestRow.getValue('description') || '',
        });
      }
    }
  }, [dialogOpen, row.id, table, form]);

  function onSubmit(data: EditShardLocationSchema) {
    mutate(data, {
      onSuccess: () => {
        setDialogOpen(false);
      }
    });
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={(val) => {
        setDialogOpen(val)
        if(!val) {
            form.reset();
        }
    }}>
      <DialogContent className='font-jersey15 -translate-y-48'>
       <DialogHeader>
        <DialogTitle className='text-3xl text-center'>
            {`Edit ${row.getValue('location')}.`}
        </DialogTitle>
        <DialogDescription className='text-center text-xl'>
            Editing a shard location is irreversable.
        </DialogDescription>
      </DialogHeader>
        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormInputControl 
               name='location'
               label='Location'
               form={form}
            />
            <FormTextboxControl
               name='description'
               label='Description'
               form={form}
            />
            <div className='flex items-center justify-center'>
              <Button className='text-lg w-[200px]'
                type='submit'
              >
                Submit
              </Button>
            </div>
            </form>
        </Form>
     </DialogContent>
    </Dialog>
  )
}

export default EditShardLocationDialog