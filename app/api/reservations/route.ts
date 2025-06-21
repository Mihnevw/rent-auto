import { NextRequest, NextResponse } from 'next/server'
import { csrfProtect } from '../utils/csrf'
import { rateLimit } from '../utils/rate-limit'
import { sendEmail } from '../utils/email'
import { getMongoDb } from '@/lib/mongodb'
import { Reservation, toReservationModel } from '@/models'
import { ObjectId } from 'mongodb'

function isValidReservationInput(data: any): data is Omit<Reservation, '_id' | 'status' | 'paymentStatus' | 'createdAt' | 'updatedAt'> {
  return (
    data.carId instanceof ObjectId &&
    typeof data.userId === 'string' &&
    data.startDate instanceof Date &&
    data.endDate instanceof Date &&
    typeof data.totalPrice === 'number' &&
    typeof data.customerDetails === 'object' &&
    typeof data.customerDetails.name === 'string' &&
    typeof data.customerDetails.email === 'string' &&
    typeof data.customerDetails.phone === 'string'
  )
}

function reservationDetailsHtml(reservation: Reservation) {
  return `
    <h2>Reservation Details</h2>
    <ul>
      <li><b>Name:</b> ${reservation.customerDetails.name}</li>
      <li><b>Email:</b> ${reservation.customerDetails.email}</li>
      <li><b>Phone:</b> ${reservation.customerDetails.phone}</li>
      <li><b>Car ID:</b> ${reservation.carId}</li>
      <li><b>Start Date:</b> ${reservation.startDate.toLocaleString()}</li>
      <li><b>End Date:</b> ${reservation.endDate.toLocaleString()}</li>
      <li><b>Total Price:</b> €${reservation.totalPrice}</li>
    </ul>
  `
}

export async function POST(req: NextRequest) {
  csrfProtect(req)
  rateLimit(req)
  const data = await req.json()

  // Convert string dates to Date objects
  if (typeof data.startDate === 'string') {
    data.startDate = new Date(data.startDate)
  }
  if (typeof data.endDate === 'string') {
    data.endDate = new Date(data.endDate)
  }
  
  // Convert carId to ObjectId
  if (typeof data.carId === 'string') {
    data.carId = new ObjectId(data.carId)
  }

  // Validate input
  if (!isValidReservationInput(data)) {
    return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 })
  }

  try {
    const db = await getMongoDb()
    const result = await db.collection('reservations').insertOne({
      ...data,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return NextResponse.json({ success: true, reservationId: result.insertedId })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  csrfProtect(req)
  rateLimit(req)
  // Admin protection
  const adminToken = req.headers.get('x-admin-token')
  if (!adminToken || adminToken !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const db = await getMongoDb()
    const reservationsData = await db.collection('reservations')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()
    const reservations = reservationsData.map(toReservationModel)
    return NextResponse.json({ reservations })
  } catch (err) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
} 