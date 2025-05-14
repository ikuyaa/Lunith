import { useMemo } from 'react'
import type { Row } from '@tanstack/react-table'

interface TableCellProps {
  row: Row<any>
  getValue: 'createdAt' | 'updatedAt'
}

const TableDateCell = ({row, getValue}: TableCellProps) => {
  const formattedDate = useMemo(() => {
    const value = row.getValue(getValue.toString()) as string | number | Date
    return new Date(value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }, [row, getValue])

  return (
    <div className="capitalize text-base">
      {formattedDate}
    </div>
  )
}

export default TableDateCell