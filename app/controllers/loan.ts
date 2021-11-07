/** load required packages */
import { Request, Response } from "express";

/** load peer modules and services */
import { apiResponse } from "../helpers/apiResponse";
import { LoanModel, Loan as LoanInterface } from "../models/loan";
import { LoanUserModel } from "../models/loanUser";
import { ShopModel } from "../models/shop";
import { UserModel } from "../models/user";

const getAllLoans = async (req: Request, res: Response) => {
  try {
    const loans: LoanInterface[] = await LoanModel.find().limit(100);
    if (!loans) {
      apiResponse.notFoundResponse(res, "No loans found");
      return;
    }
    apiResponse.successResponseWithData(res, "Operation success", loans);
  } catch (e) {
    apiResponse.ErrorResponse(res, (e as Error).message);
  }
};

const getOneLoan = async (req: Request, res: Response) => {
  try {
    const loan = await LoanModel.find(req.body);
    if (!loan) {
      apiResponse.notFoundResponse(res, "No loans found");
      return;
    }
    apiResponse.successResponseWithData(res, "Operation success", loan);
  } catch (e) {
    apiResponse.ErrorResponse(res, (e as Error).message);
  }
};

const register = async (req: Request, res: Response) => {
  try {
    const { shop, amount, duration } = req.body;
    const status = "unpaid";
    const Shop = await ShopModel.findById(shop);
    if (!Shop) {
      apiResponse.notFoundResponse(res, "Shop not found!");
      return;
    }
    if (Shop.activeLoans >= 2) {
      apiResponse.ErrorResponse(
        res,
        "Loan limit exceeded. Cannot have more than 2 active loans"
      );
      return;
    }
    const shopName = Shop.name;
    const shopCustomId = Shop.customId;
    const shopNumber = Shop.phoneNum;
    const loan: LoanInterface = await LoanModel.create({
      status,
      shop,
      amount,
      shopName,
      shopCustomId,
      shopNumber,
      duration,
    });
    if (!loan) {
      apiResponse.ErrorResponse(
        res,
        "Request cannot be processed. Please recheck fields!"
      );
      return;
    }
    Shop.activeLoans += 1;
    Shop.totalLoanAmount += parseInt(amount, 10);
    Shop.totalLoans += 1;
    Shop.loans.push(loan._id);
    await Shop.save();
    apiResponse.successResponseWithData(res, "Loan created successfully", loan);
  } catch (e) {
    apiResponse.ErrorResponse(res, (e as Error).message);
  }
};

const userLoan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const Loan = await LoanModel.findById(id);
    if (!Loan) {
      apiResponse.notFoundResponse(res, "No loans found");
      return;
    }
    const { userId, amountLoaned } = req.body;
    if (Loan.amount - Loan.amountLoaned < amountLoaned) {
      apiResponse.ErrorResponse(
        res,
        "Request cannot be processed. Please recheck fields!"
      );
      return;
    }
    const User = await UserModel.findById(userId);
    if (!User) {
      apiResponse.ErrorResponse(
        res,
        "Request cannot be processed. Please recheck fields!"
      );
      return;
    }
    if (amountLoaned > User.balance) {
      apiResponse.ErrorResponse(
        res,
        "Transaction cancelled due to insufficent funds"
      );
      return;
    }
    const Shop = await ShopModel.findById(Loan.shop);
    if (!Shop) {
      apiResponse.ErrorResponse(
        res,
        "Request cannot be processed. Please recheck fields!"
      );
      return;
    }
    const data = {
      status: "unpaid",
      shop: Loan.shop,
      user: userId,
      amountLoaned,
      userName: User.name,
      shopName: Shop.name,
      userCutomId: User.customId,
      shopCustomId: Shop.customId,
      userNumber: User.phoneNum,
      shopNumber: Shop.phoneNum,
      loan: Loan._id,
      duration: Loan.duration,
    };
    const LoanUser = await LoanUserModel.create(data);

    if (!LoanUser) {
      apiResponse.ErrorResponse(
        res,
        "Request cannot be processed. Please recheck fields!"
      );
      return;
    }
    Shop.loanUnpaidAmount += LoanUser.amountLoaned;
    Shop.balance += LoanUser.amountLoaned;
    await Shop.save();
    Loan.users.push(User._id);
    Loan.amountLoaned += LoanUser.amountLoaned;
    Loan.amountUnpaid += LoanUser.amountLoaned;
    await Loan.save();
    User.loans.push(LoanUser._id);
    User.balance -= LoanUser.amountLoaned;
    User.save();
    apiResponse.successResponseWithData(
      res,
      "Loan updated successfully",
      LoanUser
    );
  } catch (e) {
    apiResponse.ErrorResponse(res, (e as Error).message);
  }
};

const repayLoan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const LoanUser = await LoanUserModel.findById(id);
    if (!LoanUser) {
      apiResponse.ErrorResponse(
        res,
        "Request cannot be processed. Please recheck fields!"
      );
      return;
    }

    const Loan = await LoanModel.findById(LoanUser.loan);
    const Shop = await ShopModel.findById(LoanUser.shop);
    const User = await UserModel.findById(LoanUser.user);

    const { amountLoaned } = LoanUser;
    if (!Shop || !User || (!Shop && !User)) {
      apiResponse.ErrorResponse(
        res,
        "Request cannot be processed. Please recheck fields!"
      );
      return;
    }
    if (amountLoaned === 0) {
      apiResponse.ErrorResponse(
        res,
        "Request cannot be processed. Please recheck fields!"
      );
      return;
    }
    if (!Loan) {
      apiResponse.ErrorResponse(
        res,
        "Request cannot be processed. Please recheck fields!"
      );
      return;
    }
    // deduct amount from shop
    if (Shop.balance < amountLoaned) {
      apiResponse.ErrorResponse(
        res,
        "Transaction cancelled due to insufficent funds"
      );
      return;
    }
    Shop.balance -= amountLoaned;
    User.balance += amountLoaned;
    Shop.loanUnpaidAmount -= amountLoaned;
    Loan.amountUnpaid -= amountLoaned;
    if (Loan.amountUnpaid === 0 && Loan.amountLoaned === Loan.amount) {
      Loan.status = "paid";
    }
    LoanUser.status = "paid";

    await LoanUser.save();

    await Shop.save();

    await Loan.save();

    await User.save();

    apiResponse.successResponseWithData(
      res,
      "Succesfully repayed loan",
      LoanUser
    );
    return;
  } catch (e) {
    apiResponse.ErrorResponse(res, (e as Error).message);
  }
};

const deleteLoan = async (req: Request, res: Response) => {
  try {
    // Delete user
    // return apiResponse.successResponse(res, "User delete Success.");
    res.send("Hi!");
  } catch (e) {
    apiResponse.ErrorResponse(res, (e as Error).message);
  }
};

export const loan = {
  getAllLoans,
  getOneLoan,
  register,
  userLoan,
  repayLoan,
  deleteLoan,
};
