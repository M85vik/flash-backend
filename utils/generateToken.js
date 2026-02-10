import dotenv from 'dotenv'
dotenv.config();
import jwt from "jsonwebtoken"


const JWT_SECRET=process.env.JWT_SECRET 
if(!JWT_SECRET)  throw new Error("JWT_SECRET environment variable is not set.");
export const generateToken = (userID,res)=>{
  let token;
  try {
      token= jwt.sign(
          {userID},
          JWT_SECRET,
          {
              expiresIn:"7d"
          }
      );
   
      res.cookie("jwt",token,{
          maxAge:7*2*60*60*1000,
          httpOnly:true,
          sameSite:"strict",
            secure: true
        })
        return token;
  } catch (error) {
      console.log("Error while creating token :",error);
      
  }

}