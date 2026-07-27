import { getDB } from "../lib/db.js";
import { ObjectId } from "mongodb";

export const getTutors = async (req, res) => {
  try {
    const db = getDB();
    const { limit, search, startDate, endDate } = req.query;

    const query = {};

    if (search) {
      query.tutorName = { $regex: search, $options: "i" };
    }

    if (startDate || endDate) {
      query.sessionStartDate = {};
      if (startDate) query.sessionStartDate.$gte = startDate;
      if (endDate) query.sessionStartDate.$lte = endDate;
    }

    let cursor = db.collection("tutors").find(query).sort({ createdAt: -1 });
    if (limit) cursor = cursor.limit(parseInt(limit));

    const tutors = await cursor.toArray();
    res.send(tutors);
  } catch (error) {
    res.status(500).send({ message: "Failed to load tutors" });
  }
};

export const createTutor = async (req, res) => {
  try {
    const db = getDB();
    const tutor = {
      ...req.body,
      userEmail: req.user.email,
      createdAt: new Date(),
    };
    const result = await db.collection("tutors").insertOne(tutor);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to add tutor" });
  }
};

export const getMyTutors = async (req, res) => {
  try {
    const db = getDB();
    const tutors = await db
      .collection("tutors")
      .find({ userEmail: req.user.email })
      .sort({ createdAt: -1 })
      .toArray();
    res.send(tutors);
  } catch (error) {
    res.status(500).send({ message: "Failed to load your tutors" });
  }
};

export const updateTutor = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const tutor = await db.collection("tutors").findOne({ _id: new ObjectId(id) });

    if (!tutor) return res.status(404).send({ message: "Tutor not found" });
    if (tutor.userEmail !== req.user.email) {
      return res.status(403).send({ message: "Forbidden access" });
    }

    const { _id, ...updateData } = req.body;
    const result = await db
      .collection("tutors")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to update tutor" });
  }
};

export const deleteTutor = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const tutor = await db.collection("tutors").findOne({ _id: new ObjectId(id) });

    if (!tutor) return res.status(404).send({ message: "Tutor not found" });
    if (tutor.userEmail !== req.user.email) {
      return res.status(403).send({ message: "Forbidden access" });
    }

    const result = await db.collection("tutors").deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to delete tutor" });
  }
};