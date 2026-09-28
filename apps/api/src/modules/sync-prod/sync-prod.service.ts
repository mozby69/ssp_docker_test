import type {SyncBatchSchema,SyncOperationSchema} from "@repo/shared";

import * as syncRepository from "./sync-prod.repository";

export async function processSyncBatch(
  batch: SyncBatchSchema
) {
  const results = [];

  for (const operation of batch.operations) {
    const result = await processOperation(
      batch.nodeId,
      operation
    );

    results.push(result);
  }

  return {
    nodeId: batch.nodeId,
    processed: results.length,
    results,
  };
}

async function processOperation(
  nodeId: string,
  operation: SyncOperationSchema
) {
  if (operation.entityType === "PENSIONER") {
    return syncRepository.processPensionerOperation(
      nodeId,
      operation
    );
  }

  throw new Error(
    `Unsupported entity type: ${operation.entityType}`
  );
}