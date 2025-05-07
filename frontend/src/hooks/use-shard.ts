import { getShardLocations } from "@/utils/api-client";
import type { ShardLocation } from "@shared/types/shard.types";
import { useQuery } from "@tanstack/react-query";

export const useShardLocationQuery = () => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['shard-locations'],
        queryFn: async () => {
            const data = await getShardLocations();
            return data as ShardLocation[];
        }
    });

    return {
        data,
        isLoading,
        refetch,
    }
}