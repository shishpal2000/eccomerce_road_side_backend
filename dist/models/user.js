import mongoose, { Schema } from "mongoose";
import validator from "validator";
const schema = new Schema({
    _id: {
        type: String,
        required: [true, "please provide user id"],
    },
    name: {
        type: String,
        required: [true, "please provide name"],
    },
    photo: {
        type: String,
        required: [true, "please provide photo"],
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: [true, "please provide gender"],
    },
    dob: {
        type: Date,
        required: [true, "please provide date of birth"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "please provide email"],
        validate: {
            validator: (str) => validator.isEmail(str),
            message: "please provide a valid email",
        },
    },
}, { timestamps: true });
schema.virtual("age").get(function () {
    const today = new Date();
    const dob = this.dob;
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
});
export const User = mongoose.model("User", schema);
