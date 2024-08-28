import { NextFunction, Request, Response } from "express";

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export interface NewUserRequestBody {
  name: string;
  email: string;
  photo: string;
  role: "admin" | "user";
  gender: "male" | "female";
  dob: Date;
  _id: string;
}

export interface NewProductRequestBody {
  name: string;
  price: number;
  photos: string[];
  stock: number;
  category: string;
}

export type SearchRequestQuery = {
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  category?: string;
  sort?: string;
  page?: string;
  limit?: string;
};

export interface BaseQuery {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: {
    $gte?: number;
    $lte?: number;
  };
  category?: string;
}

export interface InvalidateCacheProps {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
}

export interface NewOrderRequestBody {
  shippingInfo: {
    address: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
  };

  
  user: string;
  subTotal: number;
  tax: number;
  total: number;
  shippingCharges: number;
  discount: number;


  orderItems: {
    name: string;
    price: number;
    photo: string;
    quantity: number;
    productId: string; 
  }[];
}
