import FormInput from "@/components/common/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { addTransanctionSchema, TransactionFormValues, TransactionResponse, UpdateTransactionSchema, type TransactionSchema } from "@repo/shared";
import { useForm } from "react-hook-form";
import { PensionerSelect } from "../form/PensionerSelect ";
import { useEffect } from "react";



interface Props{
    onCreate?: (data: TransactionSchema) => void;
    onUpdate?: (data: UpdateTransactionSchema) => void;
    mode: "add" | "edit";
    transacData: TransactionResponse | null;
}

export default function AddTransactionModal({
  onCreate,
  mode,
  transacData,
  onUpdate,
}: Props) {
  const isEdit = mode === "edit";

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<TransactionSchema>({
    resolver: zodResolver(addTransanctionSchema),
    defaultValues: {
      pensioner_id: "",
      term: 0,
      loan_amount: 0,
      processing_fee: 0,
    },
  });

  useEffect(() => {
    if (isEdit && transacData) {
      reset({
        pensioner_id: transacData.pensioner_id,
        term: transacData.term,
        loan_amount: transacData.loan_amount,
        processing_fee: transacData.processing_fee,
      });

      return;
    }

    reset({
      pensioner_id: "",
      term: 0,
      loan_amount: 0,
      processing_fee: 0,
    });
  }, [isEdit, transacData, reset]);

  const onSubmit = (data: TransactionFormValues) => {
    if (isEdit && transacData) {
      onUpdate?.({
        id: transacData.id,
        term: data.term,
        loan_amount: data.loan_amount,
        processing_fee: data.processing_fee,
      });

      return;
    }

    onCreate?.({
      pensioner_id: data.pensioner_id,
      term: data.term,
      loan_amount: data.loan_amount,
      processing_fee: data.processing_fee,
    });
  };


    return(
        <div>

     <form onSubmit={handleSubmit(onSubmit)}  className="space-y-4">
        
        <div className="grid grid-cols-3 gap-4">
         {isEdit && transacData ? (
          <div>
            <label className="mb-1 block text-sm text-gray-700">
              Pensioner ID
            </label>

            <input
              type="text"
              value={transacData.pensioner_id}
              readOnly
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-700"
            />
          </div>
        ) : (
          <PensionerSelect
            name="pensioner_id"
            label="Pensioner"
            control={control}
          />
        )}
        
          <FormInput
            name="term"
            label="Term"
            control={control}
            type="number"
            placeholder="Enter term"
          />
    
          <FormInput
            name="loan_amount"
            label="Loan Amount"
            control={control}
            type="number"
            placeholder="Enter loan amount"
          />
    
           <FormInput
            name="processing_fee"
            label="Processing fee"
            control={control}
            type="number"
            placeholder="Enter processing fee"
          />
            </div>
    
          <button type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white">
            Save
          </button>
    
    
        </form>

        </div>
    );
}