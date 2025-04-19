import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.route.js"
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/tv.route.js";
import searchRoutes from "./routes/search.route.js";
import { verifyJWT } from "./middlewares/auth.middleware.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/movie", movieRoutes);
app.use("/api/v1/tv", tvRoutes);
app.use("/api/v1/search", verifyJWT, searchRoutes);


connectDB()
.then(() => {
    app.listen(process.env.PORT || 5000, ()=>{
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err)=> {
    console.log(err);
})