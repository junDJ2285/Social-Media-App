import mongoose, { Schema } from "mongoose";

const passwaordResetSchema = Schema({
    OTP: String,
    userId: { type: String, unique: true },
    userEmail: { type: String, unique: true },
    token: String,
    createAt: Date,
    expiresAt: Date
});

const passwaordReset = mongoose.model("passwordReset", passwaordResetSchema);
export default passwaordReset;