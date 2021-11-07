/** load required packages */
import { Request, Response } from "express";

/** load peer modules and services */
import { apiResponse } from "../helpers/apiResponse";
import { PerkModel } from "../models/perk";

const getAllPerks = async (req: Request, res: Response) => {
  try {
    const perkList = await PerkModel.find({});
    return apiResponse.successResponseWithData(
      res,
      "Operation success",
      perkList
    );
  } catch (e) {
    return apiResponse.ErrorResponse(res, (e as Error).message);
  }
};

const getOnePerk = async (req: Request, res: Response) => {
  try {
    const perk = await PerkModel.findById(req.params.id);
    if (perk)
      return apiResponse.successResponseWithData(
        res,
        "Operation success",
        perk
      );
    return apiResponse.notFoundResponse(res, "Perk not found");
  } catch (e) {
    return apiResponse.ErrorResponse(res, (e as Error).message);
  }
};

const register = async (req: Request, res: Response) => {
  const { shop, type, value } = req.body;
  try {
    const perk = new PerkModel({
      shop,
      type,
      value,
    });
    const newPerk = await perk.save();
    return apiResponse.successResponseWithData(
      res,
      "Operation success",
      newPerk
    );
  } catch (e) {
    return apiResponse.ErrorResponse(res, (e as Error).message);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const perk = await PerkModel.findByIdAndUpdate(req.params.id, req.body);
    if (perk) {
      return apiResponse.successResponseWithData(
        res,
        "Operation success",
        perk
      );
    }
    return apiResponse.notFoundResponse(res, "Perk not found");
  } catch (e) {
    return apiResponse.ErrorResponse(res, (e as Error).message);
  }
};

const deletePerk = async (req: Request, res: Response) => {
  try {
    const perk = await PerkModel.findByIdAndDelete(req.params.id);
    if (perk) return apiResponse.successResponse(res, "Perk delete Success.");
    return apiResponse.notFoundResponse(res, "Perk not found");
  } catch (e) {
    return apiResponse.ErrorResponse(res, (e as Error).message);
  }
};

export const perk = { getAllPerks, getOnePerk, register, update, deletePerk };
