import { MongoClient } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

/*
 * Do NOT create the client at module-evaluation time.
 * Next.js evaluates server modules during `next build` to collect page data,
 * and the MONGODB_URI env var is not available in the build environment
 * (only at runtime on the server). Creating the client lazily on first call
 * means the build succeeds and the error only surfaces if the env var is
 * genuinely missing at runtime.
 */
function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set in environment variables");

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(uri).connect();
    }
    return global._mongoClientPromise;
  }

  return new MongoClient(uri).connect();
}

export default getClientPromise;
