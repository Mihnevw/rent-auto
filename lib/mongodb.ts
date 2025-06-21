import { MongoClient, Db } from 'mongodb'
import type { Car } from '@/models/car';

if (!process.env.MONGODB_URI) {
  throw new Error('Missing MONGODB_URI environment variable')
}

// Ensure we have the database name in the URI
const uri = process.env.MONGODB_URI
const client = new MongoClient(uri, {
  connectTimeoutMS: 10000, // 10 seconds
  socketTimeoutMS: 45000,  // 45 seconds
})

let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable so the value is preserved across module reloads
  if (!(global as any)._mongoClientPromise) {
    ;(global as any)._mongoClientPromise = client.connect()
      .catch(err => {
        console.error('MongoDB connection error:', err)
        throw err
      })
  }
  clientPromise = (global as any)._mongoClientPromise
} else {
  // In production, create a new client for every connection
  clientPromise = client.connect()
    .catch(err => {
      console.error('MongoDB connection error:', err)
      throw err
    })
}

export async function getMongoDb(): Promise<Db> {
  try {
    const client = await clientPromise
    return client.db('rent-car') // Explicitly specify the database name
  } catch (err) {
    console.error('Error getting MongoDB database:', err)
    throw err
  }
} 