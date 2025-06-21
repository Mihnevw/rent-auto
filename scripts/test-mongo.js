const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://stilianmh:eyTkP9RUpKQpkFC7@rent-car.bweoreb.mongodb.net/rent-car?retryWrites=true&w=majority&appName=rent-car";

async function testConnection() {
  const client = new MongoClient(uri);
  
  try {
    console.log('Attempting to connect to MongoDB...');
    await client.connect();
    console.log('Successfully connected to MongoDB!');
    
    const db = client.db('rent-car');
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  } finally {
    await client.close();
  }
}

testConnection(); 