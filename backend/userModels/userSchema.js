import mongoose, { Schema } from "mongoose";
import Validator from "validator";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
    fristName: {
        type: String,
        required: [true, "Username is required"]
    },
    lastName: {
        type: String,
        required: [true, "Username is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: {
            validator: (value) => Validator.isEmail(value),
            message: "Invalid email format"
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password should be at least 6 characters long"]
    },
    location: { type: String },
    profileUrl: { type: String },
    proffession: { type: String },
    friends: [{ type: Schema.Types.ObjectId, ref: "user" }],
    views: [{ type: String }],
    verified: { type: Boolean, default: false }
},
    {
        timestamps: true
    });


const userModel = mongoose.model("user", userSchema);

export default userModel;
