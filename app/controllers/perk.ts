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
  const { shop, type, value, feedback, perkName, maxValue } = req.body;
  try {
    let perkExists = await PerkModel.findOne({
      perkName,
    });
    if (perkExists) {
      apiResponse.ErrorResponse(res, "Duplicate data, perk already exists");
      return;
    }
    perkExists = await PerkModel.findOne({
      type,
      value,
      perkName,
      maxValue,
    });
    if (perkExists) {
      apiResponse.ErrorResponse(res, "Duplicate data, perk already exists");
      return;
    }
    const perk = new PerkModel({
      shop,
      type,
      value,
      feedback,
      perkName,
      maxValue,
    });
    const newPerk = await perk.save();
    apiResponse.successResponseWithData(res, "Operation success", newPerk);
    return;
  } catch (e) {
    apiResponse.ErrorResponse(res, (e as Error).message);
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

const findShopPerk = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const perk: any = await PerkModel.find({ shop: id });
    if (perk)
      return apiResponse.successResponseWithData(res, "Perks found", perk);
    return apiResponse.notFoundResponse(res, "Perk not found");
  } catch (e) {
    return apiResponse.ErrorResponse(res, (e as Error).message);
  }
};

export const perk = {
  getAllPerks,
  getOnePerk,
  register,
  update,
  findShopPerk,
};
