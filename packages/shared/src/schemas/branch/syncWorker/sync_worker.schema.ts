import z from "zod";


export const syncOperationSchema = z.object({
    operationId: z.string().uuid(),
    entityType: z.enum(["PENSIONER"]),
    entityId: z.string().uuid(),

    action: z.enum([
        "CREATE",
        "UPDATE",
        "DELETE",
    ]),

    payload: z.unknown(),
});