import { ObjectId } from "mongodb";

export interface Car {
  _id?: ObjectId;
  name: string;
  slug: string;
  description: string;
  brand: string;
  model: string;
  year: number;
  price: {
    daily: number;
    weekly?: number;
    monthly?: number;
  };
  images: string[];
  features: string[];
  category: string;
  transmission: "automatic" | "manual";
  seats: number;
  doors: number;
  luggage: number;
  fuelType: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to convert MongoDB document to Car type
export function toCarModel(doc: any): Car {
  return {
    _id: doc._id,
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
    brand: doc.brand,
    model: doc.model,
    year: doc.year,
    price: doc.price,
    images: doc.images,
    features: doc.features,
    category: doc.category,
    transmission: doc.transmission,
    seats: doc.seats,
    doors: doc.doors,
    luggage: doc.luggage,
    fuelType: doc.fuelType,
    available: doc.available,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
} 