import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/utiles-class.js";
import { User } from "../models/user.js";

//admin only
export const adminOnly = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.query;

  if (!id) {
    return next(new ErrorHandler("Please Login to get your id", 400));
  }

  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("Please Login provide correct id", 400));
  }

  if (user.role !== "admin") {
    return next(
      new ErrorHandler("You are not authorized to access this resource", 401)
    );
  }

  next();
};
