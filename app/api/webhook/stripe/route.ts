import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sendEmail } from '../../utils/email'
import { getMongoDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { Reservation, toReservationModel } from '@/models'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

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
  const sig = req.headers.get('stripe-signature')
  const buf = await req.arrayBuffer()
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(buf),
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const reservationId = session.metadata?.reservation_id
    if (reservationId) {
      const db = await getMongoDb()
      await db.collection('reservations').updateOne(
        { _id: new ObjectId(reservationId) },
        { 
          $set: { 
            status: 'confirmed', 
            paymentStatus: 'paid',
            paymentIntentId: session.payment_intent as string,
            updatedAt: new Date() 
          } 
        }
      )
    }
  }

  return NextResponse.json({ received: true })
} 