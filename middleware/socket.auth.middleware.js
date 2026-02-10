import jwt from "jsonwebtoken"
import { User } from "../models/User.js"



export const socketAuthMiddleware = async (socket, next)=>{

try {
    const token = socket.handshake.headers.cookie ?.split("; ").find((row)=> row.startsWith("jwt="))?.split("=")[1];


  if(!token) {
    console.log("Socket Connection Rejected : No Token Provided");
    return next(new Error("Unauthorized - No token Provided "))
    
  }


  const JWT_SECRET= process.env.JWT_SECRET
    const decoded = jwt.verify(token,JWT_SECRET)

    if(!decoded) {
        console.log("Socket Connection Rejected : Invalid Token ");
        
        return next(new Error("Unauthorized - No token Provided "))
    }


       const user = await User.findById(decoded.userID).select("-password");
    
            if(!user)  {
                  console.log("Socket Connection Rejected : User Not Found ");
              return next(new Error("User Not Found"))
            }


            socket.user=user
            socket.userId=user._id.toString()
            next();
            
         

} catch (error) {

    console.log("Error in socket authentication : ",error.message);
 next(new Error("Unauthorized Authentication Failed."))
    

    
}

}