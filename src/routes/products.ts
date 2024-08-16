import express from "express";
import { adminOnly } from "../middlewares/autth.js";

const app = express.Router();

app.post("/new", adminOnly);

export default app;
