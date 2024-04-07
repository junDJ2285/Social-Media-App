import express from "express";
import { acceptRequest, changePassword, friendRequest, getFriendRequest, getUser, profileVews, reqPasswordRest, resetPassword, suggestedFriends, updateUser, userLogin, userRegister, } from "../controllers/userControllers.js";
import { verifyEmail } from "../controllers/authControllers.js";
import { userAuth } from "../meddleware/auth.js";
// import { auth, localVariables } from "./meddleware/auth.js";
// import { registerMail } from "../utils/mailer.js"
const router = new express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/verifyEmail/:userId/:token", verifyEmail)
router.post("/request-passwordReset", reqPasswordRest);
router.get("/reset-password/:userId/:token", resetPassword);
router.post("/reset-password", changePassword);
// user  routes /
router.post("/get-user", userAuth, getUser);
router.put("/update-user", userAuth, updateUser);

// friend request 

router.post("/friend-request", userAuth, friendRequest);
router.post("/get-friend-request", userAuth, getFriendRequest);

// accept request

router.post("/accept-request", userAuth, acceptRequest);
// view profileVews
router.post("/profile-views", userAuth, profileVews);
router.post("/suggested-friends", userAuth, suggestedFriends);




export default router;
