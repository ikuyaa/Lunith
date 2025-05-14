import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown } from "lucide-react"

const ShardManageTable = () => {
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
        <Table className="">
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

export default ShardManageTable