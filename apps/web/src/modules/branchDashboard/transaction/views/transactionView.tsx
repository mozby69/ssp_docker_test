'use client';
import Modal from "@/components/common/ModalHeader";
import { useDisclosure } from "@/hooks/useDisclosure";
import AddTransactionModal from "../components/modal/AddTransactionModal";
import {  TransactionResponse, UpdateTransactionSchema, type TransactionSchema } from "@repo/shared";
import { AppToast } from "@/lib/toast";
import { useCreateTrasanction, useDeleteTransaction, useEditTransaction, useGetTransaction } from "../hooks/useAddTransaction";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebaounce";
import { Table, TableColumn } from "@/components/common/Table";
import SweetAlert from "@/lib/alerts/alert";


export default function TransactionView(){
    const userModal = useDisclosure();
    const { mutateAsync: createTransaction } = useCreateTrasanction();
     const { mutateAsync: deleteTransaction } = useDeleteTransaction();
    const [userPage, setUserPage] = useState(1);
    const [userLimit, setUserLimit] = useState(10);
    const [userSearch, setUserSearch] = useState("");
    const debouncedSearch = useDebounce(userSearch, 500);
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionResponse | null>(null);
    const { mutateAsync: updateTransac } = useEditTransaction();

    const transactionQuery = useGetTransaction({
        page: userPage,
        limit: userLimit,
        search: debouncedSearch,
    });

    const transaction_data = transactionQuery.data?.data ?? [];
        
   const columns: TableColumn<TransactionResponse>[] = [
    {
        key: "firstname",
        header: "Firstname",
        render: (transaction) => transaction.firstname,
    },
    {
        key: "lastname",
        header: "Lastname",
        render: (transaction) => transaction.lastname,
    },
    {
        key: "loan_amount",
        header: "Loan Amount",
        render: (transaction) => transaction.loan_amount,
    },
    {
        key: "term",
        header: "Term",
        render: (transaction) => transaction.term,
    },
    {
        key: "processing_fee",
        header: "Processing Fee",
        render: (transaction) => transaction.processing_fee,
    },
    ];
                    

    const openModal = () => {
        userModal.open();
        setSelectedTransaction(null);
    }

    const closeModal = () => {
        userModal.close();
        setSelectedTransaction(null);
    }

        async function handleCreateTransaction(data: TransactionSchema){
          try{
              await createTransaction(data);
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


    function handleEdit(data: TransactionResponse) {
    setSelectedTransaction(data);
    userModal.open();
    }


    async function handleUpdateTransactionData(data:UpdateTransactionSchema){
        if(!selectedTransaction) return;
        try{
            await updateTransac({id: selectedTransaction?.id, data});
                userModal.close();
                setSelectedTransaction(null);
                SweetAlert.successAlert('Success',"update successfully");
        }
        catch(error){
            SweetAlert.errorAlert(`Failed","failed to update ${error}`);
        }
    }



      async function handleDelete(data: UpdateTransactionSchema) {
        SweetAlert.confirmationAlert(
            "Are you sure you want to delete?",
            "This will delete the transaction data.",
            async () => {
            try {
                await deleteTransaction(data.id);
                SweetAlert.successAlert(
                "Success",
                "Transaction deleted successfully"
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
    
    return(
        <div className="p-4">


            <div className="flex justify-between">
                <button 
                onClick={openModal}
                className="bg-green-700 hover:bg-green-500 text-white px-8 py-2.5 rounded"
                type="button">Add Transaction</button>

                <div className="font-bold text-2xl text-slate-700">
                    version 1.0.2
                </div>
            </div>
 
  

        

       
            <Modal onClose={closeModal} isOpen={userModal.isOpen} title={selectedTransaction ? "edit transaction" : "add transaction"} size="lg">
                <div>
                    <AddTransactionModal onCreate={handleCreateTransaction} onUpdate={handleUpdateTransactionData} mode={selectedTransaction ? "edit" : "add"} transacData={selectedTransaction}/>
       
                </div>
            </Modal>


            <div className="mt-8">
            
                        <Table<TransactionResponse>
                            title="Transaction List"
                            description="Manage system transaction list."
                            columns={columns}
                            data={transaction_data}
                            isLoading={transactionQuery.isLoading}
                            search={userSearch}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onSearchChange={handleUserSearchChange}
                            searchPlaceholder="Search users..."
                            limit={userLimit}
                            onLimitChange={handleUserLimitChange}
                            limitOptions={[5,10, 25, 50, 100]}
                            pagination={transactionQuery.data?.pagination}
                            onPageChange={setUserPage}
                            emptyMessage="No users found."  
                            rowKey={(user) => user.id}
                        />
            
                        </div>

        </div>
    );
}