import express from "express";
import { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts } from "../controllers/postController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/feed", protectRoute, getFeedPosts); // noone can see the posts if they dont have an account or signin.
router.get("/:id", getPost); // id for fetching that particular post.
router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost); // id for fetching that particular post.
router.post("/like/:id", protectRoute, likeUnlikePost); // id for fetching that particular post.
router.post("/reply/:id", protectRoute, replyToPost); // id for fetching that particular post.

export default router;