import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/features.js";
import cors from "cors";
import { errorMiddleWare } from "./middlewares/error.js";
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/products.js";
dotenv.config();
const PORT = 5000;
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
app.use(errorMiddleWare);
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
