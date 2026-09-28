import { z } from "zod";

export const syncOperationSchema = z.object({
  operationId: z.string().uuid(),

  entityType: z.enum([
    "PENSIONER",
  ]),

  entityId: z.string().uuid(),

  action: z.enum([
    "CREATE",
    "UPDATE",
    "DELETE",
  ]),

  payload: z.unknown(),
});

export const syncBatchSchema = z.object({
  nodeId: z.string().min(1),

  operations: z
    .array(syncOperationSchema)
    .min(1)
    .max(100),
});

export type SyncBatchSchema = z.infer<typeof syncBatchSchema>;
export type SyncOperationSchema = z.infer<typeof syncOperationSchema>;