import { Router } from "express";

import { authenticate } from "@/middleware/authenticate.middleware";
import { authorize } from "@/middleware/authorize.middleware";

import { addTransactionController, createPensionerController, deletePensionerController, deleteTransactionController, getDashboardController, getPensionerController, getTransactionController, searchPensionersController, updatePensionerController, updateTransactionController, } from "./dashboard.controller";

const router = Router();

router.use(authenticate);

router.get(
    "/",
    authorize({
        roles: ["ADMIN"],
    }),
    getDashboardController
);

router.post('/create-pensioner',authorize({roles:["ADMIN","BRANCH"]}),createPensionerController);
router.get("/display-pensioner", authorize({ roles: ["BRANCH"]}), getPensionerController);
router.post('/add-transaction',authorize({roles:["BRANCH"]}),addTransactionController);
router.get("/search-pensioner",authorize({roles:["BRANCH"]}),searchPensionersController);
router.patch('/update-pensioner/:id',authorize({roles:["BRANCH"]}),updatePensionerController);
router.delete('/delete-pensioner/:id',authorize({roles:["BRANCH"]}),deletePensionerController);
router.get("/display-transaction",authorize({roles:["BRANCH"]}), getTransactionController);
router.patch('/update-transaction/:id',authorize({roles:["BRANCH"]}),updateTransactionController);
router.delete('/delete-transaction/:id',authorize({roles:["BRANCH"]}),deleteTransactionController);

export default router;