import { NextFunction, Request, Response } from "express";
import { tryCatch } from "../middlewares/error.js";
import {NewOrderRequestBody} from "../types/types.js"
import Order from "../models/order.js";
import { invalidateCache, redusceStock } from "../utils/features.js";


export const  newOrder=tryCatch(async(req:
    Request<{},{},NewOrderRequestBody>,res,next)=>{
   
        const {shippingInfo,user,subTotal,tax,total,orderItems,shippingCharges,discount}=req.body

        if(!shippingInfo || !user || !subTotal || !tax || !total || !orderItems || !shippingCharges || !discount){
            return res.status(400).json({message:"All fields are required"})
        }
        
        await Order.create({shippingInfo,user,subTotal,tax,total,orderItems,shippingCharges,discount});

        orderItems.forEach (element => {
             redusceStock(element.productId,element.quantity)
        });
      
        await invalidateCache({product:true,order:true,admin:true});
        res.status(201).json({message:"order created successfully"})

})