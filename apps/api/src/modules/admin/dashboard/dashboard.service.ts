import { GetUsersParams } from "../access-control/access-control.service";
import * as dashboardRepository from "./dashboard.repository";

import type {DashboardData,PensionerSchema,TransactionSchema} from "@repo/shared";

export async function getDashboard(): Promise<DashboardData> {
    return dashboardRepository.getDashboardCounts();
}





export async function createPensioner(params: PensionerSchema) {
    const {
        firstname,
        lastname,
        age,
        loan_amount,
        loan_type
    } = params;

    const user = await dashboardRepository.addPensioner({
            firstname,
            lastname,
            age,
            loan_amount,
            loan_type
        });

    return user;
}



export async function getPensioners(params: GetUsersParams) {
    const result = await dashboardRepository.displayPensioner(params);

    const normalized = result.data.map((pen) => ({
        id: pen.id,
        firstname: pen.firstname ?? "",
        lastname: pen.lastname ?? "",
        age: pen.age ?? 0,
        loan_amount: Number(pen.loan_amount ?? 0),
        loan_type: pen.loan_type ?? "",
    }));


    return {
        data: normalized,
        pagination: result.pagination,
    };
}




export async function addTransaction(params: TransactionSchema) {
  return dashboardRepository.addTransaction(params);
}



export async function searchPensionersService(search: string) {
    const searchList = await dashboardRepository.searchPensioner(search);
    return searchList;
}

export async function updatePensioner(id:string, data:PensionerSchema){
    const result = await dashboardRepository.editPensioner(id,data);
    return result;
}

export async function deletePensioner(id:string){
    const result = await dashboardRepository.deletePensioner(id);
    return result;
}





export async function getTransaction(params: GetUsersParams) {
    const result = await dashboardRepository.displayTransaction(params);

    const normalized = result.data.map((pen) => ({
        id: pen.id,
        term: pen.term ?? "",
        loan_amount: pen.loan_amount ?? "",
        processing_fee: pen.processing_fee ?? 0,
        firstname: pen.pensioner.firstname ?? "",
        lastname: pen.pensioner.lastname ?? "",
        pensioner_id: pen.pensioner_id,
    }));


    return {
        data: normalized,
        pagination: result.pagination,
    };
}


export async function updateTransactionService(id:string, data:TransactionSchema){
    const result = await dashboardRepository.editTransaction(id,data);
    return result;
}




export async function deleteTransactionService(id:string){
    const result = await dashboardRepository.deleteTranction(id);
    return result;
}
