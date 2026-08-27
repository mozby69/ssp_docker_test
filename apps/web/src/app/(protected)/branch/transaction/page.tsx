import RoleGuard from "@/components/guards/RoleGuard";
import DashboardPesionerView from "@/modules/branchDashboard/dashboard/views/dashboardPensioner";
import TransactionView from "@/modules/branchDashboard/transaction/views/transactionView";

export default function AccessControlPage() {
    return (
        <RoleGuard roles={["BRANCH"]}>
            <TransactionView />
        </RoleGuard>
    );
}