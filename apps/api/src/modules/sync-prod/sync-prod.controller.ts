import type { NextFunction, Request, Response } from "express";
import { syncBatchSchema, syncOperationSchema } from "@repo/shared";
import { sendSuccess } from "@/lib/http/response";
import * as syncService from "./sync-prod.service";

export async function syncBatchController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const batch = syncBatchSchema.parse(req.body);

    const result =
      await syncService.processSyncBatch(batch);

    sendSuccess(res, result, {
      statusCode: 200,
      message: "Sync batch processed successfully",
    });
  } catch (error) {
    next(error);
  }
}