import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as unknown as {
  mongooseCache?: MongooseCache;
};

const cached = globalForMongoose.mongooseCache ?? {
  conn: null,
  promise: null
};

if (!globalForMongoose.mongooseCache) {
  globalForMongoose.mongooseCache = cached;
}

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined. Add it to your environment before using database routes.");
  }

  if (cached.conn) return cached.conn;

  cached.promise ??= mongoose.connect(uri, {
    bufferCommands: false,
    dbName: process.env.MONGODB_DB ?? "dual_workspace"
  });

  cached.conn = await cached.promise;
  return cached.conn;
}
