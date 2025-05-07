import { getShardLocations } from "@/utils/api-client"
import { useQuery } from "@tanstack/react-query"
import { useReactTable, type ColumnDef, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, flexRender  } from "@tanstack/react-table";
import { type ShardLocation } from '@shared/types/shard.types';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { shardColumnFilters, shardRowSelection, shardTableSorting } from "@/signals/shard.signals";
import { signal } from "@preact/signals-react";
import { DropdownMenuCheckboxItem } from "@radix-ui/react-dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useShardLocationQuery } from "@/hooks/use-shard";

const shardColumnVisibility = signal<Record<string, boolean>>({});

export const ShardLocationTable = () => {
     const { data, isLoading } = useShardLocationQuery()

      const table = useReactTable<ShardLocation>({
        data: data ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: (updater) => {
          if (typeof updater === 'function') {
            shardColumnVisibility.value = updater(shardColumnVisibility.value);
          } else {
            shardColumnVisibility.value = updater;
          }
        },
        onSortingChange: (updater) => {
          if (typeof updater === 'function') {
            shardTableSorting.value = updater(shardTableSorting.value);
          } else {
            shardTableSorting.value = updater;
          }
        },
        onRowSelectionChange: (updater) => {
          if (typeof updater === 'function') {
            shardRowSelection.value = updater(shardRowSelection.value);
          } else {
            shardRowSelection.value = updater;
          }
        },
        onColumnFiltersChange: (updater) => {
          if (typeof updater === 'function') {
            shardColumnFilters.value = updater(shardColumnFilters.value);
          } else {
            shardColumnFilters.value = updater;
          }
        },
        state: {
          columnVisibility: shardColumnVisibility.value,
          sorting: shardTableSorting.value,
          rowSelection: shardRowSelection.value,
          columnFilters: shardColumnFilters.value,
        },
      })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input 
          placeholder="Filter locations..."
          className="flex items-center justify-center max-w-3xs mx-auto md:block md:mx-0"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="hover:text-white">
            <Button variant='outline' className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize font-jersey15 text-center cursor-pointer"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => 
                    column.toggleVisibility(!!value)
                  }
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="justify-start">
            { table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                { headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-center">
                      {header.isPlaceholder
                        ? null
                        :flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            { table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  { row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      {
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected
      </div>
      <div className="space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Next
      </Button>
      </div>
    </div>
  )
}

export const columns: ColumnDef<ShardLocation>[] = [
  {
    id: 'shard-location-select',
    header: ({ table }) => (
      <Checkbox 
        checked= {
          table.getIsAllPageRowsSelected() || 
          (table.getIsSomePageRowsSelected() &&  'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-x-2"
      />
    ),
    cell: ({ row }) => (
      <Checkbox 
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-x-2"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <Button
        className="translate-x-1.5"
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        ID
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('id')}</div>
    )
  },
  {
    accessorKey: 'location',
    header: ({ column }) => (
      <Button
        className="translate-x-1.5"
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Location
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue('location')}</div>
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <Button
        className="translate-x-1.5"
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Description
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div>{row.getValue('description')}</div>
    )
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          className="translate-x-1.5"
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created At
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return (
        <div className="capitalize">{date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })}</div>
      )
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => {
      return (
        <Button
          className="translate-x-1.5"
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Updated At
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('updatedAt'));
      return (
        <div className="capitalize">{date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })}</div>
      )
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const location = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className="h-8 w-8 p-0">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="font-jersey15 text-center translate-x-[35%]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {navigator.clipboard.writeText(location.id.toString())}}
              
            >
              <p className="text-center mx-auto cursor-pointer">Copy location ID</p>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem><p className="text-center mx-auto cursor-pointer">Edit</p></DropdownMenuItem>
            <DropdownMenuItem className="text-destructive cursor-pointer"><p className="text-center mx-auto">Delete</p></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
]