import mongoose, { Schema } from "mongoose";
const emailVerification = Schema({
    OTP: String,
    userId: String,
    token: String,
    // resetSession: { type: Boolean, default: false },
    createdAt: Date,
    expiresAt: Date
})

const Verification = mongoose.model("Verification", emailVerification);

export default Verification;