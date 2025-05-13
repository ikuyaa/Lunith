import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { ShardLocation } from '@shared/types/shard.types'
import type { Column, Table } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'

interface ShardLocationActionsHeaderProps {
    column: Column<ShardLocation, unknown>
    table: Table<ShardLocation>
}

const ShardLocationActionsHeader = ({ column, table }: ShardLocationActionsHeaderProps) => {
  const selectedRows = table.getSelectedRowModel().rows
  const selectedCount = selectedRows.length
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='font-jersey15 space-y-2'>
        <DropdownMenuItem
          disabled={selectedCount === 0}
        >
          <p className='text-center mx-auto text-destructive text-base'>Delete Selected</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ShardLocationActionsHeader