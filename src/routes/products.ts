import express from "express";
import { adminOnly } from "../middlewares/autth.js";
import { createProduct, getAllCategory, getAllProduct,getSingleProduct,getAllProductAdmin, getDeleteProduct,getUpdateProduct, getLatestProducts } from "../controllers/product.js";
import { multipleUpload  } from "../middlewares/multer.js";

const app = express.Router();

app.post("/new",adminOnly, multipleUpload , createProduct);

app.get('/latest',getLatestProducts)

app.get('/category',getAllCategory)

app.get('/all',getAllProduct)
app.get('/admin-all-product',adminOnly,getAllProductAdmin);

app.delete('/delete/:id',adminOnly,getDeleteProduct)

app.put('/update/:id',adminOnly,multipleUpload,getUpdateProduct);

app.get('/single/:id',getSingleProduct)

export default app;
