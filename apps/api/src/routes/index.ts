import { Router } from 'express';
import authRoutes from "../modules/auth/auth.routes";
import accessControlRoutes from "@/modules/admin/access-control/access-control.routes";
import dashboardRoutes from "@/modules/admin/dashboard/dashboard.routes";
import { authenticate } from '@/middleware/authenticate.middleware';
import syncRoutes from "../modules/sync/sync.routes";


const router = Router();

router.use("/auth", authRoutes);

router.use(
    "/admin/access-control",
    authenticate,
    accessControlRoutes
);

router.use(
    "/admin/dashboard",
    authenticate,
    dashboardRoutes
);

router.use("/sync",authenticate,syncRoutes);

export default router;