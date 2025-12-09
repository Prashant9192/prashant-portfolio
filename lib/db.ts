import { MongoClient, Db, MongoClientOptions } from 'mongodb'

// Declare global type for MongoDB client promise (for both dev and serverless)
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

function getClientPromise(): Promise<MongoClient> | null {
  // Don't initialize if MONGODB_URI is not set (e.g., during build)
  if (!process.env.MONGODB_URI) {
    console.error('[MongoDB] MONGODB_URI environment variable is not set')
    return null
  }

  // Return existing promise if already initialized
  if (clientPromise) {
    return clientPromise
  }

  const uri: string = process.env.MONGODB_URI

  // Connection options optimized for serverless environments (Vercel)
  const options: MongoClientOptions = {
    maxPoolSize: 10, // Maintain up to 10 socket connections
    minPoolSize: 1, // Maintain at least 1 socket connection
    maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
    serverSelectionTimeoutMS: 5000, // How long to try selecting a server (5 seconds)
    socketTimeoutMS: 45000, // How long a send or receive on a socket can take before timeout
    connectTimeoutMS: 10000, // How long to wait for initial connection (10 seconds)
    // Important for serverless: enable connection monitoring
    monitorCommands: false,
    // Retry configuration
    retryWrites: true,
    retryReads: true,
  }

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      console.log('[MongoDB] Creating new client connection (development)')
      client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect().catch((error) => {
        console.error('[MongoDB] Failed to connect in development:', error)
        // Reset the promise on error so it can be retried
        global._mongoClientPromise = undefined
        throw error
      })
    }
    clientPromise = global._mongoClientPromise
  } else {
    // In production/serverless mode, reuse connections via global variable
    // This is safe in serverless because each deployment is isolated
    if (!global._mongoClientPromise) {
      console.log('[MongoDB] Creating new client connection (production/serverless)')
      client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect().catch((error) => {
        console.error('[MongoDB] Failed to connect in production:', error)
        // Reset the promise on error so it can be retried
        global._mongoClientPromise = undefined
        throw error
      })
    }
    clientPromise = global._mongoClientPromise
  }

  return clientPromise
}

export async function getDb(): Promise<Db | null> {
  try {
    const promise = getClientPromise()
    if (!promise) {
      console.error('[MongoDB] Cannot get database: MONGODB_URI not configured')
      return null
    }
    
    const client = await promise
    
    // Don't ping on every request - connection pooling handles this
    // The driver will automatically reconnect if the connection is lost
    
    return client.db('portfolio-cms')
  } catch (error: any) {
    // Log detailed error information for debugging
    console.error('[MongoDB] Connection error:', {
      message: error?.message || 'Unknown error',
      name: error?.name || 'Error',
      code: error?.code || 'NO_CODE',
      codeName: error?.codeName || 'NO_CODE_NAME',
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    })
    
    // Reset client promise on error to allow retry
    clientPromise = null
    if (global._mongoClientPromise) {
      global._mongoClientPromise = undefined
    }
    
    return null
  }
}

