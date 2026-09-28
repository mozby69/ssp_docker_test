import api from "@/lib/api/api-client";
import { ApiResponse, PensionerSchema, UpdatePensionerSchema } from "@repo/shared";


export const createAddDasbhboardService = async (params: PensionerSchema): Promise<ApiResponse<PensionerSchema>> => {
    const res = await api.post<ApiResponse<PensionerSchema>>(
        "/admin/dashboard/create-pensioner",
        params  
    );

    return res.data;
};


export type Params = {
    search?: string;
};

export const getPensionerService = async (param: Params): Promise< ApiResponse<UpdatePensionerSchema[]>> => {
    const res = await api.get<ApiResponse<UpdatePensionerSchema[]>>
    ("/admin/dashboard/display-pensioner",{
            params: param,
        }
    
    );
    return res.data;
};




export const updatePensionerService = async (id:number,param: UpdatePensionerSchema): Promise<ApiResponse<UpdatePensionerSchema[]>> => {
    const res = await api.patch<ApiResponse<UpdatePensionerSchema[]>>
    (`/admin/dashboard/update-pensioner/${id}`,param);
    return res.data;
};



export async function deletePensionerService(id: number): Promise<ApiResponse<UpdatePensionerSchema>> {
  const res = await api.delete<ApiResponse<UpdatePensionerSchema>
  >(
    `/admin/dashboard/delete-pensioner/${id}`
  );
  return res.data;
}




