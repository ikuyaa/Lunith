import { ArrowUpDown } from 'lucide-react'
import { Button } from '../ui/button'
import type { ShardLocation } from '@shared/types/shard.types';
import type { Column } from '@tanstack/react-table';

interface TableHeaderSortableProps {
    title: string;
    column: Column<ShardLocation, unknown>

}

const TableHeaderSortable = ({ title, column }: TableHeaderSortableProps) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="translate-x-1 text-lg"
    >
      {title}
      <ArrowUpDown />
    </Button>
  )
}

export default TableHeaderSortable