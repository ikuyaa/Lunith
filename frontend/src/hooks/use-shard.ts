import { deleteMultipleShardLocationsById, deleteShardLocationById, getShardLocations, updateShardLocationById } from "@/utils/api-client";
import type { EditShardLocationSchema } from "@shared/schemas/shard.schemas";
import type { ShardLocation } from "@shared/types/shard.types";
import { useMutation, useQuery, type UseMutationOptions } from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

export const useShardLocationQuery = () => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['shard-locations'],
        queryFn: async () => {
            const data = await getShardLocations();
            return data as (ShardLocation & { shardCount: number })[];
        }
    });

    return {
        data,
        isLoading,
        refetch,
    }
}

export const useShardLocationDeleteMutation = () => {
    const { refetch } = useShardLocationQuery();

    const { mutate } = useMutation({
        mutationKey: ["delete-shard-singular"],
        mutationFn: async (shardId: string) => {
            return await deleteShardLocationById(shardId);
        },
        onError: (error) => {
            toast.dismiss();
            toast.error(`Error deleting shard: ${error}`,{
                position: 'top-right',
                closeButton: true,
            });
            return;
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Shard deleted successfully!", {
                position: 'top-right',
                closeButton: true,
            });
            refetch();
            return;
        }
    })

    return { mutate }
}

export const useShardLocationDelteMultipleMutation = () => {
    const { refetch } = useShardLocationQuery();

    const { mutate } = useMutation({
        mutationKey: ["delete-shard-multiple"],
        mutationFn: async (shardIds: string[]) => {
            return await deleteMultipleShardLocationsById(shardIds);
        },
        onError: (error) => {
            toast.dismiss();
            toast.error(`Error deleting shards: ${error}`,{
                position: 'top-right',
                closeButton: true,
            });
            return;
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Shards deleted successfully!", {
                position: 'top-right',
                closeButton: true,
            });
            refetch();
            return;
        }
    })

    return { mutate }
}

export const useShardLocationEditMutation = (locationId: string) => {
    const { refetch } = useShardLocationQuery();

    const { mutate } = useMutation({
        mutationKey: ["edit-shard"],
        mutationFn: async (data: EditShardLocationSchema) => {
            return await updateShardLocationById(locationId, data);
        },
        onError: (error) => {
            toast.dismiss();
            toast.error(`${error}`,{
                position: 'top-right',
                closeButton: true,
            });
            return;
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Shard edited!", {
                position: 'top-right',
                closeButton: true,
            });
            return refetch();
        },
    })

    return { mutate, refetch }   
}
