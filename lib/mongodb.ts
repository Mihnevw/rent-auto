import { MongoClient, Db } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Missing MONGODB_URI environment variable')
}

const uri = process.env.MONGODB_URI
const options = {
  connectTimeoutMS: 10000, // 10 seconds
  socketTimeoutMS: 45000,  // 45 seconds
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
      .then(client => {
        console.log('MongoDB connected successfully')
        return client
      })
      .catch(err => {
        console.error('MongoDB connection error:', err)
        throw err
      })
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
    .then(client => {
      console.log('MongoDB connected successfully')
      return client
    })
    .catch(err => {
      console.error('MongoDB connection error:', err)
      throw err
    })
}

export async function getMongoDb(): Promise<Db> {
  try {
    const client = await clientPromise
    const db = client.db()
    return db
  } catch (err) {
    console.error('Error getting MongoDB database:', err)
    throw err
  }
} 