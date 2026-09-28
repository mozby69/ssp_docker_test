import "dotenv/config";

import { prisma } from "@/lib/database/prisma";

const CENTRAL_API_URL =
  process.env.CENTRAL_API_URL;

const SYNC_NODE_ID =
  process.env.SYNC_NODE_ID;

const SYNC_TOKEN =
  process.env.SYNC_TOKEN;

const BATCH_SIZE = Number(
  process.env.SYNC_BATCH_SIZE ?? 50
);

const POLL_INTERVAL = Number(
  process.env.SYNC_POLL_INTERVAL_MS ?? 5000
);

const PROCESSING_TIMEOUT_MS = 5 * 60 * 1000;

if (!CENTRAL_API_URL) {
  throw new Error(
    "CENTRAL_API_URL is required"
  );
}

if (!SYNC_NODE_ID) {
  throw new Error(
    "SYNC_NODE_ID is required"
  );
}

function sleep(ms: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

function calculateRetryDelay(
  attempts: number
) {
  const seconds = Math.min(
    300,
    5 * Math.pow(2, attempts)
  );

  return seconds * 1000;
}

async function recoverStaleJobs() {
  const staleTime = new Date(
    Date.now() - PROCESSING_TIMEOUT_MS
  );

  await prisma.syncOutbox.updateMany({
    where: {
      status: "PROCESSING",

      lockedAt: {
        lt: staleTime,
      },
    },

    data: {
      status: "PENDING",
      lockedAt: null,
    },
  });
}

async function claimBatch() {
  return prisma.$transaction(
    async (tx) => {
      const jobs =
        await tx.syncOutbox.findMany({
          where: {
            OR: [
              {
                status: "PENDING",
              },

              {
                status: "FAILED",

                nextAttemptAt: {
                  lte: new Date(),
                },
              },
            ],
          },

          orderBy: {
            createdAt: "asc",
          },

          take: BATCH_SIZE,
        });

      if (jobs.length === 0) {
        return [];
      }

      const ids = jobs.map(
        (job) => job.id
      );

      await tx.syncOutbox.updateMany({
        where: {
          id: {
            in: ids,
          },
        },

        data: {
          status: "PROCESSING",
          lockedAt: new Date(),
        },
      });

      return jobs;
    }
  );
}

async function markSynced(
  operationIds: string[]
) {
  if (operationIds.length === 0) {
    return;
  }

  await prisma.syncOutbox.updateMany({
    where: {
      id: {
        in: operationIds,
      },
    },

    data: {
      status: "SYNCED",
      syncedAt: new Date(),
      lockedAt: null,
      lastError: null,
    },
  });
}

async function markFailed(
  jobs: Awaited<
    ReturnType<typeof claimBatch>
  >,
  error: unknown
) {
  const message =
    error instanceof Error
      ? error.message
      : String(error);

  for (const job of jobs) {
    const attempts =
      job.attempts + 1;

    const retryAt = new Date(
      Date.now() +
        calculateRetryDelay(attempts)
    );

    await prisma.syncOutbox.update({
      where: {
        id: job.id,
      },

      data: {
        status: "FAILED",
        attempts,
        nextAttemptAt: retryAt,
        lockedAt: null,
        lastError: message,
      },
    });
  }
}

async function sendBatch(jobs: Awaited<ReturnType<typeof claimBatch>>) {
  const operations = jobs.map(
    (job) => ({
      operationId: job.id,
      entityType: job.entityType,
      entityId: job.entityId,
      action: job.action,
      payload: job.payload,
    })
  );

  const response = await fetch(
    `${CENTRAL_API_URL}/api/sync/sync-batch`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        ...(SYNC_TOKEN
          ? {
              Authorization:
                `Bearer ${SYNC_TOKEN}`,
            }
          : {}),
      },

      body: JSON.stringify({
        nodeId: SYNC_NODE_ID,
        operations,
      }),
    }
  );

  if (!response.ok) {
    const body =
      await response.text();

    throw new Error(
      `Central API returned ${response.status}: ${body}`
    );
  }

  const result = await response.json();

  return result;
}

async function runOnce() {
  await recoverStaleJobs();

  const jobs = await claimBatch();

  if (jobs.length === 0) {
    return false;
  }

  try {
    const response =
      await sendBatch(jobs);

    console.log(
      `Synced ${jobs.length} operation(s)`,
      response
    );

    await markSynced(
      jobs.map((job) => job.id)
    );
  } catch (error) {
    console.error(
      "Sync batch failed:",
      error
    );

    await markFailed(
      jobs,
      error
    );
  }

  return true;
}

async function startWorker() {
  console.log(
    `Sync worker started: ${SYNC_NODE_ID}`
  );

  while (true) {
    try {
      const processed =
        await runOnce();

      if (!processed) {
        await sleep(
          POLL_INTERVAL
        );
      }
    } catch (error) {
      console.error(
        "Worker error:",
        error
      );

      await sleep(
        POLL_INTERVAL
      );
    }
  }
}

async function shutdown() {
  console.log(
    "Stopping sync worker..."
  );

  await prisma.$disconnect();

  process.exit(0);
}

process.on(
  "SIGTERM",
  shutdown
);

process.on(
  "SIGINT",
  shutdown
);

startWorker().catch(
  async (error) => {
    console.error(
      "Fatal sync worker error:",
      error
    );

    await prisma.$disconnect();

    process.exit(1);
  }
);