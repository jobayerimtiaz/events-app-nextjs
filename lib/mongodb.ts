import mongoose from "mongoose";

// Define the type for the cached connection
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Extend the NodeJS global type to include our mongoose cache
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// Get MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// Initialize the cache on the global object to persist across hot reloads in development
const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Establishes a connection to MongoDB using Mongoose.
 * Caches the connection to prevent multiple connections during development hot reloads.
 *
 * @returns Promise that resolves to the Mongoose instance
 */
async function dbConnect(): Promise<typeof mongoose> {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Return existing promise if a connection is being established
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable command buffering
    };

    // Create a new connection promise
    cached.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongooseInstance) => {
        return mongooseInstance;
      });
  }

  try {
    // Wait for the connection to be established and cache it
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset the promise on error so the next call attempts a new connection
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default dbConnect;
