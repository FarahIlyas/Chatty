import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId,res) => {
    // creating jwt token
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {  // passing userId object as payload which will be inside the token
        expiresIn: "15d",
    })
    // setting token as cookie
    res.cookie("jwt",token,{
        httpOnly: true, // This cookie cannot be accessed by the browser/JS.
        maxAge: 15 * 24 * 60 * 60 * 1000,   // passing 15 days in milliseconds as it only accept this.
        sameSite: "strict",
    })
    return token;
}

export default generateTokenAndSetCookie