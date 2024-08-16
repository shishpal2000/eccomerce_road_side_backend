import mongoose from "mongoose";

const { Schema, Document } = mongoose;

const schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "please provide name"],
    },
    photo: {
      type: String,
      required: [true, "please provide photo"],
    },
    price: {
      type: String,
      required: [true, "please provide price"],
    },
    stock: {
      type: Number,
      required: [true, "please provide stock"],
    },
    category: {
      type: String,
      required: [true, "please provide category"],
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", schema);
