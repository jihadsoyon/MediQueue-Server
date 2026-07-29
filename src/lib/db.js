
import { MongoClient, ServerApiVersion } from "mongodb";
import { seedTutors } from "../../seed/seedTutors.js";

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;
let connectPromise;

export const connectDB = () => {
  if (db) return Promise.resolve(db);

  if (!connectPromise) {
    connectPromise = client.connect().then(async () => {
      db = client.db("mediqueueDB");
      const tutorCollection = db.collection("tutors");
      const count = await tutorCollection.countDocuments();

      if (count === 0) {
        const tutors = seedTutors.map((tutor) => ({
          ...tutor,
          createdAt: new Date(),
        }));
        await tutorCollection.insertMany(tutors);
        console.log("✅ Default tutors inserted");
      }

      console.log("✅ MongoDB connected");
      return db;
    });
  }

  return connectPromise;
};

export const getDB = () => db;
export { client };