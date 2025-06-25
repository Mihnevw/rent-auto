import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'rent-car';

interface CarPrice {
  days_1_3: number;
  days_4_7: number;
  days_8_14: number;
  days_15_plus: number;
}

interface Car {
  _id: ObjectId;
  brand: string;
  model: string;
  name: string;
  year: number;
  fuelType: string;
  doors: number;
  price: CarPrice;
  bodyType: string;
  transmission: string;
  image: string;
  category: string;
  features: string[];
  seats: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const cars: Car[] = [
  {
    _id: new ObjectId(),
    brand: "Skoda",
    model: "Rapid",
    name: "SHKODA RAPID 2016",
    year: 2016,
    fuelType: "Gasoline",
    doors: 4,
    price: { days_1_3: 40, days_4_7: 30, days_8_14: 28, days_15_plus: 25 },
    bodyType: "sedan",
    transmission: "manual",
    image: "/images/rapid.png",
    category: "sedan",
    features: ["Air Conditioning", "Power Windows", "Central Locking", "ABS", "Airbags"],
    seats: 5,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    brand: "BMW",
    model: "5-series",
    name: "BMW 5-SERIES 2020",
    year: 2020,
    fuelType: "Diesel",
    doors: 5,
    price: { days_1_3: 75, days_4_7: 70, days_8_14: 58, days_15_plus: 55 },
    bodyType: "sedan",
    transmission: "automatic",
    image: "/images/bmw-5.png",
    category: "sedan",
    features: ["Leather Seats", "Navigation", "Parking Sensors", "Bluetooth", "Climate Control"],
    seats: 5,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    brand: "BMW",
    model: "3-series",
    name: "BMW 3-SERIES 2021",
    year: 2021,
    fuelType: "Diesel",
    doors: 5,
    price: { days_1_3: 65, days_4_7: 60, days_8_14: 58, days_15_plus: 55 },
    bodyType: "sedan",
    transmission: "automatic",
    image: "/images/bmw-3.png",
    category: "sedan",
    features: ["Leather Seats", "Navigation", "Parking Sensors", "Bluetooth", "Climate Control"],
    seats: 5,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    brand: "Mercedes",
    model: "E-class",
    name: "MERCEDES-BENZ E-CLASS 2020",
    year: 2020,
    fuelType: "Diesel",
    doors: 5,
    price: { days_1_3: 70, days_4_7: 65, days_8_14: 60, days_15_plus: 55 },
    bodyType: "sedan",
    transmission: "automatic",
    image: "/images/mercedes-e.png",
    category: "sedan",
    features: ["Leather Seats", "Navigation", "Parking Sensors", "Bluetooth", "Climate Control"],
    seats: 5,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    brand: "Mercedes",
    model: "GLC",
    name: "MERCEDES-BENZ GLC 2021",
    year: 2021,
    fuelType: "Diesel",
    doors: 5,
    price: { days_1_3: 90, days_4_7: 85, days_8_14: 80, days_15_plus: 75 },
    bodyType: "suv",
    transmission: "automatic",
    image: "/images/glc.png",
    category: "suv",
    features: ["Leather Seats", "Navigation", "360 Camera", "Bluetooth", "Climate Control"],
    seats: 5,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    brand: "Skoda",
    model: "Superb",
    name: "SHKODA SUPERB 2021",
    year: 2021,
    fuelType: "Diesel",
    doors: 5,
    price: { days_1_3: 65, days_4_7: 60, days_8_14: 58, days_15_plus: 55 },
    bodyType: "sedan",
    transmission: "automatic",
    image: "/images/superb.png",
    category: "sedan",
    features: ["Leather Seats", "Navigation", "Parking Sensors", "Bluetooth", "Climate Control"],
    seats: 5,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    brand: "Volkswagen",
    model: "Passat",
    name: "VOLKSWAGEN PASSAT 2022",
    year: 2022,
    fuelType: "Diesel",
    doors: 5,
    price: { days_1_3: 60, days_4_7: 55, days_8_14: 52, days_15_plus: 50 },
    bodyType: "sedan",
    transmission: "automatic",
    image: "/images/passat.png",
    category: "sedan",
    features: ["Navigation", "Parking Sensors", "Bluetooth", "Climate Control"],
    seats: 5,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    brand: "Ford",
    model: "Mondeo",
    name: "FORD MONDEO 2021",
    year: 2021,
    fuelType: "Diesel",
    doors: 5,
    price: { days_1_3: 60, days_4_7: 55, days_8_14: 52, days_15_plus: 50 },
    bodyType: "sedan",
    transmission: "automatic",
    image: "/images/ford-mondeo.png",
    category: "sedan",
    features: ["Navigation", "Parking Sensors", "Bluetooth", "Climate Control"],
    seats: 5,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    brand: "Ford",
    model: "Focus",
    name: "FORD FOCUS 2021",
    year: 2021,
    fuelType: "Diesel",
    doors: 5,
    price: { days_1_3: 55, days_4_7: 50, days_8_14: 45, days_15_plus: 40 },
    bodyType: "estate",
    transmission: "manual",
    image: "/images/ford-focus.png",
    category: "sedan",
    features: ["Navigation", "Parking Sensors", "Bluetooth", "Climate Control"],
    seats: 5,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    brand: "Mercedes",
    model: "C-Class",
    name: "MERCEDES C220 2021",
    year: 2021,
    fuelType: "Diesel",
    doors: 5,
    price: { days_1_3: 75, days_4_7: 70, days_8_14: 65, days_15_plus: 60 },
    bodyType: "sedan",
    transmission: "automatic",
    image: "/images/mercedes.png",
    category: "sedan",
    features: ["Leather Seats", "Navigation", "Parking Sensors", "Bluetooth", "Climate Control"],
    seats: 5,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    brand: "Land Rover",
    model: "Range Rover",
    name: "RANGE ROVER 2017",
    year: 2017,
    fuelType: "Diesel",
    doors: 5,
    price: { days_1_3: 75, days_4_7: 70, days_8_14: 65, days_15_plus: 60 },
    bodyType: "suv",
    transmission: "automatic",
    image: "/images/range.png",
    category: "suv",
    features: ["Leather Seats", "Navigation", "360 Camera", "Bluetooth", "Climate Control"],
    seats: 5,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    brand: "Jaguar",
    model: "F-Type",
    name: "JAGUAR F-TYPE 2022",
    year: 2022,
    fuelType: "Diesel",
    doors: 2,
    price: { days_1_3: 150, days_4_7: 140, days_8_14: 130, days_15_plus: 120 },
    bodyType: "coupe",
    transmission: "automatic",
    image: "/images/jaguar-f.png",
    category: "luxury",
    features: ["Leather Seats", "Navigation", "360 Camera", "Premium Sound", "Climate Control"],
    seats: 2,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    brand: "Maserati",
    model: "Ghibli",
    name: "MASERATI GHIBLI 2017",
    year: 2017,
    fuelType: "Gasoline",
    doors: 5,
    price: { days_1_3: 60, days_4_7: 55, days_8_14: 52, days_15_plus: 50 },
    bodyType: "sedan",
    transmission: "automatic",
    image: "/images/maserati.png",
    category: "luxury",
    features: ["Leather Seats", "Navigation", "360 Camera", "Premium Sound", "Climate Control"],
    seats: 5,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    brand: "Skoda",
    model: "Octavia",
    name: "SHKODA OCTAVIA 2020",
    year: 2020,
    fuelType: "Diesel",
    doors: 5,
    price: { days_1_3: 60, days_4_7: 55, days_8_14: 52, days_15_plus: 50 },
    bodyType: "estate",
    transmission: "automatic",
    image: "/images/shkoda.png",
    category: "sedan",
    features: ["Navigation", "Parking Sensors", "Bluetooth", "Climate Control"],
    seats: 5,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    brand: "Skoda",
    model: "Octavia",
    name: "SHKODA OCTAVIA 2012",
    year: 2012,
    fuelType: "Gasoline",
    doors: 5,
    price: { days_1_3: 35, days_4_7: 30, days_8_14: 28, days_15_plus: 25 },
    bodyType: "estate",
    transmission: "manual",
    image: "/images/shkoda-octavia.png",
    category: "sedan",
    features: ["Air Conditioning", "Power Windows", "Central Locking", "ABS"],
    seats: 5,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    brand: "Citroen",
    model: "C4-Picasso",
    name: "CITROEN GRAND C4 PICASSO 2016",
    year: 2016,
    fuelType: "Gasoline",
    doors: 5,
    price: { days_1_3: 60, days_4_7: 55, days_8_14: 52, days_15_plus: 50 },
    bodyType: "suv",
    transmission: "manual",
    image: "/images/citroen.png",
    category: "suv",
    features: ["Air Conditioning", "Parking Sensors", "7 Seats", "Bluetooth"],
    seats: 7,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new ObjectId(),
    brand: "Opel",
    model: "Insignia",
    name: "OPEL INSIGNIA 2019",
    year: 2019,
    fuelType: "Diesel",
    doors: 5,
    price: { days_1_3: 60, days_4_7: 55, days_8_14: 52, days_15_plus: 50 },
    bodyType: "estate",
    transmission: "manual",
    image: "/images/opel.png",
    category: "sedan",
    features: ["Navigation", "Parking Sensors", "Bluetooth", "Climate Control"],
    seats: 5,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedCars() {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    
    // Drop existing cars collection if it exists
    await db.collection('cars').drop().catch(() => console.log('No existing cars collection'));
    
    // Create cars collection
    await db.createCollection('cars');
    
    // Insert cars
    const result = await db.collection('cars').insertMany(cars);
    console.log(`Successfully inserted ${result.insertedCount} cars`);
    
    await client.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding cars:', error);
    process.exit(1);
  }
}

// Run the seeder
seedCars().then(() => {
  console.log('Seeding completed successfully');
  process.exit(0);
}).catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
}); 