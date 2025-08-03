import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import { ApiError } from "./utils/ApiError.js";
import { asyncHandler } from "./utils/asyncHandler.js";
import authRoute from "./routes/auth.route.js"
import claimRoute from "./routes/claim.route.js"
import postRoute from "./routes/post.route.js"
import userRoute from "./routes/user.route.js"

const app = express();
app.use(express.json());
// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true,
//   })
// );
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    name: "tiger",
    age: 21,
    date: "03-08-2025",
  });
});

app.use("/api/v1/users",userRoute)
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/claims",claimRoute)
app.use("/api/v1/posts", postRoute);

// error middelware
app.use(errorMiddleware);

export { app };
