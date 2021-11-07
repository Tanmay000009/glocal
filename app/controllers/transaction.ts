/** load required packages */
import { Request, Response } from "express";
import { ObjectId } from "mongoose";

/** load peer modules and services */
import { apiResponse } from "../helpers/apiResponse";
import { CashBackModel } from "../models/cashback";
import { PerkModel } from "../models/perk";
import { ShopModel } from "../models/shop";
import { TransactionModel } from "../models/transaction";
import { UserModel, User } from "../models/user";

/** To deposit cashback in users account */
const cashback = async (
  transactionId: ObjectId,
  amount: number,
  uid: string,
  shop: ObjectId,
  user: ObjectId
): Promise<string> => {
  try {
    const transaction = await TransactionModel.findById(transactionId);
    if (!transaction) {
      return "Transaction not found!";
    }
    if (transaction.status !== "cashbackPending") {
      transaction.status = "spam";
      await transaction.save();
      return "Invalid transaction!";
    }
    const dbUser = await UserModel.findById(user);
    if (!dbUser) {
      transaction.status = "spam";
      await transaction.save();
      return "Invalid transaction! ";
    }
    let bal = dbUser.balance;
    bal += transaction.CashbackAmount;
    dbUser.balance = bal;
    await dbUser.save();
    transaction.status = "approved";
    await transaction.save();
    await new CashBackModel({
      amount,
      user,
      uid,
      shop,
    }).save();
    return "success Cashback processed";
  } catch (e) {
    return (e as Error).message;
  }
};

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
  const { uid, amount, shopFeedback, type } = req.body;
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
      amount,
      userName,
      shopName,
      userCutomId,
      shopCustomId,
      userNumber,
      shopNumber,
      shopFeedback,
      type,
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
    const {
      perk,
      feedback,
      discountedAmount,
      CashbackAmount,
      perkValue,
      perkType,
    } = req.body;
    const Perk = await PerkModel.findById(perk);
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
      if (perk && perkType === "discount") {
        if (!Perk) {
          transaction.status = "spam";
          await transaction.save();
          apiResponse.ErrorResponse(res, "Unsuccesful transaction");
          return;
        }
        if (parseInt(perkValue, 10) !== Perk.value) {
          transaction.status = "spam";
          await transaction.save();
          apiResponse.ErrorResponse(res, "Unsuccesful transaction");
          return;
        }
        let discountAmount = (transaction.amount * perkValue) / 100;
        if (discountAmount > Perk.maxValue) discountAmount = Perk.maxValue;
        discountAmount = transaction.amount - discountAmount;
        if (discountAmount !== parseInt(discountedAmount, 10)) {
          transaction.status = "spam";
          await transaction.save();
          apiResponse.ErrorResponse(res, "Unsuccesful transaction");
          return;
        }
        if (user.balance && user.balance >= discountedAmount) {
          user.balance -= discountedAmount;
          await user.save();
          transaction.status = "approved";
          transaction.discountedAmount = discountAmount;
          transaction.perkType = Perk.type;
          transaction.perk = Perk._id;
          transaction.perkValue = Perk.value;
          await transaction.save();
          if (feedback === 1) Perk.feedback1 += 1;
          else if (feedback === 2) Perk.feedback2 += 1;
          else if (feedback === 3) Perk.feedback3 += 1;
          Perk.generatedRevenue += transaction.amount;
          await Perk.save();
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
      if (perk && perkType === "cashback") {
        if (!Perk) {
          transaction.status = "spam";
          await transaction.save();
          apiResponse.ErrorResponse(res, "Unsuccesful transaction");
          return;
        }
        if (parseInt(perkValue, 10) !== Perk.value) {
          transaction.status = "spam";
          await transaction.save();
          apiResponse.ErrorResponse(res, "Unsuccesful transaction");
          return;
        }
        let cashbackAmount = (transaction.amount * perkValue) / 100;
        if (cashbackAmount > Perk.maxValue) cashbackAmount = Perk.maxValue;
        if (cashbackAmount !== parseInt(CashbackAmount, 10)) {
          transaction.status = "spam";
          await transaction.save();
          apiResponse.ErrorResponse(res, "Unsuccesful transaction");
          return;
        }
        if (user.balance && user.balance >= transaction.amount) {
          user.balance -= transaction.amount;
          await user.save();
          transaction.status = "cashbackPending";
          transaction.CashbackAmount = cashbackAmount;
          transaction.perkType = Perk.type;
          transaction.perk = Perk._id;
          transaction.perkValue = Perk.value;
          if (feedback === 1) Perk.feedback1 += 1;
          else if (feedback === 2) Perk.feedback2 += 1;
          else if (feedback === 3) Perk.feedback3 += 1;
          Perk.generatedRevenue += transaction.amount;
          await Perk.save();
          await transaction.save();
          const cashBackRes = await cashback(
            transaction._id,
            transaction.CashbackAmount,
            transaction.uid,
            transaction.shop,
            transaction.user
          );
          if (!cashBackRes.includes("success")) {
            apiResponse.ErrorResponse(res, cashBackRes);
            return;
          }
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
  cashback,
};
