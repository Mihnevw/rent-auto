import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../utils/db'
import { csrfProtect } from '../utils/csrf'
import { rateLimit } from '../utils/rate-limit'
import { sendEmail } from '../utils/email'

function isValidReservationInput(data: any) {
  return (
    typeof data.car_id === 'string' &&
    typeof data.customer_name === 'string' &&
    typeof data.customer_last_name === 'string' &&
    typeof data.customer_email === 'string' &&
    typeof data.customer_phone === 'string' &&
    typeof data.pickup_location === 'string' &&
    typeof data.return_location === 'string' &&
    typeof data.start_datetime === 'string' &&
    typeof data.end_datetime === 'string'
  )
}

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
  csrfProtect(req)
  rateLimit(req)
  const data = await req.json()

  // Validate input
  if (!isValidReservationInput(data)) {
    return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 })
  }

  // Check for overlapping reservations
  const { data: overlaps, error: overlapError } = await supabase
    .from('reservations')
    .select('id')
    .eq('car_id', data.car_id)
    .or(`status.eq.confirmed,status.eq.pending`)
    .not('status', 'eq', 'cancelled')
    .filter('start_datetime', 'lt', data.end_datetime)
    .filter('end_datetime', 'gt', data.start_datetime)

  if (overlapError) {
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
  }
  if (overlaps && overlaps.length > 0) {
    return NextResponse.json({ success: false, error: 'Selected period is not available' }, { status: 409 })
  }

  // Save reservation
  const { data: reservation, error } = await supabase
    .from('reservations')
    .insert([
      {
        car_id: data.car_id,
        customer_name: data.customer_name,
        customer_last_name: data.customer_last_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        notes: data.notes || '',
        pickup_location: data.pickup_location,
        return_location: data.return_location,
        start_datetime: data.start_datetime,
        end_datetime: data.end_datetime,
        status: 'pending',
        payment_status: 'unpaid',
      },
    ])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ success: false, error: 'Failed to create reservation' }, { status: 500 })
  }

  // Send email notifications
  const adminEmail = process.env.ADMIN_EMAIL as string
  const html = reservationDetailsHtml(reservation)
  try {
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: 'New Car Reservation',
        html,
      })
    }
    await sendEmail({
      to: reservation.customer_email,
      subject: 'Your Car Reservation',
      html: `<p>Thank you for your reservation!</p>${html}`,
    })
  } catch (e) {
    // Log but don't fail the reservation
    console.error('Email send error', e)
  }

  // TODO: Create Stripe payment session if needed

  return NextResponse.json({ success: true, reservation })
}

export async function GET(req: NextRequest) {
  csrfProtect(req)
  rateLimit(req)
  // Admin protection
  const adminToken = req.headers.get('x-admin-token')
  if (!adminToken || adminToken !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  // List reservations
  const { data: reservations, error } = await supabase
    .from('reservations')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
  return NextResponse.json({ reservations })
} 