import { User } from "../models/User.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../utils/generateToken.js"
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import cloudinary from "../config/cloudinary.js";



export const signup = async (req, res) => {

    const { fullName, email, password } = req.body

    try {
        if (!fullName || !email || !email) {
            return res.status(400).json({ message: "All fields are required." })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters." })
        }

        // check if emailis valid: regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }



        const user = await User.findOne({ email })

        if (user) return res.status(400).json({ message: "Email Already Exists." })

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        await newUser.save()

        if (newUser) {
            const token = generateToken(newUser._id, res);

            // await sendWelcomeEmail(email, fullName, "www.google.com")

            res.status(201).json({
                message: "User created Successfully.", _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        }





    } catch (error) {

        console.log("Signup Error :", error);
        res.status(500).json({ message: "Internal Servor Error." })
    }

}



export const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email })

        if (!user) return res.status(400).json({ message: "Invalid Credentials." })

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid Credentials." })

        const token = generateToken(user._id, res);


        res.status(200).json({ message: "Login Successfull", _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic, })





    } catch (error) {
        console.log("Login Error ", error.message);
        res.status(500).json({ message: "Internal Servor Error..." })

    }

}



export const logout = async (_, res) => {


    res.cookie("jwt", "", { maxAge: 0 })
    res.status(200).json({ message: "Logged Out Successfully" })



}


export const updateProfile = async (req, res) => {
    console.log("API  HIT UPDATE PROFILE");
    try {
        const { profilePic } = req.body
        if (!profilePic) return res.status(400).json({ message: "Profile Picture is Required." })

        const userID = req.user._id

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        console.log("Log of Cloudinary Response ,", uploadResponse);

        const updatedUser = await User.findByIdAndUpdate(userID, 
            {
            profilePic: uploadResponse.secure_url },
            { new: true }
        )


        res.status(200).json(updatedUser);

    } catch (error) {

        console.log("Update Profile Error...");
        res.status(500).json({ message: "Internal Servor Error", error });

    }


}