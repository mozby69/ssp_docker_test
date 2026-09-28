import { prisma } from "@/lib/database/prisma";
import type { SyncOperationSchema } from "@repo/shared";

type PensionerPayload = {
  id: string;
  firstname?: string | null;
  lastname?: string | null;
  age?: number | null;
  loan_amount?: string | null;
  loan_type?: string | null;
};

export async function processPensionerOperation(
  nodeId: string,
  operation: SyncOperationSchema
) {
  return prisma.$transaction(async (tx) => {
    const alreadyProcessed =
      await tx.syncInbox.findUnique({
        where: {
          id: operation.operationId,
        },
      });

    if (alreadyProcessed) {
      return {
        operationId: operation.operationId,
        status: "ALREADY_PROCESSED",
      };
    }

    const payload =
      operation.payload as PensionerPayload;

    if (operation.action === "CREATE") {
      await tx.pensionerData.upsert({
        where: {
          id: operation.entityId,
        },

        create: {
          id: operation.entityId,
          firstname: payload.firstname ?? null,
          lastname: payload.lastname ?? null,
          age: payload.age ?? null,
          loan_amount:
            payload.loan_amount !== null &&
            payload.loan_amount !== undefined
              ? payload.loan_amount
              : null,
          loan_type: payload.loan_type ?? null,
        },

        update: {
          firstname: payload.firstname ?? null,
          lastname: payload.lastname ?? null,
          age: payload.age ?? null,
          loan_amount:
            payload.loan_amount !== null &&
            payload.loan_amount !== undefined
              ? payload.loan_amount
              : null,
          loan_type: payload.loan_type ?? null,
        },
      });
    }

    if (operation.action === "UPDATE") {
      await tx.pensionerData.update({
        where: {
          id: operation.entityId,
        },

        data: {
          firstname: payload.firstname ?? null,
          lastname: payload.lastname ?? null,
          age: payload.age ?? null,
          loan_amount:
            payload.loan_amount !== null &&
            payload.loan_amount !== undefined
              ? payload.loan_amount
              : null,
          loan_type: payload.loan_type ?? null,
        },
      });
    }

    if (operation.action === "DELETE") {
      await tx.pensionerData.delete({
        where: {
          id: operation.entityId,
        },
      });
    }

    await tx.syncInbox.create({
      data: {
        id: operation.operationId,
        sourceNode: nodeId,
        entityType: operation.entityType,
        entityId: operation.entityId,
        action: operation.action,
      },
    });

    return {
      operationId: operation.operationId,
      status: "PROCESSED",
    };
  });
}