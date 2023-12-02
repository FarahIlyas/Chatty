import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";

const getUserProfile = async (req, res) => {
    const {username} = req.params;
    try {
        const user = await User.findOne({username}).select("-password").select("-updatedAt");    //select everything except password and updatedAt. select is used one by one.
        if(!user) return res.status(400).json({ message: "User not Found"});
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
        console.log("Error in getUserProfile: ", err.message);  
    }
};


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
        const user = await User.findOne({ username });
        
        if(!user) return res.status(400).json({ message: "Invalid username or password" });
        
        // comparing password(password) of user with password stored in DB(user.password).
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        
        // checking credentials whether true or false.
        if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid username or password" });
        
        generateTokenAndSetCookie(user._id, res);
        
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
        });
    } 
    catch (err) {
        res.status(500).json({ message: err.message });
        console.log("Error in loginUser: ", err.message);
    }
};


const logoutUser = async (req, res) => {
    try {
        res.cookie("jwt","",{maxAge:1});
        res.status(200).json({ message: "User logged out Successfully" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
        console.log("Error in loginUser: ", err.message);
    }
};


const followUnFollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);   // user which will be followed or unfollowed.
        const currentUser = await User.findById(req.user._id);    // user which is loggedin to modify its followers. got it from protecRoute req object.

        if(id === req.user._id.toString()) return res.status(400).json({ message: "You cannot follow or unfollow yourself" });

        if(!userToModify || !currentUser) return res.status(400).json({ message: "User not found" });

        const isFollowing = currentUser.following.includes(id);

        if(isFollowing){
            // Unfollow user 
            
            // modify curent user following.
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id} } );
            
            //modify followers of userToModify
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id} } );
            
            res.status(200).json({ message: "User unfollowed Successfully" });
        }
        else{
            // Follow User
            
            // modify curent user following.
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id} } );
            
            //modify followers of userToModify
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id} } );

            res.status(200).json({ message: "User followed Successfully" });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
        console.log("Error in followUnFollowUser: ", err.message);
    }
};


const updateUser = async (req, res) => {
    const { name, email, username, password, profilePic, bio } = req.body;
    const userId = req.user._id;
    try {
        let user = await User.findById(userId);
        if (!user) return res.status(400).json({ message: "User not found" });

        // adding check for not able to update profile of other Users.
        // converting userId to string as it is returned as object and string != object.
        if(req.params.id !== userId.toString()) return res.status(400).json({ message: "You cannot update other users profile" });

        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedpassword = await bcrypt.hash(password, salt);
            user.password = hashedpassword;
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;

        user = await user.save();
        res.status(200).json({ message: "User Updated Successfully", user})
    }
    catch (err) {
        res.status(500).json({ message: err.message});
        console.log("Error in updateUser: ", err.message);
    }
};

export { signupUser, loginUser, logoutUser, followUnFollowUser, updateUser, getUserProfile };