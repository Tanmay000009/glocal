/** load required packages */
import { hash } from "bcryptjs";
import { Request, Response } from "express";

/** load peer modules and services */
import { apiResponse } from "../helpers/apiResponse";
import { UserModel, User } from "../models/user";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users: User[] = await UserModel.find().limit(100);
    if (!users) {
      apiResponse.notFoundResponse(res, "No users found");
      return;
    }
    apiResponse.successResponseWithData(res, "Operation success", users);
  } catch (e) {
    apiResponse.ErrorResponse(res, (e as Error).message);
  }
};

const getOneUser = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.find(req.body);
    if (!user) {
      apiResponse.notFoundResponse(res, "No users found");
      return;
    }
    apiResponse.successResponseWithData(res, "Operation success", user);
  } catch (e) {
    apiResponse.ErrorResponse(res, (e as Error).message);
  }
};

const register = async (req: Request, res: Response) => {
  try {
    const { name, email, avatar, phoneNum, address, balance, dob } = req.body;
    const password = await hash(req.body.password, 8);
    const customId = `${phoneNum}@glocal`;

    const user: User = await UserModel.create({
      name,
      email,
      avatar,
      password,
      phoneNum,
      address,
      balance,
      customId,
      dob,
    });

    apiResponse.successResponseWithData(res, "User created successfully", user);
  } catch (e) {
    apiResponse.ErrorResponse(res, (e as Error).message);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let user;
    if (req.body.password) {
      const password = await hash(req.body.password, 8);
      user = await UserModel.findByIdAndUpdate(id, { ...req.body, password });
    } else {
      user = await UserModel.findByIdAndUpdate(id, req.body);
    }
    if (!user) {
      apiResponse.notFoundResponse(res, "No users found");
      return;
    }
    apiResponse.successResponseWithData(res, "User updated successfully", user);
  } catch (e) {
    apiResponse.ErrorResponse(res, (e as Error).message);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    res.send("Cannot be processed!");
  } catch (e) {
    apiResponse.ErrorResponse(res, (e as Error).message);
  }
};

export const user = { getAllUsers, getOneUser, register, update, deleteUser };
