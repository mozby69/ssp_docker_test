import { prisma } from "@/lib/database/prisma";
import { FindAllUsersParams } from "../access-control/access-control.types";
import { Prisma } from "../../../../generated/prisma/client";
import { PensionerSchema, type TransactionSchema} from "@repo/shared";


export async function getDashboardCounts() {
    const [
        totalUsers,
        activeUsers,
        totalRoles,
        totalPermissions,
    ] = await prisma.$transaction([
        prisma.user.count(),

        prisma.user.count({
            where: {
                isActive: true,
            },
        }),

        prisma.role.count(),

        prisma.permission.count(),
    ]);

    return {
        totalUsers,
        activeUsers,
        totalRoles,
        totalPermissions,
    };
}




export async function addPensioner(data: {
    firstname: string;
    lastname: string;
    age: number;
    loan_amount:number;
    loan_type:string;

}) {
   return prisma.$transaction(async (tx) => {

    const pensioner = await tx.pensionerData.create({
            data: {
                firstname: data.firstname,
                lastname: data.lastname,
                age: data.age,
                loan_amount: data.loan_amount,
                loan_type: data.loan_type,
            },
        });

    await tx.syncOutbox.create({
        data: {
            entityType: "PENSIONER",
            entityId: pensioner.id,
            action: "CREATE",

            payload: {
                id: pensioner.id,
                firstname: pensioner.firstname,
                lastname: pensioner.lastname,
                age: pensioner.age,
                loan_amount: pensioner.loan_amount?.toString(),
                loan_type: pensioner.loan_type,
            },
        },
    });

    return pensioner;
});
}







export async function displayPensioner(params: FindAllUsersParams) {
    const {
        page = 1,
        limit = 10,
        search,
        role,
        status,
        sort,
    } = params;

    const where: Prisma.PensionerDataWhereInput = {};

    if (search?.trim()) {
        where.OR = [
            {
                firstname: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            {
                lastname: {
                    contains: search,
                    mode: "insensitive",
                },
            },
        ];
    }


    const [pensioner, total] =
        await prisma.$transaction([
            prisma.pensionerData.findMany({
                where,
                select: {
                    id: true,
                    firstname: true,
                    lastname: true,
                    age: true,
                    loan_amount: true,
                    loan_type:true,
                },

                skip: (page - 1) * limit,
                take: limit,
              //  orderBy,
            }),

            prisma.pensionerData.count({
                where,
            }),
        ]);

    return {
        data: pensioner,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(
                total / limit
            ),
        },
    };
}








export async function addTransaction(data: {
    pensioner_id: string;
    term: number;
    loan_amount:number;
    processing_fee:number;

}) {
    return prisma.$transaction(async (tx) => {
        const transac = await tx.transactionData.create({

            data: {
                term: data.term,
                loan_amount: data.loan_amount,
                processing_fee: data.processing_fee,

                pensioner:{
                    connect:{
                        id: data.pensioner_id,
                    }
                }
            },
        });

    await tx.syncOutbox.create({
        data: {
            entityType: "TRANSACTION",
            entityId: transac.id,
            action: "CREATE",

            payload: {
                id: transac.id,
                term: transac.term,
                pensioner_id: transac.pensioner_id,
                loan_amount: transac.loan_amount,
                processing_fee: transac.processing_fee,
                pensioner: transac.pensioner_id,
            },
        },
    });

     

        return transac;
    });
}


export async function searchPensioner(search:string){
      const pensionerId = (search);
      return prisma.pensionerData.findMany({
    where: search
      ? {
          OR: [
            ...(Number.isInteger(pensionerId)
              ? [
                  {
                    id: pensionerId,
                  },
                ]
              : []),

            {
              firstname: {
                contains: search,
                mode: "insensitive",
              },
            },

            {
              lastname: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : undefined,

    select: {
      id: true,
      firstname: true,
      lastname: true,
      age: true,
    },

    orderBy: {
      lastname: "asc",
    },

    take: 20,
  });
}




export async function editPensioner(
  id: string,
  data: PensionerSchema
) {
  return prisma.$transaction(async (tx) => {
    const pensioner = await tx.pensionerData.update({
      where: {
        id,
      },
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        age: data.age,
        loan_amount: data.loan_amount,
        loan_type: data.loan_type,
      },
    });

    await tx.syncOutbox.create({
      data: {
        entityType: "PENSIONER",
        entityId: pensioner.id,
        action: "UPDATE",

        payload: {
          id: pensioner.id,
          firstname: pensioner.firstname,
          lastname: pensioner.lastname,
          age: pensioner.age,
          loan_amount: pensioner.loan_amount?.toString(),
          loan_type: pensioner.loan_type,
        },
      },
    });

    return pensioner;
  });
}





export async function deletePensioner(id: string) {
  return prisma.$transaction(async (tx) => {
    const pensioner = await tx.pensionerData.findUnique({
      where: {
        id,
      },
    });

    if (!pensioner) {
      throw new Error("Pensioner not found");
    }

    await tx.syncOutbox.create({
      data: {
        entityType: "PENSIONER",
        entityId: pensioner.id,
        action: "DELETE",

        payload: {
          id: pensioner.id,
        },
      },
    });

    await tx.pensionerData.delete({
      where: {
        id,
      },
    });

    return pensioner;
  });
}




export async function displayTransaction(params: FindAllUsersParams) {
    const {
        page = 1,
        limit = 10,
        search,
        role,
        status,
        sort,
    } = params;

    const where: Prisma.TransactionDataWhereInput = {};

    if (search?.trim()) {
        where.OR = [
            {
                pensioner:{
                    firstname: {
                    contains: search,
                    mode: "insensitive",
                },
                }
                
            },
            {
                   pensioner:{
                    lastname: {
                    contains: search,
                    mode: "insensitive",
                },
                }
            },
        ];
    }


    const [res, total] =
        await prisma.$transaction([
            prisma.transactionData.findMany({
                where,
                select: {
                    id: true,
                    term: true,
                    loan_amount: true,
                    processing_fee:true,
                    pensioner_id: true,
                    pensioner:{
                        select:{
                            firstname:true,
                            lastname:true,
                        }
                    }
                },

                skip: (page - 1) * limit,
                take: limit,
          
            }),

            prisma.transactionData.count({
                where,
            }),
        ]);

    return {
        data: res,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(
                total / limit
            ),
        },
    };
}



export async function editTransaction(id:string,data:TransactionSchema) {
    return prisma.$transaction(async (tx) => {
        const transac_data = await tx.transactionData.update({
            where: {
                id: id
            },
            data:{
                term: data.term,
                loan_amount: data.loan_amount,
                processing_fee: data.processing_fee,
            }
        });

        await tx.syncOutbox.create({
                data: {
                    entityType: "TRANSACTION",
                    entityId: transac_data.id,
                    action: "UPDATE",

                    payload: {
                    id: transac_data.id,
                    term: transac_data.term,
                    loan_amount: transac_data.loan_amount,
                    processing_fee: transac_data.processing_fee,
                    },
                },
                });

        return transac_data;
    });
}



export async function deleteTranction(id: string) {
  return prisma.$transaction(async (tx) => {

    const transaction = await tx.transactionData.findUnique({
        where: {
          id,
        },
      });

    if (!transaction) {
      throw new Error("Transaction not found");
    }


    await tx.syncOutbox.create({
      data: {
        entityType: "TRANSACTION",
        entityId: transaction.id,
        action: "DELETE",

        payload: {
          id: transaction.id,
        },
      },
    });


    await tx.transactionData.delete({
      where: {
        id,
      },
    });

    return transaction;
  });
}

