import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAddTrasanctionService, deleteTransactionService, getTransactionService, searchPensionersService, updateTransactionService } from "../services/addTransaction";
import { UserQueryParams } from "@/modules/admin/access-control/hooks/useAccessControl";
import { ApiResponse, TransactionResponse, UpdateTransactionSchema } from "@repo/shared";




export function useCreateTrasanction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createAddTrasanctionService,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["transaction-display"],
            });
        },
    });
}



export function useSearchPensioners(search: string) {
  return useQuery({
    queryKey: [
      "pensioners",
      "search",
      search,
    ],

    queryFn: () =>
      searchPensionersService(search),

    staleTime: 30_000,
  });
}



export function useGetTransaction(param: UserQueryParams) {
    return useQuery<ApiResponse<TransactionResponse[]>>({
        queryKey: ["transaction-display", param],
        queryFn: () => getTransactionService(param),
    });
}



export function useEditTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,data,
        }:{
            id:number;
            data: UpdateTransactionSchema;
        }) => updateTransactionService(id,data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["transaction-display"],
            });
        },
    });
}


export function useDeleteTransaction(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:(id:number) => 
            deleteTransactionService(id),

          onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["transaction-display"],
            });
        },
    })
}