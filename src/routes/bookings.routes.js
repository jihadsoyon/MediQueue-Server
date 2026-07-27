import { Router } from "express";
import { createBooking, getMyBookings, cancelBooking } from "../controllers/bookings.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = Router();

router.post("/", verifyJWT, createBooking);
router.get("/my-bookings", verifyJWT, getMyBookings);
router.patch("/:id/cancel", verifyJWT, cancelBooking);

export default router;