import api from "@/lib/api/api-client";
import { ApiResponse, TransactionResponse, TransactionSchema, UpdatePensionerSchema, UpdateTransactionSchema } from "@repo/shared";
import { Params } from "../../dashboard/services/addDasboard.service";



export const createAddTrasanctionService = async (params: TransactionSchema): Promise<ApiResponse<TransactionSchema>> => {
    const res = await api.post<ApiResponse<TransactionSchema>>(
        "/admin/dashboard/add-transaction",params);
    return res.data;
};


type PensionerSearchResponse = {
  success: boolean;
  data: UpdatePensionerSchema[];
};

export async function searchPensionersService(search: string): Promise<UpdatePensionerSchema[]> {
  const response = await api.get<PensionerSearchResponse>(
      "/admin/dashboard/search-pensioner",
      {
        params: {
          search,
        },
      }
    );

  return response.data.data;
}




export const getTransactionService = async (param: Params): Promise<ApiResponse<TransactionResponse[]>> => {
    const res = await api.get<ApiResponse<TransactionResponse[]>>
    ("/admin/dashboard/display-transaction",{
            params: param,
        }
    
    );
    return res.data;
};



export const updateTransactionService = async (id:number,param: UpdateTransactionSchema): Promise<ApiResponse<UpdateTransactionSchema[]>> => {
    const res = await api.patch<ApiResponse<UpdateTransactionSchema[]>>
    (`/admin/dashboard/update-transaction/${id}`,param);
    return res.data;
};



export async function deleteTransactionService(id: number): Promise<ApiResponse<UpdateTransactionSchema>> {
  const res = await api.delete<ApiResponse<UpdateTransactionSchema>
  >(
    `/admin/dashboard/delete-transaction/${id}`
  );
  return res.data;
}