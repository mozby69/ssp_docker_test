import z from "zod";

export const createPensionerSchema = z.object({
    firstname: z.string().min(1,"firstname is required"),
    lastname: z.string().min(1,"lastname is required"),
    age: z.number().min(0,"age is required"),
    loan_amount: z.number().min(0,"loan amount is required"),
    loan_type: z.string().min(1,"loan type is required"),
})


export type PensionerSchema = z.infer<typeof createPensionerSchema>

export const updatePensionerSchema = createPensionerSchema.extend({
    id: z.number()
})


export type UpdatePensionerSchema = z.infer<typeof updatePensionerSchema>




