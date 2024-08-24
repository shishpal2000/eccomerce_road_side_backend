import ErrorHandler from "../utils/utiles-class.js";
import { Product } from "../models/product.js";
import { tryCatch } from "../middlewares/error.js";
import fs from "fs";
import path from "path";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";
// import {faker} from '@faker-js/faker';
//revalidation create, update, new order and delete
export const getAllCategory = tryCatch(async (req, res, next) => {
    let category = [];
    if (myCache.has("category")) {
        category = JSON.parse(myCache.get("category"));
    }
    else {
        category = await Product.distinct("category");
        myCache.set("category", JSON.stringify(category));
    }
    return res.status(200).send({
        success: true,
        message: "Latest products fetched successfully",
        data: {
            category,
        },
    });
});
//revalidation create, update, new order and delete
export const getAllProductAdmin = tryCatch(async (req, res, next) => {
    let products = [];
    if (myCache.has("admin-products")) {
        products = JSON.parse(myCache.get("admin-products"));
    }
    else {
        products = await Product.find();
        myCache.set("admin-products", JSON.stringify(products));
    }
    return res.status(200).send({
        success: true,
        message: "All products fetched successfully",
        data: {
            products,
        },
    });
});
export const getDeleteProduct = tryCatch(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    if (product && product.photos && Array.isArray(product.photos)) {
        product.photos.forEach((photoPath) => {
            const filePath = path.resolve(photoPath);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Failed to delete file: ${filePath}`, err);
                }
            });
        });
    }
    return res.status(200).send({
        success: true,
        message: "Product deleted successfully",
        data: {
            product,
        },
    });
});
export const getUpdateProduct = tryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    const photos = req.files;
    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    // Only delete old photos if new photos are provided
    if (photos && photos.length > 0) {
        if (product.photos && product.photos.length > 0) {
            product.photos.forEach((photoPath) => {
                const filePath = path.resolve(photoPath);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`Failed to delete file: ${filePath}`, err);
                    }
                });
            });
        }
        // Map over the new photos array to extract the paths
        const photoPaths = photos.map((photo) => photo.path);
        product.photos = photoPaths;
    }
    // Update the product fields if provided
    if (name)
        product.name = name;
    if (price)
        product.price = price;
    if (stock)
        product.stock = stock;
    if (category)
        product.category = category;
    const updatedProduct = await product.save();
    return res.status(200).send({
        success: true,
        message: "Product updated successfully",
        data: {
            updatedProduct,
        },
    });
});
export const getSingleProduct = tryCatch(async (req, res, next) => {
    const { id } = req.params;
    let product;
    if (myCache.has("product-" + id)) {
        product = JSON.parse(myCache.get("product-" + id));
    }
    else {
        product = await Product.findById(id);
        if (!product)
            return next(new ErrorHandler("Product not found", 404));
        myCache.set("product-" + id, JSON.stringify(product));
    }
    return res.status(200).send({
        success: true,
        message: "Product fetched successfully",
        data: {
            product,
        },
    });
});
export const createProduct = tryCatch(async (req, res, next) => {
    const { name, price, stock, category } = req.body;
    const photos = req.files;
    // Check if photos and other fields are provided
    if (!photos || photos.length === 0) {
        return next(new ErrorHandler("At least one photo is required", 400));
    }
    // Check if all required fields are provided
    if (!name || !price || !stock || !category) {
        photos.forEach((photo) => {
            const filePath = path.resolve(photo.path);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Failed to delete file: ${filePath}`, err);
                }
            });
        });
        return next(new ErrorHandler("All fields are required", 400));
    }
    // Map over the photos array to extract the paths
    const photoPaths = photos.map((photo) => photo.path);
    // Create the product with the provided details and photo paths
    const product = await Product.create({
        name,
        price,
        photos: photoPaths, // Corrected field name to 'photos'
        stock,
        category: category.toLowerCase(), // Normalize category to lowercase
    });
    await invalidateCache({ product: true });
    return res.status(201).send({
        success: true,
        message: "Product created successfully",
        data: {
            product,
        },
    });
});
//revalidation create, update, new order and delete
export const getLatestProducts = tryCatch(async (req, res, next) => {
    let products = [];
    if (myCache.has("products")) {
        products = JSON.parse(myCache.get("products"));
    }
    else {
        products = await Product.find().sort({ createdAt: -1 }).limit(10);
        myCache.set("products", JSON.stringify(products));
    }
    return res.status(200).send({
        success: true,
        message: "Latest products fetched successfully",
        data: {
            products,
        },
    });
});
//all product with filter
export const getAllProduct = tryCatch(async (req, res, next) => {
    const { category, minPrice, maxPrice, sort, search } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const baseQuery = {};
    if (search) {
        baseQuery.name = { $regex: search, $options: "i" };
    }
    if (minPrice || maxPrice) {
        baseQuery.price = {};
        if (minPrice) {
            baseQuery.price.$gte = Number(minPrice);
        }
        if (maxPrice) {
            baseQuery.price.$lte = Number(maxPrice);
        }
    }
    if (category) {
        baseQuery.category = category;
    }
    const [products, total] = await Promise.all([
        Product.find(baseQuery).sort({ price: sort === "asc" ? 1 : -1 }).skip(skip).limit(limit),
        Product.countDocuments(baseQuery),
    ]);
    if (products.length === 0 || total === 0 || !products) {
        return next(new ErrorHandler("Products not found", 404));
    }
    return res.status(200).send({
        success: true,
        message: "All products fetched successfully",
        data: {
            products: products,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        },
    });
});
// const generateRandomProducts = async (count: number = 10) => {
//   const products = [];
//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       photos: [
//         "uploads\\b29cb319-33f6-4a62-b5da-87b9dde888b2.2",
//         "uploads\\ea12e3f3-9099-4077-a9cd-88c7a44d6d87.2",
//         "uploads\\d55ef018-0708-481f-9ea8-09dbe201b217.2"
//     ],
//       price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//       stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       __v: 0,
//     };
//     products.push(product);
//   }
//   await Product.create(products);
//   console.log({ success: true });
// };
// generateRandomProducts(40)
