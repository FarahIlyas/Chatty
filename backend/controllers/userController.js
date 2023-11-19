import User from "../models/userModel.js";

const signupUser = async(req, res) => {
    
    try {
        const {name, email, password, username} = req.body;
        const user = await User.findOne({$or: [ {email}, {username} ] });   // its trying to find the user whether it exists already or not.
        if (user) {
            return res.status(400).json({message: "User already exists"});
        }
    } 
    catch (err) {
        res.status(500).json({ message: err.message})
        console.log("Error in Signup User: ", err.message);
    }
};

export { signupUser }