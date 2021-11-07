import { Request, Response } from "express";

import { apiResponse } from "../helpers/apiResponse";
import { CashBackModel } from "../models/cashback";

const getAllCashBacks = async (req: Request, res: Response) => {
  const filters = req.body;
  try {
    const cashBacks = await CashBackModel.find({ filters });
    return apiResponse.successResponseWithData(
      res,
      "Operation success",
      cashBacks
    );
  } catch (e) {
    return apiResponse.ErrorResponse(res, (e as Error).message);
  }
};

export const cashBack = {
  getAllCashBacks,
};
