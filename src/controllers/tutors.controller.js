import { getDB } from "../lib/db.js";

export const getTutors = async (req, res) => {
  try {
    const db = getDB();
    const { limit } = req.query;

    let cursor = db.collection("tutors").find({}).sort({ createdAt: -1 });
    if (limit) cursor = cursor.limit(parseInt(limit));

    const tutors = await cursor.toArray();
    res.send(tutors);
  } catch (error) {
    res.status(500).send({ message: "Failed to load tutors" });
  }
};