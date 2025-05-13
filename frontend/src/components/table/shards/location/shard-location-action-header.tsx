import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useShardLocationDelteMultipleMutation } from '@/hooks/use-shard'
import type { ShardLocation } from '@shared/types/shard.types'
import type { Table } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import DeleteShardLocationAlert from './delete-shard-location-alert'

interface ShardLocationActionsHeaderProps {
    table: Table<ShardLocation>
}

const ShardLocationActionsHeader = ({ table }: ShardLocationActionsHeaderProps) => {
  const selectedRows = table.getSelectedRowModel().rows
  const selectedCount = selectedRows.length
  const { mutate } = useShardLocationDelteMultipleMutation();
  const shardIds = selectedRows.map((row) => row.original.id.toString())

  //States
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  return (
    <>
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='font-jersey15 space-y-2'>
        <DropdownMenuItem
          disabled={selectedCount === 0}
          onClick={() => {
            setDropdownOpen(false)
            setAlertOpen(true)
          }}
        >
          <p className='text-center mx-auto text-destructive text-base'>Delete Selected</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    
    <DeleteShardLocationAlert
      alertOpen={alertOpen}
      setAlertOpen={setAlertOpen}
      onDelete={() => {
        mutate(shardIds)
      }}
      description={`This action cannot be undone.`}
      title={`You are about to delete ${selectedCount} locations. Are you sure?`}
    
    />
    </>
  )
}

export default ShardLocationActionsHeader