import type { Row } from '@tanstack/react-table'

interface TableCellProps {
  row: Row<any>
  getValue: 'createdAt' | 'updatedAt'
}

const TableDateCell = ({row, getValue}: TableCellProps) => {
  return (
    <div className="capitalize text-base">
      {new Date(row.getValue(getValue.toString())).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })}
    </div>
  )
}

export default TableDateCell