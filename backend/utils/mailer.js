import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import { hashString } from "./index.js";
import Verification from "../userModels/emailVerification.js";
import otpGenerator from "otp-generator";
import passwaordReset from "../userModels/passwordReset.js";

const { AUTH_EMAIL, AUTH_PASSWORD, APP_URL } = process.env;

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'success2285@gmail.com',
        pass: 'whxr pgmp choy utmu'
    }
});

const generateOTP = async (req, res) => {
    let otp = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    return otp
};

export const sendVerificationEmail = async (user, res) => {
    const { _id, userName, email, text, subject } = user;
    console.log("email", email)
    const token = process.env.JWT_SECRET_KEYS;

    const otp = await generateOTP();
    console.log(otp)
    const mailOptions = {
        from: "success2285@gmail.com",
        to: email,
        subject: "OTP verification",
        html: `
            <div>Your verification OTP is ${otp} <br/> 
            Please do not share the OTP with unknown people.<div/>
        `
    };
    try {


        const hashedToken = await hashString(token);
        console.log(otp)
        const verificationEmail = await Verification.create({
            OTP: otp,
            userId: _id,
            token: hashedToken,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        });

        if (verificationEmail) {
            transporter
                .sendMail(mailOptions)
                .then(() => {
                    res.status(201).send({
                        success: "pending",
                        mes: "Verification OTP has been sent to your email. Please check your email.",
                        user,
                    });
                })
                .catch((error) => {
                    console.error("error =>>", error);
                    res.status(500).send({
                        mes: "Something went wrong while sending the verification email."
                    });
                });
        }

    } catch (error) {
        console.error(error, "=>>> error");
        res.status(500).send({
            mes: "Something went wrong during email verification."
        });
    }
};
export const sendpassResetOTP = async (user, res) => {
    const { _id, email } = user;
    console.log("email", email)
    const token = _id + uuidv4();

    const otp = await generateOTP();
    console.log(otp)
    const mailOptions = {
        from: "success2285@gmail.com",
        to: email,
        subject: "OTP verification",
        html: `
            <div>Your verification OTP is ${otp} <br/> 
            Please do not share the OTP with unknown people.<div/>
        `
    };
    try {


        const hashedToken = await hashString(token);
        console.log(otp)
        const verificationEmail = await passwaordReset.create({
            OTP: otp,
            userId: _id,
            token: hashedToken,
            createdAt: Date.now(),
            expiresAt: Date.now() + 600000,
        });

        if (verificationEmail) {
            transporter
                .sendMail(mailOptions)
                .then(() => {
                    res.status(201).send({
                        success: "pending",
                        mes: "Verification OTP has been sent to your email. Please check your email.",
                        user,
                    });
                })
                .catch((error) => {
                    console.error("error =>>", error);
                    res.status(500).send({
                        mes: "Something went wrong while sending the verification email."
                    });
                });
        }

    } catch (error) {
        console.error(error, "=>>> error");
        res.status(500).send({
            mes: "Something went wrong during email verification."
        });
    }
};