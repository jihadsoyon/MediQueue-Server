import { getDB } from "../lib/db.js";
import { ObjectId } from "mongodb";

export const createBooking = async (req, res) => {
  try {
    const db = getDB();
    const { tutorId } = req.body;

    const tutor = await db.collection("tutors").findOne({ _id: new ObjectId(tutorId) });
    if (!tutor) return res.status(404).send({ message: "Tutor not found" });

    if (tutor.totalSlot <= 0) {
      return res.status(400).send({ message: "No available slots left." });
    }

    const today = new Date().toISOString().split("T")[0];
    if (today < tutor.sessionStartDate) {
      return res.status(400).send({ message: "Booking is not available yet for this tutor" });
    }

    const booking = {
      tutorId,
      tutorName: tutor.tutorName,
      subject: tutor.subject,
      studentName: req.body.studentName,
      studentEmail: req.user.email,
      studentPhone: req.body.studentPhone,
      status: "Confirmed",
      createdAt: new Date(),
    };

    const result = await db.collection("bookings").insertOne(booking);

    await db.collection("tutors").updateOne(
      { _id: new ObjectId(tutorId) },
      { $inc: { totalSlot: -1 } }
    );

    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to book session" });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const db = getDB();
    const bookings = await db
      .collection("bookings")
      .find({ studentEmail: req.user.email })
      .sort({ createdAt: -1 })
      .toArray();
    res.send(bookings);
  } catch (error) {
    res.status(500).send({ message: "Failed to load your bookings" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    const booking = await db.collection("bookings").findOne({ _id: new ObjectId(id) });
    if (!booking) return res.status(404).send({ message: "Booking not found" });
    if (booking.studentEmail !== req.user.email) {
      return res.status(403).send({ message: "Forbidden access" });
    }

    const result = await db
      .collection("bookings")
      .updateOne({ _id: new ObjectId(id) }, { $set: { status: "Cancelled" } });

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to cancel booking" });
  }
};