import { NextRequest, NextResponse } from 'next/server'
import { csrfProtect } from '../../utils/csrf'
import { rateLimit } from '../../utils/rate-limit'
import { sendEmail } from '../../utils/email'
import { getMongoDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { Reservation, toReservationModel } from '@/models'

function reservationDetailsHtml(reservation: Reservation) {
  return `
    <h2>Reservation Cancelled</h2>
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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  csrfProtect(req)
  rateLimit(req)
  try {
    const db = await getMongoDb()
    const reservationData = await db.collection('reservations').findOne({ _id: new ObjectId(params.id) })
    if (!reservationData) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
    }
    const reservation = toReservationModel(reservationData)
    return NextResponse.json({ reservation })
  } catch (err) {
    return NextResponse.json({ reservation: null, error: 'Database error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  csrfProtect(req)
  rateLimit(req)
  try {
    const db = await getMongoDb()
    const update = await req.json()
    
    // Convert dates if they exist in the update
    if (update.startDate) {
      update.startDate = new Date(update.startDate)
    }
    if (update.endDate) {
      update.endDate = new Date(update.endDate)
    }
    
    // Convert carId if it exists in the update
    if (update.carId && typeof update.carId === 'string') {
      update.carId = new ObjectId(update.carId)
    }
    
    await db.collection('reservations').updateOne(
      { _id: new ObjectId(params.id) }, 
      { $set: { ...update, updatedAt: new Date() } }
    )
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  csrfProtect(req)
  rateLimit(req)
  try {
    const db = await getMongoDb()
    await db.collection('reservations').updateOne(
      { _id: new ObjectId(params.id) }, 
      { $set: { status: 'cancelled', updatedAt: new Date() } }
    )
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
  }
} 