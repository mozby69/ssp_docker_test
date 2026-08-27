import {
    LayoutDashboard,
    Users,
    Truck,
    ClipboardList,
    Settings,
    FileArchive
} from "lucide-react";

import { NavigationItem } from "@/types/navigation.types";
import { ROUTES } from "@/constants/route.constants";

export const navigation: NavigationItem[] = [
    {
        title: "Management",
        href: ROUTES.ADMIN.ACCESS_CONTROL,
        icon: LayoutDashboard,
        roles: ["ADMIN"],
    },
    {
        title: "Dashboard",
        href: ROUTES.ADMIN.DASHBOARD,
        icon: ClipboardList,
        roles: ["ADMIN"],
    },
    {
        title: "Users",
        href: ROUTES.UNAUTHORIZED, // temporary
        icon: Users,
        roles: ["USER"],
    },
    {
        title: "Settings",
        href: ROUTES.UNAUTHORIZED, // temporary
        icon: Settings,
        roles: ["SUPER_ADMIN"],
    },
    {
        title: "Add Transaction",
        href: ROUTES.BRANCH.TRANSACTION, // temporary
        icon: Settings,
        roles: ["BRANCH"],
    },
     {
        title: "Add Pensioner",
        href: ROUTES.BRANCH.DASHBOARD, // temporary
        icon: FileArchive,
        roles: ["BRANCH"],
    },
];