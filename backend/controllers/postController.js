import Post from "../models/postModel.js";
import User from "../models/userModel.js";

const createPost = async (req, res) => {
    try {
        const {postedBy, text, img} = req.body;
        
        if(!postedBy || !text) {
            return res.status(400).json({ message: "postedBy and text fields are required"});
        }
        
        const user = await User.findById(postedBy);
        if(!user){
            return res.status(404).json({ message: "user not found"});
        }

        // putting check for not letting the user to create post for someone else.
        if(user._id.toString() !== req.user._id.toString()){
            return res.status(401).json({ message: "Unauthorized to create post"});
        }

        const maxLength = 500;
        if(text.length > maxLength){
            return res.status(400).json({ message: `Text must be less than ${maxLength} characters`})
        }

        // using Constructor
        const newPost = new Post({ postedBy, text, img });
        await newPost.save();
        
        res.status(201).json({ message: "Post Created Successfully", newPost });
    }
    catch (err) {
        res.status(500).json({ message: err.message});
        console.log(err);
    }
};


const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        
        if(!post){
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ post });
    }
    catch (err) {
        res.status(500).json({ message: err.message});    
    }
};


const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
     
        if(!post){
            return res.status(404).json({ message: "Post not found" });
        }

        if(post.postedBy.toString() !== req.user._id.toString()){
            return res.status(401).json({ message: "Unauthorized to delete post"});
        }

        await Post.findByIdAndDelete(req.params.id);
        
        res.status(200).json({ message: "Post deleted Successfully" });
    }
    catch (err) {
        res.status(500).json({ message: err.message});    
    }
};


const likeUnlikePost = async (req, res) => {
    try {
        const { id:postId } = req.params;
        const userId = req.user._id;    // id of user which is loggedin.
        
        const post = await Post.findById(postId);
     
        if(!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const userLikedPost = post.likes.includes(userId);

        if(userLikedPost) {
            //Unlike Post
            await Post.updateOne({_id:postId}, {$pull: {likes: userId}} );  //inside the likes arrey remove the userId.
            res.status(200).json({ message: "Post Unliked Successfully" });
        }
        else {
            //Like Post
            post.likes.push(userId);
            await post.save();
            res.status(200).json({ message: "Post Liked Successfully" });
        }

    }
    catch (err) {
        res.status(500).json({ message: err.message});    
    }
};


const replyToPost = async (req, res) => {
    try {
        const {text} = req.body;
        
        const postId = req.params.id;   // id of post to reply.
        const userId = req.user._id;    // id of user which is loggedin.
        
        const userProfilePic = req.user.profilePic;
        const username = req.user.username;
     
        if(!text) {
            return res.status(400).json({ message: "Text is required" });
        }

        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const reply = {userId, text, userProfilePic, username};
        
        post.replies.push(reply);
        await post.save();

        res.status(200).json({ message: "Reply added Successfully", post });

    }
    catch (err) {
        res.status(500).json({ message: err.message});    
    }
};


const getFeedPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        
        const following = user.following;   // getting the users which the login user follows to show them in his feed.
        
        // finding the posts where the postedBy field is in the following array
        const feedPosts = await Post.find({postedBy:{$in:following}}).sort({createdAt: -1});    // sorting the posts in descending order with createdAt object so we can see the latest post.

        res.status(200).json({feedPosts});
    }
    catch (err) {
        res.status(500).json({ message: err.message});
    }
};

export {createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts };