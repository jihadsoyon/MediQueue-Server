import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import tutorsRouter from "./routes/tutors.routes.js";
import bookingsRouter from "./routes/bookings.routes.js";
import jwtRouter from "./routes/jwt.routes.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/", jwtRouter);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());

app.use("/tutors", tutorsRouter);
app.use("/bookings", bookingsRouter);

app.get("/", (req, res) => {
  res.send("MediQueue server is running");
});

const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`🚀 MediQueue server listening on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

start();