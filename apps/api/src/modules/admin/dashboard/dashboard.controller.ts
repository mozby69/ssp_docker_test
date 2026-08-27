import type { NextFunction, Request, Response } from "express";

import { sendSuccess } from "@/lib/http/response";
import * as dashboardService from "./dashboard.service";
import {updateTransactionSchema,addTransanctionSchema, type TransactionSchema} from "@repo/shared";

export async function getDashboardController(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const dashboard =
            await dashboardService.getDashboard();

        sendSuccess(res, dashboard);
    } catch (error) {
        next(error);
    }
}




export async function createPensionerController(req:Request,res:Response){
    try{
        const data = await dashboardService.createPensioner(req.body);
          sendSuccess(res, data)
    }
    catch(error){
        console.error(`error occure in controller ${error}`);
    }
}



export async function getPensionerController(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const result = await dashboardService.getPensioners({
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,

            search:
                typeof req.query.search === "string"
                    ? req.query.search.trim()
                    : undefined,

            role:
                typeof req.query.role === "string"
                    ? req.query.role
                    : undefined,

            status:
                typeof req.query.status === "string"
                    ? req.query.status
                    : undefined,

            sort:
                typeof req.query.sort === "string"
                    ? req.query.sort
                    : undefined,
        });

        sendSuccess(res, result.data,{
            pagination: result.pagination,
        });
    } catch (error) {
        next(error);
    }
}



export async function addTransactionController(
  req: Request,
  res: Response
) {
  try {
    const params = addTransanctionSchema.parse(req.body);

    const data =
      await dashboardService.addTransaction(
        params
      );

    return sendSuccess(res, data, {
      statusCode: 201,
      message:
        "Transaction added successfully",
    });
  } catch (error) {
    console.error(
      "Error occurred in addTransactionController:",
      error
    );

    // return sendError(
    //   res,
    //   "Failed to add transaction",
    //   500
    // );
  }
}



export async function searchPensionersController(req: Request, res: Response) {
  try {
    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const pensioners = await dashboardService.searchPensionersService(search);

    return res.status(200).json({
      success: true,
      data: pensioners,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve pensioners",
    });
  }
}




export async function updatePensionerController(req:Request,res:Response){
    try{
        const data = await dashboardService.updatePensioner(Number(req.params.id), req.body);
          console.log('con',data);
          sendSuccess(res, data)
    }
    catch(error){
        console.error(`error occure in controller ${error}`);
    }
}

export async function deletePensionerController(req:Request, res:Response){
  try{
     const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid pensioner ID",
      });
    }
      const data = await dashboardService.deletePensioner(id);
      sendSuccess(res,data);
  } 
  catch(error){ 
    console.log(`error occured ${error}`);
  }
}





export async function getTransactionController(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const result = await dashboardService.getTransaction({
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,

            search:
                typeof req.query.search === "string"
                    ? req.query.search.trim()
                    : undefined,

            role:
                typeof req.query.role === "string"
                    ? req.query.role
                    : undefined,

            status:
                typeof req.query.status === "string"
                    ? req.query.status
                    : undefined,

            sort:
                typeof req.query.sort === "string"
                    ? req.query.sort
                    : undefined,
        });

        sendSuccess(res, result.data,{
            pagination: result.pagination,
        });
    } catch (error) {
        next(error);
    }
}



export async function updateTransactionController(req:Request,res:Response){
    try{
        const data = await dashboardService.updateTransactionService(Number(req.params.id), req.body);
          sendSuccess(res, data)
    }
    catch(error){
        console.error(`error occure in controller ${error}`);
    }
}



export async function deleteTransactionController(req:Request, res:Response){
  try{
     const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid pensioner ID",
      });
    }
      const data = await dashboardService.deleteTransactionService(id);
      sendSuccess(res,data);
  } 
  catch(error){ 
    console.log(`error occured ${error}`);
  }
}
