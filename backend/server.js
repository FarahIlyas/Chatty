import express from "express";
import dotenv from "dotenv";
import connectDB from './db/connectDB.js';
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";

dotenv.config(); // allows to see the content inside .env file

connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

    // Middlewares: it is function that is run between request and response.

// builtin express Middleware (app.use)
app.use(express.json());    // To parse JSON data in the req.body

app.use(express.urlencoded({ extended: true }));    // To parse form data in the req.body
// for (extended: true) = even if the request body has some nested object is gonna be parsed that without any problem.

app.use(cookieParser());    // allow us to get the cookie from request and then set the cookie inside response.

//Routes
app.use("/api/users", userRoutes);   // when we hit the "/api/users" userRoutes will be called.

app.listen(PORT, () => console.log(`server started at https://localhost:${PORT}`));