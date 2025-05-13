import { signal } from "@preact/signals-react";
import type { ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table";



//Table state signals
export const shardTableSorting = signal<SortingState>([]);
export const shardColumnFilters = signal<ColumnFiltersState>([])
export const shardColumnVisibility = signal<VisibilityState>({});
export const shardRowSelection = signal({});

export const isShardDeleteWarningDialogOpen = signal(false);