"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormInput from "@/components/common/FormInput";
import { createPensionerSchema, UpdatePensionerSchema, type PensionerSchema } from "@repo/shared";
import { useEffect } from "react";


interface props{
    onCreate?: (data: PensionerSchema) => void;
    onUpdate?: (data: UpdatePensionerSchema) => void;
    mode: "add" | "edit";
    pensionerData: UpdatePensionerSchema | null;
}

export default function BranchModalDashboard({onCreate,mode,pensionerData,onUpdate}:props) {

  const isEdit = mode === "edit";


  const {control, handleSubmit,reset} = useForm<PensionerSchema>({
    resolver: zodResolver(createPensionerSchema),
    defaultValues: {
      firstname: "",
      lastname:"",
      age: 0,
      loan_amount: 0,
      loan_type:"",
    },
  });

  useEffect(() => {
    if(isEdit && pensionerData){
      reset({
        firstname: pensionerData.firstname,
        lastname: pensionerData.lastname,
        age: pensionerData.age,
        loan_amount: pensionerData.loan_amount,
        loan_type: pensionerData.loan_type,
      });
      return;
    }
    reset({
        firstname: "",
        lastname:  "",
        age:0,
        loan_amount:  0,
        loan_type:  "",
    })
  },[isEdit,pensionerData,reset]);

const onSubmit = (data: PensionerSchema) => {
  if (isEdit && pensionerData) {
    onUpdate?.({
      ...data,
      id: pensionerData.id,
    });

    return;
  }

  onCreate?.(data);
};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
    
    <div className="grid grid-cols-2 gap-x-2">
        <FormInput
        name="firstname"
        label="First Name"
        control={control}
        type="text"
        placeholder="Enter first name"
      />
       <FormInput
        name="lastname"
        label="Last Name"
        control={control}
        type="text"
        placeholder="Enter last name"
      />
    </div>
     

      <FormInput
        name="age"
        label="Age"
        control={control}
        type="number"
        placeholder="Enter age"
      />

      <FormInput
        name="loan_amount"
        label="Loan Amount"
        control={control}
        type="number"
        placeholder="Enter loan amount"
      />

       <FormInput
        name="loan_type"
        label="Loan Type"
        control={control}
        type="text"
        placeholder="Enter loan type"
      />


      <button type="submit"
        className="rounded bg-blue-600 hover:bg-blue-500 hover:cursor-pointer px-4 py-2 text-white">
        Save
      </button>


    </form>
  );
}