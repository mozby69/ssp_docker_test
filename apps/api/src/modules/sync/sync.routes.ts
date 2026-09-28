import * as syncControler from "./sync.controller";
import { Router } from "express";

import { authenticate } from "@/middleware/authenticate.middleware";


const router = Router();

router.use(authenticate);




router.post('/sync-batch',syncControler.syncBatchController);

export default router;