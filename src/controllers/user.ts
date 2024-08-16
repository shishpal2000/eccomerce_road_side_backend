import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import ErrorHandler from "../utils/utiles-class.js";
import { tryCatch } from "../middlewares/error.js";

export const newUser = tryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, photo, role, gender, dob, _id } = req.body;

    let user = await User.findById(_id);

    if (user) {
      return res.status(200).json({
        success: true,
        message: `Welcome ${user.name}`,
        data: {
          user,
        },
      });
    }

    if (!name || !email || !photo || !role || !gender || !dob || !_id) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    user = await User.create({
      name,
      email,
      photo,
      role,
      gender,
      dob: new Date(dob),
      _id,
    });

    return res.status(201).send({
      success: true,
      message: "User created successfully",
      data: {
        user,
      },
    });
  }
);

export const getAllUsers = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();

    if (!users) {
      return next(new ErrorHandler("No users found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "All users",
      data: {
        users,
      },
    });
  }
);

export const getSingleUser = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorHandler("No user found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Single user",
      data: {
        user,
      },
    });
  }
);

export const deleteUser = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return next(new ErrorHandler("No user found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: {
        user,
      },
    });
  }
);

// export const updateUser = tryCatch(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });

//     if (!user) {
//       return next(new ErrorHandler("No user found", 404));
//     }

//     return res.status(200).json({
//       success: true,
//       message: "User updated successfully",
//       data: {
//         user,
//       },
//     });
//   }
// );
