import { type Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useShardLocationDeleteMutation, useShardLocationDelteMultipleMutation } from "@/hooks/use-shard";
import WarningDialog from "@/components/warning-dialog";
import { type ShardLocation as BaseShardLocation } from '@shared/types/shard.types';

// Extend the type for this table
export type ShardLocation = BaseShardLocation & { shards: number };

const textSize = 'text-lg';

export const createSortableColumn = (accessorKey: keyof ShardLocation, headerText: string) => ({
  accessorKey,
  header: ({ column }: { column: any }) => (
    <Button
      className={`translate-x-1 ${textSize}`}
      variant='ghost'
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {headerText}
      <ArrowUpDown />
    </Button>
  ),
  cell: ({ row }: { row: Row<ShardLocation> }) => (
    <div className="capitalize text-base">{row.getValue(accessorKey)}</div>
  )
});

export const createDateColumn = (accessorKey: keyof ShardLocation, headerText: string) => ({
  accessorKey,
  header: ({ column }: { column: any }) => (
    <Button
      className={`translate-x-1 ${textSize}`}
      variant='ghost'
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {headerText}
      <ArrowUpDown />
    </Button>
  ),
  cell: ({ row }: { row: Row<ShardLocation> }) => {
    const date = new Date(row.getValue(accessorKey));
    return (
      <div className="capitalize text-base">{date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })}</div>
    )
  }
});

export const createSelectionColumn = () => ({
  id: 'select',
  header: ({ table }: { table: any }) => (
    <Checkbox 
      checked={
        table.getIsAllPageRowsSelected() || 
        (table.getIsSomePageRowsSelected() && 'indeterminate')
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  ),
  cell: ({ row }: { row: Row<ShardLocation> }) => (
    <Checkbox 
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  ),
  enableSorting: false,
  enableHiding: false,
});

export const createActionsColumn = (onEdit?: (row: ShardLocation) => void) => ({
  id: 'actions',
  enableHiding: false,
  header: ({ table }: { table: any }) => {
    const { mutate: deleteMultipleShards } = useShardLocationDelteMultipleMutation();
    const selectedRows = table.getSelectedRowModel().flatRows;

    return (
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className="h-8 w-8 p-0">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="font-jersey15 text-center translate-x-[35%]">
          <DropdownMenuItem asChild>
              <WarningDialog 
                title="Warning! Deleting selected shard locations."
                description="This action cannot be undone."
                onDelete={() => {
                  deleteMultipleShards(selectedRows.map((row: Row<ShardLocation>) => row.original.id.toString()));
                }}
                selectedRowsLength={selectedRows.length}
                triggerButtonText="Delete selected"
                buttonDisabled={selectedRows.length === 0}
                textDestructive
              />
          </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
      </div>
    )
  },
  cell: ({ row }: { row: Row<ShardLocation> }) => {
    const location = row.original;
    const { mutate } = useShardLocationDeleteMutation();

    return (
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className="h-8 w-8 p-0">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="font-jersey15 text-center translate-x-[35%]">
            <DropdownMenuLabel className="text-lg">Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(location.id.toString());
              }}
            >
              <p className="text-center mx-auto cursor-pointer text-base">Copy location ID</p>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {onEdit && (
              <>
                <DropdownMenuItem onClick={() => onEdit(location)}>
                  <p className="text-center mx-auto cursor-pointer text-base">Edit</p>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem 
              className="text-destructive cursor-pointer w-full"
            >
              <p className="text-center mx-auto text-base w-full">Delete</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  },
});