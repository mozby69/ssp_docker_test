"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/config/navigation.config";
import { useAuth } from "@/modules/authentication/hooks/useAuth";

export default function Sidebar() {
    const pathname = usePathname();

    const { user } = useAuth();

    const menu = navigation.filter((item) => {
        // Role check
        if (
            item.roles &&
            !item.roles.some((role) =>
                user?.roles.includes(role)
            )
        ) {
            return false;
        }

        // Permission check
        if (
            item.permissions &&
            !item.permissions.some((permission) =>
                user?.permissions.includes(permission)
            )
        ) {
            return false;
        }

        return true;
    });

    return (
        <aside className="w-64 border-r bg-gray-500" >
            <div className="p-4 font-bold text-lg text-center" >
                Workspace
            </div>

            < nav className="flex flex-col gap-1 px-2" >
                {
                    menu.map((item) => {
                        const Icon = item.icon;

                        const active =
                            pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition
                                    ${active
                                        ? "bg-blue-500 text-white"
                                        : "hover:bg-gray-100"
                                    }`
                                }
                            >
                                <Icon size={18} />

                                <span>{item.title} </span>
                            </Link>
                        );
                    })
                }
            </nav>
        </aside>
    );
}