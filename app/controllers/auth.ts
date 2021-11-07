/** load required packages */
import { Request, Response } from "express";
import { decode, sign, verify } from "jsonwebtoken";
import { compare } from "bcryptjs";

import { JWT_SECRET } from "../config/config";

/** load peer modules and services */
import { apiResponse } from "../helpers/apiResponse";
import { UserModel } from "../models/user";
import { ShopModel } from "../models/shop";

interface IJWTPayload {
  email: string;
  password: string;
  userType: string;
  issued: Number;
  expires: Number;
}

/** Get current user  */
const currentUser = async (req: Request, res: Response) => {
  if (!req.headers.authorization) {
    apiResponse.validationErrorWithData(res, "Request without token", {
      success: false,
    });
    return;
  }
  const auth = req.headers.authorization.split(" ");
  if (auth.length !== 2) {
    apiResponse.ErrorResponse(res, "Invalid bearer token format");
    return;
  }
  try {
    const token = auth[1];

    if (!verify(token, JWT_SECRET)) {
      apiResponse.unauthorizedResponse(res, "Could not authenticate");
      return;
    }

    const payload = decode(token) as { email: string; userType: string };

    const { email, userType } = payload;
    if (userType === "user") {
      const data = await UserModel.findOne({ email });
      if (data !== null) {
        apiResponse.successResponseWithData(res, "current user verified", data);
      }
      return;
    }
    const data = await ShopModel.findOne({ email });
    if (data != null) {
      apiResponse.successResponseWithData(res, "current shop verified", data);
    }
    return;
  } catch (e) {
    apiResponse.ErrorResponse(res, "Could not verify user");
  }
};

/** Authenticate a user */
const authenticate = async (req: Request, res: Response) => {
  const { email, password, userType } = req.body;
  try {
    // find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      apiResponse.notFoundResponse(res, "User not found");
      return;
    }
    const match = await compare(password, user.password);
    console.log({ password, match });
    console.log(user.password);
    // verify user
    if (!match) {
      apiResponse.unauthorizedResponse(res, "Could not authenticate");
      return;
    }
    // sign token
    const payload: IJWTPayload = {
      email,
      password,
      userType,
      issued: Date.now(),
      expires: Date.now() + 24 * 60 * 60 * 1000,
    };
    const token = sign(payload, JWT_SECRET, {
      expiresIn: "1d",
    });
    // send token
    apiResponse.successResponseWithData(
      res,
      "User authenticated successfully",
      token
    );
    return;
  } catch (e) {
    if (e) {
      apiResponse.ErrorResponse(res, (e as Error).message);
    }
  }
};

export const auth = { currentUser, authenticate };
