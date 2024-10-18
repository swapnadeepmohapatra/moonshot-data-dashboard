import clientPromise from "./db";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";

export const adapter = MongoDBAdapter(clientPromise);
