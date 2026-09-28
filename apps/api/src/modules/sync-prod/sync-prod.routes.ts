import * as syncControler from "./sync-prod.controller";
import { Router } from "express";

import { authenticate } from "@/middleware/authenticate.middleware";
import { syncAuthenticate } from "@/middleware/sync-auth.middleware";


const router = Router();






router.post("/sync-batch",syncAuthenticate,syncControler.syncBatchController);

export default router;