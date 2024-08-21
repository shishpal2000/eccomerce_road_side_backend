import mongoose from "mongoose";

const { Schema } = mongoose;

import {NewProductRequestBody} from "../types/types.js";

const productSchema = new Schema<NewProductRequestBody>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,  
    },
    photos: {
      type: [String], 
      required: [true, "Please provide at least one photo"],
      validate: {
        validator: function (v: string[]) {
          return Array.isArray(v) && v.length > 0;
        }, 
        message: "A product must have at least one photo",
      },
    },
    price: {
      type: Number, 
      required: [true, "Please provide a price"],
      min: [0, "Price cannot be negative"], 
    },
    stock: {
      type: Number,
      required: [true, "Please provide the stock quantity"],
      min: [0, "Stock cannot be negative"], 
      validate: {
        validator: Number.isInteger,
        message: "Stock must be an integer",
      },
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      trim: true,
      lowercase: true, 
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model<NewProductRequestBody>("Product", productSchema);
