import express from "express";
import { loginUser, logoutUser, signupUser } from "../controllers/userController.js";

const router = express.Router();

//we will create controllers separately to handle each routes. it is best practice.

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;