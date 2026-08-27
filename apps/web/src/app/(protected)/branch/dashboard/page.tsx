import RoleGuard from "@/components/guards/RoleGuard";
import DashboardPesionerView from "@/modules/branchDashboard/dashboard/views/dashboardPensioner";

export default function AccessControlPage() {
    return (
        <RoleGuard roles={["BRANCH"]}>
            <DashboardPesionerView />
        </RoleGuard>
    );
}