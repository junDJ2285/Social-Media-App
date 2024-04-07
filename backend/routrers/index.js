import express from "express";
import userRoutes from "./userRouters.js"
// import authUserRoutes from "./authUserRoutes.js"
const router = express.Router();

router.use("/api/v1/user", userRoutes)
// router.use(`/api/v1/user`, authUserRoutes)

export default router