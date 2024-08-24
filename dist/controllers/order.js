import { tryCatch } from "../middlewares/error.js";
export const newOrder = tryCatch(async (req, res, next) => {
    res.send("hello");
});
