import userModel from "../userModels/userSchema.js";
import bcrypt from "bcrypt"
import Jwt from "jsonwebtoken";
import otpGenerator from "otp-generator"
import { hashString, compareString, createJWT } from "../utils/index.js";
import { sendVerificationEmail } from "../utils/mailer.js";
import passwaordReset from "../userModels/passwordReset.js";
import FriendRequest from "../userModels/friedsRequest.js";

export const userRegister = async (req, res) => {
    try {
        const { fristName, lastName, email, password } = req.body
        if (!fristName || !lastName || !email || !password) {
            return res.status(404).send({
                mes: "please fill all fields",
                success: false
            })
        }
        const exitingemail = await userModel.findOne({ email })
        if (exitingemail) {
            return res.status(201).send({
                mes: "Email is Already registered  plaese use another email",
                success: false
            })
        }

        const hashPassword = await hashString(password);

        const user = new userModel({
            fristName,
            lastName,
            email,
            password: hashPassword,
        })
        console.log(user)
        sendVerificationEmail(user, res)
        // return res.status(200).send({
        //     mes: "User Resgister Successfully",
        //     success: true,
        //     user

        // })

        await user.save()
    } catch (error) {
        res.status(500).send({
            mes: "error in resgister",
            success: false,
            error: error
        })
        console.log(error)
    }
}

export const userLogin = async (req, res, next) => {
    // console.log(req.body)
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(404).send({
                mes: "please Provide Email or Password",
                success: false
            })
        }
        const user = await userModel.findOne({ email })
        // console.log(user)
        if (!user) {
            return res.status(400).send({
                mes: "Email is not registered",
                success: false
            })
        }

        if (!user?.verified) {
            next("User is not verified . check Your email acoount and verify your Email")
            return
        }

        const isMatch = await compareString(password, user?.password)

        if (!isMatch) {
            return res.status(400).send({
                mes: "invalid Email or password",
                success: false
            })
        }
        user.password = undefined;
        const token = createJWT(user?._id);

        // console.log("tokens", token, keys)

        return res.status(200).send({
            mes: "User login Successfully",
            success: true,
            user,
            token
        })
    } catch (error) {
        res.status(500).send({
            mes: "error in login",
            success: false,
            error
        })
    }
}
export const reqPasswordRest = async (req, res) => {
    try {
        const { email } = req.body

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).send({
                mes: "failed Email is Not found"
            })
        }
        const existRequest = await passwaordReset.findOne({ email });
        if (existRequest) {
            if (existRequest.expiresAt > Date.now()) {
                return res.status(200).send({
                    success: true,
                    mes: " OTP is already send to your email"
                })
            }
            await passwaordReset.findByIdAndDelete({ email })
        }
        await sendpassResetOTP(user, res)
    } catch (error) {
        res.status(500).send({
            mes: "error",
            success: false,
            error
        })
    }
}
export const resetPassword = async (req, res) => {
    const { userId, token: verifyToken, OTP: inputOTP } = req.body;
    console.log(verifyToken);

    try {
        const user = await userModel.findOne({ userId });
        if (!data) {
            return res.status(404).send({ mes: "Verification record not found." });
        }
        const data = await passwaordReset.findOne({ userId });
        if (!data) {
            return res.status(400).send({ mes: "Verification record not found." });
        }

        const { userId, expiresAt, OTP: dbOTP, token: hashedToken } = data;
        console.log("too", hashedToken);
        if (expiresAt < Date.now()) {
            return res.status(400).send({
                mes: "Reset password is expired. Please try again"
            })
        }
        else {
            if (parseInt(inputOTP) === parseInt(dbOTP)) {
                // Compare the token with the hashed token
                const match = await verifyToken === hashedToken;
                if (match) {
                    const verificationDelete = await passwaordReset.findOneAndDelete({ userId });
                    if (!verificationDelete) {
                        console.error("Failed to delete verification record.");
                    }
                    return res.status(200).send({ success: true, mes: "OTP verified successfully." });
                } else {
                    return res.status(400).send({ success: false, mes: "Token mismatch." });
                }
            } else {
                return res.status(400).send({ success: false, mes: "OTP mismatch." });
            }

        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ mes: "Error in verifying OTP." });
    }
}
export const changePassword = async (req, res) => {
    try {
        const { id, password } = req.body;

        const hashPassword = await hashString(password)
        const user = await userModel.findByIdAndUpdate({ _id: userId }, { password: hashPassword }, { new: true })
        if (user) {
            return await passwaordReset.findByIdAndDelete({ userId }), res.status(200).send({
                success: true,
                mes: "Password Reset Successfully"
            })
        }
        return res.status(200).send({
            success: true,
            message: "user updated",
            user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: true,
            message: "user not found"
        })
    }
}
export const getUser = async (req, res, next) => {
    try {
        const { userId } = req.body.user;
        const { _id } = req.params;

        const user = await userModel.findById(_id ?? userId).papulate({
            path: "friends",
            select: "-password"
        })
        if (!user) {
            return res.status(400).send({
                success: false,
                mes: "user not found "
            })
        }
        user.password = undefined;
        res.status(200).send({
            success: false,
            user: user
        })

    } catch (error) {
        res.status(400).send({
            success: false,
            mes: "auth error ",
            error
        })
    }
}
export const updateUser = async (req, res) => {
    try {
        const { firstName, lastName, location, profileUrl, proffession } = req.body
        if (!(firstName, lastName, location, profileUrl, proffession)) {
            return next("please provide all required fields");
        }
        const userId = req.body.user;
        const updateUser = {
            firstName, lastName, location, profileUrl, proffession, _id: userId
        }
        const user = await userModel.findByIdAndUpdate(userId, updateUser, { new: true })
        await user.papulate({ path: "friends", select: "-password" });
        const token = createJWT(user?.id);
        user.password = undefined;

        if (!user) {
            return res.status(404).send({
                mes: "user not match in this id",
                success: false
            })
        }

        res.status(200).send({
            success: true,
            mes: "user update successfully",
            user,
            token
        })
        return res.status(200).send({
            success: true,
            message: "user updated",
            user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: true,
            message: "user not found"
        })
    }
}
export const friendRequest = async (req, res, next) => {
    try {
        const { userId } = req.body.user;
        const { requestTo } = req.body;

        const requestExist = await FriendRequest.findOne({
            requestFrom: userId,
            requestTo,
        })

        if (requestExist) {
            next("friend Request already send")
            return;
        }

        const accountExist = await FriendRequest.findOne({
            requestFrom: requestTo,
            requestTo: userId
        })

        if (accountExist) {
            next("friend Equest already send")
            return;
        }

        const newRequest = await FriendRequest.create({
            requestTo,
            requestFrom: userId
        })

        res.status(201).send({
            success: true,
            message: "friend Request sent successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            mes: "error",
            error
        })
    }
}
export const getFriendRequest = async (req, res, next) => {
    try {
        const { userId } = req.body.user;

        const request = await FriendRequest.find({
            requestTo: userId,
            requestStatus: "pending"
        }).papulate({
            path: "reuestFrom",
            select: "fristName Last Name profileUrl proffession -password"
        }).limit(10).sort({
            _id: -1
        })

        res.status(200).send({
            success: true,
            data: request
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            mes: "error",
            error
        })
    }
}
export const acceptRequest = async (req, res, next) => {
    try {
        const id = req.body.user.userId;

        const { rid, status } = req.body

        const requestExist = await FriendRequest.findById(rid)

        if (requestExist) {
            next("friend REquest not found")
            return;
        }

        const newRequest = await FriendRequest.findByIdAndUpdate({ _: rid }, { requestStatus: status })

        if (status === " Accepted") {
            const user = await userModel.findById(id);

            user.friends.push(newRequest?.requestFrom)

            await user.save();

            const friend = await user.findById(newRequest?.requestFrom);

            friend.friends.push(newRequest?.requestTo);

            await friend.save()
        }
        res.status(200).send({
            success: true,
            mes: " Freind Request " + status
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            mes: "error",
            error
        })
    }
}
export const profileVews = async (req, res, next) => {
    try {
        const { userId } = req.body.user;

        const { id } = req.body;

        const user = await userModel.findById(id);
        user.views.push(userId);
        await user.save();

        res.status(200).send({
            success: true,
            mes: "Successfully",
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            mes: "error",
            error
        })
    }
}
export const suggestedFriends = async (req, res, next) => {
    try {
        const { userId } = req.body.user;
        let queryObject = {};

        queryObject._id = { $ne: userId };
        queryObject.friends = { $nin: userId };

        let queryResult = await userModel.find(queryObject)
            .limit(15)
            .select("firstName lastName profileUrl proffession -password");
        const suggestedFriends = await queryResult;

        res.status(200).send({
            success: false,
            data: suggestedFriends
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            mes: "error",
            error
        })
    }
}