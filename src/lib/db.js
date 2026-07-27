import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

export const connectDB = async () => {
  if (db) return db;
  await client.connect();
  db = client.db("mediqueueDB");
  console.log("✅ MongoDB connected");
  return db;
};

export const getDB = () => db;
export { client };