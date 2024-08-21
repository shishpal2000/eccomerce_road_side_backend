import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/features.js";
import cors from "cors";
import { errorMiddleWare } from "./middlewares/error.js";
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/products.js";
import NodeCache from "node-cache"


dotenv.config();

export const myCache = new NodeCache();

const PORT =process.env.PORT || 8000;

connectDB();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Api working is /api/v1/");
});

//using routes
app.use("/api/v1/user", userRoutes);

app.use("/api/v1/product", productRoutes);

app.use("/uploads", express.static("uploads"));
app.use(errorMiddleWare);

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
