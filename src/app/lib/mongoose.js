import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Caching the connection to prevent re-connections in development
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection is not cached, create a new one
  if (!cached.promise) {
    const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true }, bufferCommands: false, };

    cached.promise = mongoose.connect(MONGODB_URI, clientOptions)
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;