import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from 'cors';


import authRoute from "./routes/auth.routes.js";
import userRoute from "./routes/user.routes.js";
import rideRoute from "./routes/ride.routes.js";

const app = express();
const PORT = 8080;

dotenv.config();

const connectDB = () => {
  mongoose.set("strictQuery", true);

  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log("Database connected");

      // Ping the database to check for connectivity
      const db = mongoose.connection;
      db.db.command({ ping: 1 })
        .then(() => console.log("Database ping successful"))
        .catch((error) => console.error("Database ping failed:", error));
    })
    .catch((error) => console.log(error));
};
// Removed CORS middleware
// Configure CORS
app.use(cors({
  origin: 'http://localhost:5173', // Allow your client application's origin
  credentials: true, // If your front-end needs to send cookies to the back-end
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],//allow methods why not
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/rides", rideRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    error: errorMessage,
  });
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Connected to backend on PORT: ${PORT}`);
});