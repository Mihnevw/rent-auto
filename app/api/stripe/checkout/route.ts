import { NextRequest, NextResponse } from 'next/server'
import { csrfProtect } from '../../utils/csrf'
import { rateLimit } from '../../utils/rate-limit'
import Stripe from 'stripe'
import { getMongoDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  csrfProtect(req)
  rateLimit(req)
  const data = await req.json()

  // Validate input
  if (!data.reservation_id || !data.amount || !data.customer_email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const db = await getMongoDb()

  // Create Stripe Checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: data.customer_email,
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Car Reservation',
          },
          unit_amount: Math.round(Number(data.amount) * 100), // amount in cents
        },
        quantity: 1,
      },
    ],
    metadata: {
      reservation_id: data.reservation_id,
    },
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/cancel`,
  })

  // Optionally update reservation with session ID
  await db.collection('reservations').updateOne(
    { _id: new ObjectId(data.reservation_id) },
    { $set: { stripe_session_id: session.id, updated_at: new Date() } }
  )

  return NextResponse.json({ url: session.url })
} 