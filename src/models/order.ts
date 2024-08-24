import mongoose, { Schema, Document } from "mongoose";

// Define the schema
const orderSchema = new Schema(
  {
    shippingInfo: {
      type: String,
      required: [true, "Please provide shipping info"],
    },
    city: {
      type: String,
      required: [true, "Please provide city"],
    },
    state: {
      type: String,
      required: [true, "Please provide state"],
    },
    country: {
      type: String,
      required: [true, "Please provide country"],
    },
    pinCode: {
      type: String, // Changed from Number to String
      required: [true, "Please provide pin code"],
    },
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    subTotal: {
      type: String,
      required: true,
    },
    tax: {
      type: String,
      required: true,
    },
    shippingCharges: {
      type: String,
      required: true,
    },
    total: {
      type: String,
      required: true,
    },
    orderStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "out for delivery", "delivered"],
    },
    orderItems: [
      {
        name: {
          type: String,
          required: [true, "Please provide product name"],
        },
        price: {
          type: Number,
          required: [true, "Please provide product price"],
        },
        quantity: {
          type: Number,
          required: [true, "Please provide product quantity"],
        },
        productId:{
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        }
      },
    ],
   
  },
  { timestamps: true } // Add timestamps option
);

// Create and export the model
const OrderModel = mongoose.model("Order", orderSchema);

export default OrderModel;
