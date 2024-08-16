import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/utiles-class.js";
import { Product } from "../models/product.js";
import { NewProductRequestBody } from "../types/types.js";
import { tryCatch } from "../middlewares/error.js";

export const createProduct = tryCatch(
  async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, price, photo, stock, category } = req.body;

    let product = await Product.findById(name);

    if (product) {
      return res.status(200).json({
        success: true,
        message: `product same name already exist ${product.name}`,
        data: {
          product,
        },
      });
    }

    if (!name || !price || !photo || !stock || !category) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    product = await Product.create({
      name,
      price,
      photo,
      stock,
      category,
    });

    return res.status(201).send({
      success: true,
      message: "product created successfully",
      data: {
        product,
      },
    });
  }
);
