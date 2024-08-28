import { copyFileSync } from "fs";
import mongoose from "mongoose";
import { InvalidateCacheProps } from "../types/types.js";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";

export const connectDB = () => {
  try {
    mongoose.connect(process.env.MONGO_URI as string);
    console.log("database connected");
  } catch (error) {
    console.log(error, "database not connected");
  }
};

export const invalidateCache =async ({product, order, admin}:InvalidateCacheProps) => {
  if(product){
    const productKeys: string[] =["products","category","admin-products"];

    const productKey=await Product.find({}).select("_id")

    productKeys.push(...productKey.map((product)=>`product-${product._id.toString()}`))

    myCache.del(productKeys);

  }

  if(order){


    myCache.del("orders"); 
  }

  if(admin){
    myCache.del("admin-products");
  }
}

export const redusceStock = async (id: string, quantity: number) => {
  const product = await Product.findById(id);
  if (product) {
    product.stock -= quantity;
    await product.save();
  }
}