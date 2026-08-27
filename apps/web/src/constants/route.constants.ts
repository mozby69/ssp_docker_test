export const ROUTES = {
    LOGIN: "/login",
    DASHBOARD: "/dashboard",
    UNAUTHORIZED: "/unauthorized",

    ADMIN: {
        DASHBOARD: "/admin/dashboard",
        ACCESS_CONTROL: "/admin/access-control",
    },
    BRANCH: {
        DASHBOARD: "/branch/dashboard",
        ACCESS_CONTROL: "/branch/dashboard",
        TRANSACTION:"/branch/transaction"
    },
} as const;