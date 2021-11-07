/** load required packages */
import { Request, Response } from "express";

/** load peer modules and services */
import { apiResponse } from "../helpers/apiResponse";
import { ShopModel } from "../models/shop";
import { TransactionModel } from "../models/transaction";
import { UserModel, User } from "../models/user";

const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const transactionList = await TransactionModel.find({});
    apiResponse.successResponseWithData(
      res,
      "Operation success",
      transactionList
    );
    return;
  } catch (e) {
    apiResponse.ErrorResponse(res, (e as Error).message);
  }
};

const getOneTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = await TransactionModel.findById(req.params.id);
    if (transaction) {
      apiResponse.successResponseWithData(
        res,
        "Operation success",
        transaction
      );
      return;
    }
    apiResponse.notFoundResponse(res, "Transaction not found");
    return;
  } catch (e) {
    apiResponse.ErrorResponse(res, (e as Error).message);
  }
};

const register = async (req: Request, res: Response) => {
  const { uid, perk, amount, perkValue, shopFeedback } = req.body;
  const shop = req.params.id;
  const status = "unapproved";
  let userProfile: User | null;
  if (uid.includes("@"))
    userProfile = await UserModel.findOne({ userCutomId: uid });
  else userProfile = await UserModel.findOne({ phoneNum: uid });
  if (!userProfile) {
    apiResponse.ErrorResponse(res, "No such user exists");
    return;
  }
  const shopProfile = await ShopModel.findOne({ _id: shop });
  if (!shopProfile) return;
  const shopCustomId = shopProfile.customId;
  const userCutomId = userProfile.customId;
  const user = userProfile._id;
  const userName = userProfile.name;
  const shopName = shopProfile.name;
  const userNumber = userProfile.phoneNum;
  const shopNumber = shopProfile.phoneNum;

  try {
    const transaction = new TransactionModel({
      uid,
      status,
      shop,
      user,
      perk,
      amount,
      perkValue,
      userName,
      shopName,
      userCutomId,
      shopCustomId,
      userNumber,
      shopNumber,
      shopFeedback,
    });
    const newTransaction = await transaction.save();
    apiResponse.successResponseWithData(
      res,
      "Operation success",
      newTransaction
    );
    return;
  } catch (e) {
    apiResponse.ErrorResponse(res, (e as Error).message);
  }
};

const approve = async (req: Request, res: Response) => {
  try {
    const transaction = await TransactionModel.findById(req.params.id);
    if (transaction) {
      const userId = transaction.user;
      const user = await UserModel.findById(userId);
      if (!user) {
        transaction.status = "spam";
        await transaction.save();
        apiResponse.ErrorResponse(res, "Transaction not found");
        return;
      }
      if (
        user.balance &&
        transaction.amount &&
        user.balance >= transaction.amount
      ) {
        user.balance -= transaction.amount;
        await user.save();
        transaction.status = "approved";
        await transaction.save();
        apiResponse.successResponseWithData(
          res,
          "Transaction succesful",
          transaction
        );
        return;
      }
      transaction.status = "unsuccesful";
      await transaction.save();
      apiResponse.successResponseWithData(
        res,
        "Transaction cancelled due to insufficent funds",
        transaction
      );
      return;
    }
    apiResponse.notFoundResponse(res, "Transaction not found");
    return;
  } catch (e) {
    apiResponse.ErrorResponse(res, (e as Error).message);
  }
};

const cancel = async (req: Request, res: Response) => {
  try {
    const transaction = await TransactionModel.findById(req.params.id);
    if (transaction) {
      transaction.status = "unsuccesful";
      await transaction.save();
      apiResponse.successResponseWithData(
        res,
        "Transaction cancelled",
        transaction
      );
      return;
    }
    apiResponse.notFoundResponse(res, "Transaction not found");
    return;
  } catch (e) {
    apiResponse.ErrorResponse(res, (e as Error).message);
  }
};

export const transaction = {
  getAllTransactions,
  getOneTransaction,
  register,
  approve,
  cancel,
};
