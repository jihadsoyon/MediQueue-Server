import { Router } from "express";
import { getTutors } from "../controllers/tutors.controller.js";

const router = Router();

router.get("/", getTutors);

export default router;