import { ObjectId } from "mongodb";

export interface Reservation {
  _id?: ObjectId;
  carId: ObjectId;
  userId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentIntentId?: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to convert MongoDB document to Reservation type
export function toReservationModel(doc: any): Reservation {
  return {
    _id: doc._id,
    carId: new ObjectId(doc.carId),
    userId: doc.userId,
    startDate: new Date(doc.startDate),
    endDate: new Date(doc.endDate),
    totalPrice: doc.totalPrice,
    status: doc.status,
    paymentStatus: doc.paymentStatus,
    paymentIntentId: doc.paymentIntentId,
    customerDetails: doc.customerDetails,
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt)
  };
} 