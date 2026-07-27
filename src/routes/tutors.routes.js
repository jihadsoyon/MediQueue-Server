import { Router } from "express";
import {
  getTutors,
  getTutorById,
  createTutor,
  getMyTutors,
  updateTutor,
  deleteTutor,
} from "../controllers/tutors.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = Router();

router.get("/", getTutors);
router.get("/my-tutors", verifyJWT, getMyTutors);
router.get("/:id", getTutorById);
router.post("/", verifyJWT, createTutor);
router.patch("/:id", verifyJWT, updateTutor);
router.delete("/:id", verifyJWT, deleteTutor);

export default router;