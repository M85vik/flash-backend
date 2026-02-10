import dotenv from 'dotenv'
dotenv.config();
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import { connectToDatabase } from "./config/db.js";
import { app, server } from './config/socket.js';




connectToDatabase();

const FRONTEND_URL= process.env.FRONTEND_URL
if(!FRONTEND_URL) throw new Error("Front URL Environment Varibale Not loaded.");
app.use(express.json({limit:"5mb"}))
app.use(cors()); //"http://localhost:3000","http://localhost:5173"
app.use(cookieParser());


app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes);
app.get("/test",(req,res)=>{ res.send("<h1> HELLO WORLD!! </h1>")})

const PORT = process.env.PORT || 3001;






server.listen(PORT, ()=> console.log(`Server is running at http://localhost:${PORT}`))
