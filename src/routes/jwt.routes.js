
import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/jwt", async (req, res) => {
  const user = req.body; // { email }
  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.send({ token });
});

export default router;