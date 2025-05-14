import type { ShardLocation } from "@shared/types/shard.types";
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type Column, type ColumnDef } from "@tanstack/react-table";
import { useShardLocationQuery } from "./use-shard";
import { shardColumnFilters, shardColumnVisibility, shardRowSelection, shardTableSorting } from "@/signals/shard.signals";

export const useShardLocationTable = (columns: ColumnDef<ShardLocation>[]) => {
    const { data } = useShardLocationQuery()
    const shardLocationTable = useReactTable<ShardLocation>({
    data: data ?? [],
    columns: columns,
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

  

  

  return shardLocationTable;
}

export const useShardManageTable = (columns: ColumnDef<ShardLocation>[]) => {
  //Table should contain
  // - Status
  // - ID
  // - Name
  // - Description
  // - Location
  // - Visibility

}

