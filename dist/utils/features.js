import mongoose from "mongoose";
export const connectDB = () => {
    try {
        mongoose.connect(process.env.MONGO_URI);
        console.log("database connected");
    }
    catch (error) {
        console.log(error, "database not connected");
    }
};
