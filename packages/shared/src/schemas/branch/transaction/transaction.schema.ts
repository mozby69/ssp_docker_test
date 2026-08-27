import z from "zod";

export const addTransanctionSchema = z.object({
    pensioner_id: z.number().min(1,"id is required"),
    term: z.number().min(0,"age is required"),
    loan_amount: z.number().min(0,"loan amount is required"),
    processing_fee: z.number().min(1,"fee is required"),
})


export type TransactionSchema = z.infer<typeof addTransanctionSchema>


export const updateTransactionSchema = z.object({
  id: z.number(),
  term: z.number().min(0, "Term is required"),
  loan_amount: z.number().min(0, "Loan amount is required"),
  processing_fee: z.number().min(1, "Processing fee is required"),
});

export type UpdateTransactionSchema = z.infer<typeof updateTransactionSchema>;