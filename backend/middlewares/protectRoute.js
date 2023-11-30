import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {    // next will tell what to do next if this middleware runs succesfully.
    try {
        const token = req.cookies.jwt;
        
        // if there is no cookie that means nobody is loggedin.
        if(!token) return res.status(401).json({ message: "Unauthorized" });
        
        // if there is token we verify it and get the user by decoding the jwt token.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // now getting the user by userId which was sent as payload with jwt.
        // as we dont need password of user of ignoring it with .select() method.
        const user = await User.findById(decoded.userId).select("-password");

        // passing the user in req object.
        req.user = user;

        next(); // calling the next middleware or next function if success.
    }
    catch (err) {
        res.status(500).json({ message: err.message });
        console.log("Error in followUnFollowUser: ", err.message);
    }
};

export default protectRoute;