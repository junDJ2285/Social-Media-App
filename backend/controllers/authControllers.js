import mongoose from "mongoose";
import Verification from "../userModels/emailVerification.js";
import userModel from "../userModels/userSchema.js";
import { compareString } from "../utils/index.js";

export const verifyEmail = async (req, res) => {
    const { userId, token: verifyToken, OTP: inputOTP } = req.body;
    console.log(verifyToken);

    try {
        const data = await Verification.findOne({ userId });
        if (!data) {
            return res.status(400).send({ mes: "Verification record not found." });
        }

        const { userId: dataUserId, OTP: dbOTP, token: hashedToken } = data;

        // Compare input OTP with the OTP fetched from the database
        console.log("too", hashedToken);
        if (parseInt(inputOTP) === parseInt(dbOTP)) {
            // Compare the token with the hashed token
            const match = await verifyToken === hashedToken;
            if (match) {
                // Update user's verified status
                const user = await userModel.findOneAndUpdate({ _id: userId }, { verified: true });
                if (!user) {
                    return res.status(404).send({ mes: "User not found." });
                }

                // Delete verification record after successful verification
                const verificationDelete = await Verification.findOneAndDelete({ userId });
                if (!verificationDelete) {
                    console.error("Failed to delete verification record.");
                }

                return res.status(200).send({ mes: "OTP verified successfully." });
            } else {
                return res.status(400).send({ mes: "Token mismatch." });
            }
        } else {
            return res.status(400).send({ mes: "OTP mismatch." });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ mes: "Error in verifying OTP." });
    }
}
