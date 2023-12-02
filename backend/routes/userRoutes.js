import express from "express";
import { followUnFollowUser, getUserProfile, loginUser, logoutUser, signupUser, updateUser } from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

//we will create controllers separately to handle each routes. it is best practice.

router.get("/profile/:username", getUserProfile);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnFollowUser);     // it is going to be dynamic route with id to know the user which we will follow/unfollow. we will get this id using params.
// adding protectRoute() as middleware to protect the route. adding this to ensure that no one can follow/unfollow anybody if they are not loggedin.
// if i am not loggedin i can't update my profile. 
// when we enter above route this will first run the middleware and upon succes it'll run the followUnFollowUser() with help of next() in middleware.
router.post("/update/:id", protectRoute, updateUser);

export default router;