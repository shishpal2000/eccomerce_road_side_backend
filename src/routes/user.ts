import express from "express";
import {
  deleteUser,
  getAllUsers,
  getSingleUser,
  newUser,
} from "../controllers/user.js";
import { adminOnly } from "../middlewares/autth.js";
const app = express.Router();

app.post("/new", newUser);

app.get("/all", adminOnly, getAllUsers);

app.get("/single/:id", getSingleUser);

app.delete("/delete/:id", adminOnly, deleteUser);

export default app;
