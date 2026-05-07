/**
 * MongoDB Connection Manager
 * Ensures single connection reuse in Next.js serverless environment
 * Prevents connection leaks and multiple connections per request
 */

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Create a global object to store the connection cache
declare global {
  var mongooseCache: CachedConnection;
}

// Initialize the global cache if it doesn't exist
if (!global.mongooseCache) {
  global.mongooseCache = { conn: null, promise: null };
}

const cached: CachedConnection = global.mongooseCache;

/**
 * Connect to MongoDB
 * Reuses existing connection if available, otherwise creates new one
 * @returns Promise<typeof mongoose>
 */
async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI as string, {
        bufferCommands: false,
      })
      .then((mongoose) => {
        console.log('✅ Connected to MongoDB');
        return mongoose;
      })
      .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
