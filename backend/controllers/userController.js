import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";

const signupUser = async (req, res) => {
    
    try {
        const {name,email,username,password} = req.body;
        const user = await User.findOne({$or: [ {email}, {username} ] });   // its trying to find the user whether it exists already or not.
        if (user) {
            return res.status(400).json({message: "User already exists"});
        }
        const salt = await bcrypt.genSalt(10); // it is for hashing the password. higher the number, more secure it is but it slows down the application.
        const hashedpassword = await bcrypt.hash(password,salt);    // the password will be hashes using the salt function.

        // Now we will create the new user since the user was not exists already.
        const newUser = new User({
            name:name,
            email:email,
            username:username,
            password: hashedpassword
        });
        // Save the created user.
        await newUser.save();

        // now send the user has response.
        if(newUser){
            generateTokenAndSetCookie(newUser._id, res);
            res.status(201).json({      // 201 status code for user created.
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
            })  //passing the data which we created.
        }
        else{
            res.status(400).json({message: "Invalid User Data"})
        }
    } 
    catch (err) {
        res.status(500).json({ message: err.message});
        console.log("Error in Signup User: ", err.message);
    }
};


const loginUser = async (req, res) => {
    try {
        const {username, password} = req.body;
        // finding user whether it exists in DB or not?
        const user = await User.findOne({username});
        // comparing password(password) of user with password stored in DB(user.password).
        const isPasswordCorrect = await bcrypt.compare(password, user.password); I
        
        // checking credentials whether true or false.
        if(!user || !isPasswordCorrect) return res.status(400).json({ message: "Invalid username or password" });
        
        generateTokenAndSetCookie(user._id, res);
        
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
        })
    } 
    catch (error) {
        res.status(500).json({message: error.message });
        console.log("Error in loginUser: ", error.message);
    }
};

export { signupUser, loginUser }