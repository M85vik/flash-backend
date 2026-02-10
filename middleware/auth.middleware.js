import jwt from "jsonwebtoken"
import { User } from "../models/User.js"

export const protectRoute = async (req,res,next)=>{
try {
    const token = req.cookies.jwt;

    if(!token) return res.status(401).json({message:"Unauthorized User 1"});
    const JWT_SECRET= process.env.JWT_SECRET
    const decoded = jwt.verify(token,JWT_SECRET)

    if(!decoded) return res.status(401).json({message:"Unauthorized User 2"})

        const user = await User.findById(decoded.userID).select("-password");

        if(!user) return res.status(401).json({message:"Unauthorized User 3"})
        req.user= user
            next()
    
} catch (error) {

    console.log("Authenticating Error.");
    res.status(500).json({message:"Internal Servor Error"})
    
    
}
}