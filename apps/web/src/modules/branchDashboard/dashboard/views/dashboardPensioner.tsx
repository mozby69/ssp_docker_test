"use client"

import Modal from "@/components/common/ModalHeader"
import { Table, TableColumn } from "@/components/common/Table";
import { useDebounce } from "@/hooks/useDebaounce";
import { useDisclosure } from "@/hooks/useDisclosure"
import { AppToast } from "@/lib/toast";
import BranchModalDashboard from "../components/modal/add";
import { useCreatePensioner ,useDeletePensioner,useEditPensioner,useGetPensioner} from "../hooks/useAddDashboard";
import {  PensionerSchema, UpdatePensionerSchema } from "@repo/shared";
import { useState } from "react";
import SweetAlert from "@/lib/alerts/alert";




export default function DashboardPesionerView() {
    const { mutateAsync: createPensioner } = useCreatePensioner();
    const { mutateAsync: deletePensioner } = useDeletePensioner();
    const userModal = useDisclosure();
    const [userPage, setUserPage] = useState(1);
    const [userLimit, setUserLimit] = useState(10);
    const [userSearch, setUserSearch] = useState("");
    const debouncedSearch = useDebounce(userSearch, 500);
    const [selectedTransaction, setSelectedTransaction] = useState<UpdatePensionerSchema | null>(null);
    const { mutateAsync: updatePensioner } = useEditPensioner();


    const openModal = () => {
        userModal.open();
        setSelectedTransaction(null);
    }

    const closeModal = () => {
        userModal.close();
    }

  
    async function handleCreatePensioner(data: PensionerSchema){
      try{
          await createPensioner(data);
          AppToast.success('success');
          userModal.close();
      }
      catch(error){
        console.log(`error ${error}`);
      }
    }


    function handleUserSearchChange(value: string) {
        setUserSearch(value);
        setUserPage(1);
    }

    function handleUserLimitChange(limit: number) {
        setUserLimit(limit);
        setUserPage(1);
    }

    function handleEdit (data:UpdatePensionerSchema) {
        setSelectedTransaction(data);
        userModal.open()
    }


    async function handleDelete(data: UpdatePensionerSchema) {
    SweetAlert.confirmationAlert(
        "Are you sure you want to delete?",
        "This will delete the pensioner data.",
        async () => {
        try {
            await deletePensioner(data.id);
            SweetAlert.successAlert(
            "Success",
            "Pensioner deleted successfully"
            );
        } catch (error) {
            SweetAlert.errorAlert(
            "Failed",
            `Failed to delete pensioner ${error}`
            );
        }
        }
    );
    }

    async function handleUpdatePensionerData(data:UpdatePensionerSchema){
        if(!selectedTransaction) return;
        try{
            await updatePensioner({id: selectedTransaction?.id, data});
                userModal.close();
                setSelectedTransaction(null);
                SweetAlert.successAlert('Success',"update successfully");
        }
        catch(error){
            SweetAlert.errorAlert(`Failed","failed to update ${error}`);
        }
    }

    
        const pensionerQuery = useGetPensioner({
            page: userPage,
            limit: userLimit,
            search: debouncedSearch,
        });
    
        const pensioner_data = pensionerQuery.data?.data ?? [];



         const columns: TableColumn<UpdatePensionerSchema>[] = [
                {
                    key: "firstname",
                    header: "Firstname",
                    render: (user) => user.firstname,
                },
                {
                    key: "lastname",
                    header: "Lastname",
                    render: (user) => user.lastname,
                },
                {
                    key: "age",
                    header: "Age",
                    render: (user) => user.age ?? "-",
                },
                {
                    key: "loan_amount",
                    header: "Loan Amount",
                    render: (user) => user.loan_amount,
                },
                {
                    key: "loan_type",
                    header: "Loan Type",
                    render: (user) => user.loan_type,
                },
            ];
        

    return (
        <div className="p-4">
        

            <div className="flex justify-between">
                <button 
                className="bg-green-700 hover:bg-green-500 text-white px-8 py-2.5 rounded"
                type="button" onClick={openModal}>Add Pensioner</button>

                <div>
                    <h2 className="text-red-800 font-bold text-2xl shadow">1.0.2</h2>
                </div>
            </div>
 
  

        
            <Modal onClose={closeModal} isOpen={userModal.isOpen} title={selectedTransaction ? "edit transaction" : "add transaction"} size="lg">
                <div>
                <BranchModalDashboard onCreate={handleCreatePensioner} onUpdate={handleUpdatePensionerData} mode={selectedTransaction ? "edit" : "add"} pensionerData={selectedTransaction}/>
                </div>
            </Modal>


            <div className="mt-8">

            <Table<UpdatePensionerSchema>
                title="Users"
                description="Manage system users and assigned roles."
                columns={columns}
                data={pensioner_data}
                isLoading={pensionerQuery.isLoading}
                search={userSearch}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSearchChange={handleUserSearchChange}
                searchPlaceholder="Search users..."
                limit={userLimit}
                onLimitChange={handleUserLimitChange}
                limitOptions={[5,10, 25, 50, 100]}
                pagination={pensionerQuery.data?.pagination}
                onPageChange={setUserPage}
                emptyMessage="No users found."  
                rowKey={(user) => user.id}
            />

            </div>
        


            

        </div>




    )
}



