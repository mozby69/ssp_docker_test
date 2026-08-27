import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAddDasbhboardService, deletePensionerService, getPensionerService, updatePensionerService } from "../services/addDasboard.service";
import { ApiResponse, UpdatePensionerSchema } from "@repo/shared";
import { UserQueryParams } from "@/modules/admin/access-control/hooks/useAccessControl";






export function useCreatePensioner() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createAddDasbhboardService,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["pensioner-display"],
            });
        },
    });
}



export function useGetPensioner(param: UserQueryParams) {
    return useQuery<ApiResponse<UpdatePensionerSchema[]>>({
        queryKey: ["pensioner-display", param],
        queryFn: () => getPensionerService(param),
    });
}



export function useEditPensioner() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,data,
        }:{
            id:number;
            data: UpdatePensionerSchema;
        }) => updatePensionerService(id,data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["pensioner-display"],
            });
        },
    });
}

export function useDeletePensioner(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:(id:number) => 
            deletePensionerService(id),

          onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["pensioner-display"],
            });
        },
    })
}