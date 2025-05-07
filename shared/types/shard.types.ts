import { shardLocation } from '../drizzle/schema/shard.schema';
export type ShardLocation = typeof shardLocation.$inferSelect;