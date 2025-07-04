require('dotenv').config();
const mongoose = require('mongoose');
const Car = require('../models/carModel');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rent-car';

const cars = [
    {
        make: "Skoda",
        model: "Rapid",
        name: "SHKODA RAPID 2016",
        mainImage: "/images/rapid.png",
        thumbnails: ["/images/rapid.png"],
        engine: "1.6 TDI",
        fuel: "Diesel",
        transmission: "manual",
        seats: "5",
        doors: "4",
        year: "2016",
        consumption: "5.2L/100km",
        bodyType: "sedan",
        priceIncludes: [
            "Full Insurance",
            "Unlimited Mileage",
            "24/7 Support",
            "Free Delivery"
        ],
        features: [
            "Air Conditioning",
            "Power Windows",
            "Central Locking",
            "ABS",
            "Airbags"
        ],
        pricing: {
            "1_3": 40,
            "4_7": 30,
            "8_14": 28,
            "15_plus": 25
        }
    },
    {
        make: "BMW",
        model: "5-series",
        name: "BMW 5-SERIES 2020",
        mainImage: "/images/bmw-5.png",
        thumbnails: ["/images/bmw-5.png"],
        engine: "2.0 TDI",
        fuel: "Diesel",
        transmission: "automatic",
        seats: "5",
        doors: "5",
        year: "2020",
        consumption: "6.5L/100km",
        bodyType: "sedan",
        priceIncludes: [
            "Full Insurance",
            "Unlimited Mileage",
            "24/7 Support",
            "Free Delivery"
        ],
        features: [
            "Leather Seats",
            "Navigation",
            "Parking Sensors",
            "Bluetooth",
            "Climate Control"
        ],
        pricing: {
            "1_3": 75,
            "4_7": 70,
            "8_14": 58,
            "15_plus": 55
        }
    },
    {
        make: "BMW",
        model: "3-series",
        name: "BMW 3-SERIES 2021",
        mainImage: "/images/bmw-3.png",
        thumbnails: ["/images/bmw-3.png"],
        engine: "2.0 TDI",
        fuel: "Diesel",
        transmission: "automatic",
        seats: "5",
        doors: "5",
        year: "2021",
        consumption: "6.0L/100km",
        bodyType: "sedan",
        priceIncludes: [
            "Full Insurance",
            "Unlimited Mileage",
            "24/7 Support",
            "Free Delivery"
        ],
        features: [
            "Leather Seats",
            "Navigation",
            "Parking Sensors",
            "Bluetooth",
            "Climate Control"
        ],
        pricing: {
            "1_3": 65,
            "4_7": 60,
            "8_14": 58,
            "15_plus": 55
        }
    },
    {
        make: "Mercedes",
        model: "E-class",
        name: "MERCEDES-BENZ E-CLASS 2020",
        mainImage: "/images/mercedes-e.png",
        thumbnails: ["/images/mercedes-e.png"],
        engine: "2.0 CDI",
        fuel: "Diesel",
        transmission: "automatic",
        seats: "5",
        doors: "5",
        year: "2020",
        consumption: "6.8L/100km",
        bodyType: "sedan",
        priceIncludes: [
            "Full Insurance",
            "Unlimited Mileage",
            "24/7 Support",
            "Free Delivery"
        ],
        features: [
            "Leather Seats",
            "Navigation",
            "Parking Sensors",
            "Bluetooth",
            "Climate Control"
        ],
        pricing: {
            "1_3": 70,
            "4_7": 65,
            "8_14": 60,
            "15_plus": 55
        }
    },
    {
        make: "Mercedes",
        model: "GLC",
        name: "MERCEDES-BENZ GLC 2021",
        mainImage: "/images/glc.png",
        thumbnails: ["/images/glc.png"],
        engine: "2.0 CDI",
        fuel: "Diesel",
        transmission: "automatic",
        seats: "5",
        doors: "5",
        year: "2021",
        consumption: "7.2L/100km",
        bodyType: "suv",
        priceIncludes: [
            "Full Insurance",
            "Unlimited Mileage",
            "24/7 Support",
            "Free Delivery"
        ],
        features: [
            "Leather Seats",
            "Navigation",
            "360 Camera",
            "Bluetooth",
            "Climate Control"
        ],
        pricing: {
            "1_3": 90,
            "4_7": 85,
            "8_14": 80,
            "15_plus": 75
        }
    },
    {
        make: "Skoda",
        model: "Superb",
        name: "SHKODA SUPERB 2021",
        mainImage: "/images/superb.png",
        thumbnails: ["/images/superb.png"],
        engine: "2.0 TDI",
        fuel: "Diesel",
        transmission: "automatic",
        seats: "5",
        doors: "5",
        year: "2021",
        consumption: "5.8L/100km",
        bodyType: "sedan",
        priceIncludes: [
            "Full Insurance",
            "Unlimited Mileage",
            "24/7 Support",
            "Free Delivery"
        ],
        features: [
            "Leather Seats",
            "Navigation",
            "Parking Sensors",
            "Bluetooth",
            "Climate Control"
        ],
        pricing: {
            "1_3": 65,
            "4_7": 60,
            "8_14": 58,
            "15_plus": 55
        }
    },
    {
        make: "Volkswagen",
        model: "Passat",
        name: "VOLKSWAGEN PASSAT 2022",
        mainImage: "/images/passat.png",
        thumbnails: ["/images/passat.png"],
        engine: "2.0 TDI",
        fuel: "Diesel",
        transmission: "automatic",
        seats: "5",
        doors: "5",
        year: "2022",
        consumption: "5.5L/100km",
        bodyType: "sedan",
        priceIncludes: [
            "Full Insurance",
            "Unlimited Mileage",
            "24/7 Support",
            "Free Delivery"
        ],
        features: [
            "Navigation",
            "Parking Sensors",
            "Bluetooth",
            "Climate Control"
        ],
        pricing: {
            "1_3": 60,
            "4_7": 55,
            "8_14": 52,
            "15_plus": 50
        }
    },
    {
        make: "Ford",
        model: "Mondeo",
        name: "FORD MONDEO 2021",
        mainImage: "/images/ford-mondeo.png",
        thumbnails: ["/images/ford-mondeo.png"],
        engine: "2.0 TDCi",
        fuel: "Diesel",
        transmission: "automatic",
        seats: "5",
        doors: "5",
        year: "2021",
        consumption: "5.7L/100km",
        bodyType: "sedan",
        priceIncludes: [
            "Full Insurance",
            "Unlimited Mileage",
            "24/7 Support",
            "Free Delivery"
        ],
        features: [
            "Navigation",
            "Parking Sensors",
            "Bluetooth",
            "Climate Control"
        ],
        pricing: {
            "1_3": 60,
            "4_7": 55,
            "8_14": 52,
            "15_plus": 50
        }
    },
    {
        make: "Ford",
        model: "Focus",
        name: "FORD FOCUS 2021",
        mainImage: "/images/ford-focus.png",
        thumbnails: ["/images/ford-focus.png"],
        engine: "1.5 TDCi",
        fuel: "Diesel",
        transmission: "manual",
        seats: "5",
        doors: "5",
        year: "2021",
        consumption: "5.0L/100km",
        bodyType: "estate",
        priceIncludes: [
            "Full Insurance",
            "Unlimited Mileage",
            "24/7 Support",
            "Free Delivery"
        ],
        features: [
            "Navigation",
            "Parking Sensors",
            "Bluetooth",
            "Climate Control"
        ],
        pricing: {
            "1_3": 55,
            "4_7": 50,
            "8_14": 45,
            "15_plus": 40
        }
    },
    {
        make: "Mercedes",
        model: "C-Class",
        name: "MERCEDES C220 2021",
        mainImage: "/images/mercedes.png",
        thumbnails: ["/images/mercedes.png"],
        engine: "2.0 CDI",
        fuel: "Diesel",
        transmission: "automatic",
        seats: "5",
        doors: "5",
        year: "2021",
        consumption: "6.2L/100km",
        bodyType: "sedan",
        priceIncludes: [
            "Full Insurance",
            "Unlimited Mileage",
            "24/7 Support",
            "Free Delivery"
        ],
        features: [
            "Leather Seats",
            "Navigation",
            "Parking Sensors",
            "Bluetooth",
            "Climate Control"
        ],
        pricing: {
            "1_3": 75,
            "4_7": 70,
            "8_14": 65,
            "15_plus": 60
        }
    },
    {
        make: "Land Rover",
        model: "Range Rover",
        name: "RANGE ROVER 2017",
        mainImage: "/images/range.png",
        thumbnails: ["/images/range.png"],
        engine: "3.0 TDV6",
        fuel: "Diesel",
        transmission: "automatic",
        seats: "5",
        doors: "5",
        year: "2017",
        consumption: "8.5L/100km",
        bodyType: "suv",
        priceIncludes: [
            "Full Insurance",
            "Unlimited Mileage",
            "24/7 Support",
            "Free Delivery"
        ],
        features: [
            "Leather Seats",
            "Navigation",
            "360 Camera",
            "Bluetooth",
            "Climate Control"
        ],
        pricing: {
            "1_3": 75,
            "4_7": 70,
            "8_14": 65,
            "15_plus": 60
        }
    },
    {
        make: "Jaguar",
        model: "F-Type",
        name: "JAGUAR F-TYPE 2022",
        mainImage: "/images/jaguar-f.png",
        thumbnails: ["/images/jaguar-f.png"],
        engine: "3.0 V6",
        fuel: "Gasoline",
        transmission: "automatic",
        seats: "2",
        doors: "2",
        year: "2022",
        consumption: "9.5L/100km",
        bodyType: "coupe",
        priceIncludes: [
            "Full Insurance",
            "Unlimited Mileage",
            "24/7 Support",
            "Free Delivery"
        ],
        features: [
            "Leather Seats",
            "Navigation",
            "Parking Sensors",
            "Bluetooth",
            "Climate Control"
        ],
        pricing: {
            "1_3": 150,
            "4_7": 140,
            "8_14": 130,
            "15_plus": 120
        }
    },
    {
        make: "Maserati",
        model: "Ghibli",
        name: "MASERATI GHIBLI 2017",
        mainImage: "/images/maserati.png",
        thumbnails: ["/images/maserati.png"],
        engine: "3.0 V6",
        fuel: "Gasoline",
        transmission: "automatic",
        seats: "5",
        doors: "5",
        year: "2017",
        consumption: "8.9L/100km",
        bodyType: "sedan",
        priceIncludes: [
            "Full Insurance",
            "Unlimited Mileage",
            "24/7 Support",
            "Free Delivery"
        ],
        features: [
            "Leather Seats",
            "Navigation",
            "Parking Sensors",
            "Bluetooth",
            "Climate Control"
        ],
        pricing: {
            "1_3": 60,
            "4_7": 55,
            "8_14": 52,
            "15_plus": 50
        }
    },
    {
        make: "Skoda",
        model: "Octavia",
        name: "SHKODA OCTAVIA 2020",
        mainImage: "/images/shkoda-octavia.png",
        thumbnails: ["/images/shkoda-octavia.png"],
        engine: "2.0 TDI",
        fuel: "Diesel",
        transmission: "automatic",
        seats: "5",
        doors: "5",
        year: "2020",
        consumption: "5.3L/100km",
        bodyType: "estate",
        priceIncludes: [
            "Full Insurance",
            "Unlimited Mileage",
            "24/7 Support",
            "Free Delivery"
        ],
        features: [
            "Navigation",
            "Parking Sensors",
            "Bluetooth",
            "Climate Control"
        ],
        pricing: {
            "1_3": 60,
            "4_7": 55,
            "8_14": 52,
            "15_plus": 50
        }
    },
    {
        make: "Skoda",
        model: "Octavia",
        name: "SHKODA OCTAVIA 2012",
        mainImage: "/images/shkoda.png",
        thumbnails: ["/images/shkoda.png"],
        engine: "1.6",
        fuel: "Gasoline",
        transmission: "manual",
        seats: "5",
        doors: "5",
        year: "2012",
        consumption: "6.5L/100km",
        bodyType: "estate",
        priceIncludes: [
            "Full Insurance",
            "Unlimited Mileage",
            "24/7 Support",
            "Free Delivery"
        ],
        features: [
            "Air Conditioning",
            "Power Windows",
            "Central Locking",
            "ABS",
            "Airbags"
        ],
        pricing: {
            "1_3": 35,
            "4_7": 30,
            "8_14": 28,
            "15_plus": 25
        }
    },
    {
        make: "Citroen",
        model: "C4-Picasso",
        name: "CITROEN C4-PICASSO 2016",
        mainImage: "/images/citroen.png",
        thumbnails: ["/images/citroen.png"],
        engine: "1.6",
        fuel: "Gasoline",
        transmission: "manual",
        seats: "7",
        doors: "5",
        year: "2016",
        consumption: "6.2L/100km",
        bodyType: "suv",
        priceIncludes: [
            "Full Insurance",
            "Unlimited Mileage",
            "24/7 Support",
            "Free Delivery"
        ],
        features: [
            "Air Conditioning",
            "Power Windows",
            "Central Locking",
            "ABS",
            "Airbags"
        ],
        pricing: {
            "1_3": 60,
            "4_7": 55,
            "8_14": 52,
            "15_plus": 50
        }
    },
    {
        make: "Opel",
        model: "Insignia",
        name: "OPEL INSIGNIA 2019",
        mainImage: "/images/opel.png",
        thumbnails: ["/images/opel.png"],
        engine: "2.0 CDTI",
        fuel: "Diesel",
        transmission: "manual",
        seats: "5",
        doors: "5",
        year: "2019",
        consumption: "5.8L/100km",
        bodyType: "estate",
        priceIncludes: [
            "Full Insurance",
            "Unlimited Mileage",
            "24/7 Support",
            "Free Delivery"
        ],
        features: [
            "Navigation",
            "Parking Sensors",
            "Bluetooth",
            "Climate Control"
        ],
        pricing: {
            "1_3": 60,
            "4_7": 55,
            "8_14": 52,
            "15_plus": 50
        }
    }
];

async function seedCars() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing cars
        await Car.deleteMany({});
        console.log('Cleared existing cars');

        // Insert new cars
        const result = await Car.insertMany(cars);
        console.log(`Inserted ${result.length} cars`);

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error seeding cars:', error);
        process.exit(1);
    }
}

seedCars(); 