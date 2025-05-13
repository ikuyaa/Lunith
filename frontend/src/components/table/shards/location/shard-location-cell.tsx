import type { ShardLocation } from "@shared/types/shard.types"
import type { Row } from "@tanstack/react-table"

interface ShardLocationCellProps {
    row: Row<ShardLocation>
    getValue: keyof ShardLocation;
    description?: boolean;

}


const ShardLocationCell = ({row, getValue, description=false}: ShardLocationCellProps) => {
  return description ? (
    <div
        className="capitalize w-[120px] min-w-[120px] max-w-[120px] max-h-8 text-sm overflow-y-auto overflow-x-hidden break-words whitespace-pre-line text-center box-border"
    >
      {row.getValue(getValue.toString())}
    </div>
  ) : (
    <div className="capitalize text-lg">
      {row.getValue(getValue.toString())}
    </div>
  );
}

export default ShardLocationCell