import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { ShardLocation } from '@shared/types/shard.types'
import type { Row, Table } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import DeleteShardLocationAlert from './delete-shard-location-alert'
import { useState } from 'react'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { Dialog } from '@/components/ui/dialog'
import EditShardLocationDialog from './edit-shard-location-dialog'

interface ShardLocationActionsCellProps {
    row: Row<ShardLocation>
    table: Table<ShardLocation>
}

const ShardLocationActionsCell = ({ row, table }: ShardLocationActionsCellProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  return (
    <>
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      {/* Trigger */} 
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='center' className='font-jersey15 space-y-2'>
        <DropdownMenuLabel className='text-center text-lg p-0'>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* Copy Name */}
        <DropdownMenuItem 
          onClick={() => navigator.clipboard.writeText(row.getValue('location'))}
          className='text-center p-0.5'
        >
        <p className='text-center text-base mx-auto'>Copy Name</p>
        </DropdownMenuItem>
        {/* Edit */}
        <DropdownMenuItem 
          className='text-center p-0.5'
          onClick={() => {
            setDropdownOpen(false)
            setDialogOpen(true)
          }}
        >
          <p className='text-center text-base mx-auto'>Edit</p>  
        </DropdownMenuItem>
        {/* Delete */}
        <DropdownMenuItem 
          className='text-center p-0.5'
          onClick={() => {
            setDropdownOpen(false)
            setAlertOpen(true)
          }}
        >
        <p className='text-center text-base mx-auto text-destructive'>Delete</p>
    </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    
    {/* Dialogs */}
    <DeleteShardLocationAlert 
      alertOpen={alertOpen}
      setAlertOpen={setAlertOpen}
      row={row}
    />
    <EditShardLocationDialog 
      dialogOpen={dialogOpen}
      setDialogOpen={setDialogOpen}
      row={row}
      table={table}
    />
    </>
  )
}

export default ShardLocationActionsCell