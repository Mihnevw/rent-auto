import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '../../utils/db'
import { sendEmail } from '../../utils/email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

function reservationDetailsHtml(reservation: any) {
  return `
    <h2>Reservation Details</h2>
    <ul>
      <li><b>Name:</b> ${reservation.customer_name} ${reservation.customer_last_name}</li>
      <li><b>Email:</b> ${reservation.customer_email}</li>
      <li><b>Phone:</b> ${reservation.customer_phone}</li>
      <li><b>Car ID:</b> ${reservation.car_id}</li>
      <li><b>Pickup:</b> ${reservation.pickup_location} at ${reservation.start_datetime}</li>
      <li><b>Return:</b> ${reservation.return_location} at ${reservation.end_datetime}</li>
      <li><b>Notes:</b> ${reservation.notes || '-'}</li>
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
      // Update reservation status
      const { data: reservation } = await supabase
        .from('reservations')
        .update({ status: 'confirmed', payment_status: 'paid' })
        .eq('id', reservationId)
        .select()
        .single()
      // Send email notifications
      if (reservation) {
        const adminEmail = process.env.ADMIN_EMAIL as string
        const html = reservationDetailsHtml(reservation)
        try {
          if (adminEmail) {
            await sendEmail({
              to: adminEmail,
              subject: 'Reservation Confirmed (Paid)',
              html,
            })
          }
          await sendEmail({
            to: reservation.customer_email,
            subject: 'Your Reservation is Confirmed',
            html: `<p>Your payment was successful. Your reservation is now confirmed.</p>${html}`,
          })
        } catch (e) {
          // Log but don't fail webhook
          console.error('Email send error', e)
        }
      }
    }
  }

  return NextResponse.json({ received: true })
} 