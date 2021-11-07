/** load required packages */
import { Request, Response } from "express";

/** load peer modules and services */
import { apiResponse } from "../helpers/apiResponse";
import { ShopModel } from "../models/shop";

const getAllShops = async (req: Request, res: Response) => {
  try {
    const shopList = await ShopModel.find({});
    return apiResponse.successResponseWithData(
      res,
      "Operation success",
      shopList
    );
  } catch (e) {
    return apiResponse.ErrorResponse(res, (e as Error).message);
  }
};

const getOneShop = async (req: Request, res: Response) => {
  try {
    const shop = await ShopModel.findById(req.params.id);
    if (shop)
      return apiResponse.successResponseWithData(
        res,
        "Operation success",
        shop
      );
    return apiResponse.notFoundResponse(res, "Shop not found");
  } catch (e) {
    return apiResponse.ErrorResponse(res, (e as Error).message);
  }
};

const register = async (req: Request, res: Response) => {
  const { name, email, avatar, password, phoneNum, address, balance } =
    req.body;
  try {
    const customId = `${phoneNum}@glocal`;
    const shop = new ShopModel({
      name,
      email,
      avatar,
      password,
      phoneNum,
      address,
      balance,
      customId,
    });
    const newShop = await shop.save();
    return apiResponse.successResponseWithData(
      res,
      "Operation success",
      newShop
    );
  } catch (e) {
    return apiResponse.ErrorResponse(res, (e as Error).message);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const shop = await ShopModel.findByIdAndUpdate(req.params.id, req.body);
    if (shop) {
      return apiResponse.successResponseWithData(
        res,
        "Operation success",
        shop
      );
    }
    return apiResponse.notFoundResponse(res, "Shop not found");
  } catch (e) {
    return apiResponse.ErrorResponse(res, (e as Error).message);
  }
};

const deleteShop = async (req: Request, res: Response) => {
  try {
    const shop = await ShopModel.findByIdAndDelete(req.params.id);
    if (shop) return apiResponse.successResponse(res, "Shop delete Success.");
    return apiResponse.notFoundResponse(res, "Shop not found");
  } catch (e) {
    return apiResponse.ErrorResponse(res, (e as Error).message);
  }
};

export const shop = { getAllShops, getOneShop, register, update, deleteShop };
