import { getMongoDb } from '@/lib/mongodb'

async function seedCars() {
    try {
        const db = await getMongoDb()

        const cars = [
            {
                "brand": "Skoda",
                "model": "Rapid",
                "year": 2016,
                "fuelType": "Gasoline",
                "doors": 4,
                "price": { "days_1_3": 40, "days_4_7": 30, "days_8_14": 28, "days_15_plus": 25 },
                "bodyType": "sedan",
                "transmission": "manual"
            },
            {
                "brand": "BMW",
                "model": "5-series",
                "year": 2020,
                "fuelType": "Diesel",
                "doors": 5,
                "price": { "days_1_3": 75, "days_4_7": 70, "days_8_14": 58, "days_15_plus": 55 },
                "bodyType": "sedan",
                "transmission": "automatic"
            },
            {
                "brand": "BMW",
                "model": "3-series",
                "year": 2021,
                "fuelType": "Diesel",
                "doors": 5,
                "price": { "days_1_3": 65, "days_4_7": 60, "days_8_14": 58, "days_15_plus": 55 },
                "bodyType": "sedan",
                "transmission": "automatic"
            },
            {
                "brand": "Mercedes",
                "model": "E-class",
                "year": 2020,
                "fuelType": "Diesel",
                "doors": 5,
                "price": { "days_1_3": 70, "days_4_7": 65, "days_8_14": 60, "days_15_plus": 55 },
                "bodyType": "sedan",
                "transmission": "automatic"
            },
            {
                "brand": "Mercedes",
                "model": "GLC",
                "year": 2021,
                "fuelType": "Diesel",
                "doors": 5,
                "price": { "days_1_3": 90, "days_4_7": 85, "days_8_14": 80, "days_15_plus": 75 },
                "bodyType": "suv",
                "transmission": "automatic"
            },
            {
                "brand": "Skoda",
                "model": "Superb",
                "year": 2021,
                "fuelType": "Diesel",
                "doors": 5,
                "price": { "days_1_3": 65, "days_4_7": 60, "days_8_14": 58, "days_15_plus": 55 },
                "bodyType": "sedan",
                "transmission": "automatic"
            },
            {
                "brand": "Volkswagen",
                "model": "Passat",
                "year": 2022,
                "fuelType": "Diesel",
                "doors": 5,
                "price": { "days_1_3": 60, "days_4_7": 55, "days_8_14": 52, "days_15_plus": 50 },
                "bodyType": "sedan",
                "transmission": "automatic"
            },
            {
                "brand": "Ford",
                "model": "Mondeo",
                "year": 2021,
                "fuelType": "Diesel",
                "doors": 5,
                "price": { "days_1_3": 60, "days_4_7": 55, "days_8_14": 52, "days_15_plus": 50 },
                "bodyType": "sedan",
                "transmission": "automatic"
            },
            {
                "brand": "Ford",
                "model": "Focus",
                "year": 2021,
                "fuelType": "Diesel",
                "doors": 5,
                "price": { "days_1_3": 55, "days_4_7": 50, "days_8_14": 45, "days_15_plus": 40 },
                "bodyType": "estate",
                "transmission": "manual"
            },
            {
                "brand": "Mercedes",
                "model": "C-Class",
                "year": 2021,
                "fuelType": "Diesel",
                "doors": 5,
                "price": { "days_1_3": 75, "days_4_7": 70, "days_8_14": 65, "days_15_plus": 60 },
                "bodyType": "sedan",
                "transmission": "automatic"
            },
            {
                "brand": "Land Rover",
                "model": "Range Rover",
                "year": 2017,
                "fuelType": "Diesel",
                "doors": 5,
                "price": { "days_1_3": 75, "days_4_7": 70, "days_8_14": 65, "days_15_plus": 60 },
                "bodyType": "suv",
                "transmission": "automatic"
            },
            {
                "brand": "Jaguar",
                "model": "F-Type",
                "year": 2022,
                "fuelType": "Diesel",
                "doors": 2,
                "price": { "days_1_3": 150, "days_4_7": 140, "days_8_14": 130, "days_15_plus": 120 },
                "bodyType": "coupe",
                "transmission": "automatic"
            },
            {
                "brand": "Maserati",
                "model": "Ghibli",
                "year": 2017,
                "fuelType": "Gasoline",
                "doors": 5,
                "price": { "days_1_3": 60, "days_4_7": 55, "days_8_14": 52, "days_15_plus": 50 },
                "bodyType": "sedan",
                "transmission": "automatic"
            },
            {
                "brand": "Skoda",
                "model": "Octavia",
                "year": 2020,
                "fuelType": "Diesel",
                "doors": 5,
                "price": { "days_1_3": 60, "days_4_7": 55, "days_8_14": 52, "days_15_plus": 50 },
                "bodyType": "estate",
                "transmission": "automatic"
            },
            {
                "brand": "Skoda",
                "model": "Octavia",
                "year": 2012,
                "fuelType": "Gasoline",
                "doors": 5,
                "price": { "days_1_3": 35, "days_4_7": 30, "days_8_14": 28, "days_15_plus": 25 },
                "bodyType": "estate",
                "transmission": "manual"
            },
            {
                "brand": "Citroen",
                "model": "C4-Picasso",
                "year": 2016,
                "fuelType": "Gasoline",
                "doors": 5,
                "price": { "days_1_3": 60, "days_4_7": 55, "days_8_14": 52, "days_15_plus": 50 },
                "bodyType": "suv",
                "transmission": "manual"
            },
            {
                "brand": "Opel",
                "model": "Insignia",
                "year": 2019,
                "fuelType": "Diesel",
                "doors": 5,
                "price": { "days_1_3": 60, "days_4_7": 55, "days_8_14": 52, "days_15_plus": 50 },
                "bodyType": "estate",
                "transmission": "manual"
            }
        ]

        const result = await db.collection('cars').insertMany(cars)
        console.log('Inserted cars:', result.insertedIds)
    } catch (err) {
        console.error('Error seeding cars:', err)
    }
}

seedCars()
