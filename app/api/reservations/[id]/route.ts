import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../utils/db'
import { csrfProtect } from '../../utils/csrf'
import { rateLimit } from '../../utils/rate-limit'
import { sendEmail } from '../../utils/email'

function reservationDetailsHtml(reservation: any) {
  return `
    <h2>Reservation Cancelled</h2>
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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  csrfProtect(req)
  rateLimit(req)
  // TODO: Fetch reservation by ID
  return NextResponse.json({ reservation: null })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  csrfProtect(req)
  rateLimit(req)
  // TODO: Update reservation (e.g., confirm)
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  csrfProtect(req)
  rateLimit(req)
  // Mark reservation as cancelled
  const { data: reservation, error } = await supabase
    .from('reservations')
    .update({ status: 'cancelled' })
    .eq('id', params.id)
    .select()
    .single()
  if (error || !reservation) {
    return NextResponse.json({ success: false, error: 'Failed to cancel reservation' }, { status: 500 })
  }
  // Send email to admin
  const adminEmail = process.env.ADMIN_EMAIL as string
  const html = reservationDetailsHtml(reservation)
  try {
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: 'Reservation Cancelled',
        html,
      })
    }
  } catch (e) {
    // Log but don't fail the cancellation
    console.error('Email send error', e)
  }
  return NextResponse.json({ success: true })
} 