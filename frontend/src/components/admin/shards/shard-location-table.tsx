import { flexRender, type ColumnDef  } from "@tanstack/react-table";
import { type ShardLocation } from '@shared/types/shard.types';
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenuCheckboxItem } from "@radix-ui/react-dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import TableHeaderSortable from "@/components/table/table-header-sortable";
import ShardLocationCell from "@/components/table/shards/location/shard-location-cell";
import TableDateCell from "@/components/table/table-date-cell";
import ShardLocationActionsCell from "@/components/table/shards/location/shard-location-actions-cell";
import ShardLocationActionsHeader from "@/components/table/shards/location/shard-location-action-header";
import { useShardLocationTable } from "@/hooks/use-table";

export const ShardLocationTable = () => {
  const table = useShardLocationTable(columns);
  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input 
          placeholder="Filter locations..."
          className="flex items-center justify-center max-w-3xs mx-auto md:block md:mx-0"
          value={(table.getColumn('location')?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn('location')?.setFilterValue(event.target.value)
          }}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="hover:text-white">
            <Button variant='outline' className="ml-auto text-lg">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="text-lg">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className={`hover:bg-accent capitalize font-jersey15 text-center cursor-pointer${!column.getIsVisible() ? ' text-destructive' : ''}`}
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
                        : flexRender(
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
  { //Checkboxes
    id: 'select',
    header: ({ table }) => (
      <Checkbox 
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox 
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  { //ID Row/Cell
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <TableHeaderSortable
          title="ID"
          column={column}
        />
      ) 
    },
    cell: ({ row }) => <ShardLocationCell row={row} getValue="id"/>,
  },
  { //Location Row/Cell
    accessorKey: 'location',
    header: ({ column }) => {
      return (
        <TableHeaderSortable
          title="Location"
          column={column}
        />
      ) 
    },
    cell: ({ row }) => <ShardLocationCell row={row} getValue="location"/>,
  },
  { //Description Row/Cell
    accessorKey: 'description',
    header: ({ column }) => {
      return (
        <TableHeaderSortable
          title="Description"
          column={column}
        />
      ) 
    },
    cell: ({ row }) => <div className="flex items-center justify-center"><ShardLocationCell row={row} getValue="description" description/></div>,
  },
  { //Shards Row/Cell
    accessorKey: 'shards',
    header: ({ column }) => {
      return (
        <TableHeaderSortable
          title="Shards"
          column={column}
        />
      ) 
    },
    cell: ({ row }) => <ShardLocationCell row={row} getValue="shards"/>,
  },
  { //Created At Row/Cell
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <TableHeaderSortable
          title="Created At"
          column={column}
        />
      ) 
    },
    cell: ({ row }) => < TableDateCell row={row} getValue="createdAt" />
  },
  { //Updated At Row/Cell
    accessorKey: 'updatedAt',
    header: ({ column }) => {
      return (
        <TableHeaderSortable
          title="Updated At"
          column={column}
        />
      ) 
    },
    cell: ({ row }) => < TableDateCell row={row} getValue="updatedAt" />
  },
  { //Actions Row/Cell
    id: 'actions',
    enableHiding: false,
    header: ({ column, table }) => <ShardLocationActionsHeader column={column} table={table}/>,
    cell: ({ row, table }) => <ShardLocationActionsCell row={row} table={table} />
  }
]



