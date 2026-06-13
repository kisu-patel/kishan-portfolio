import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Log to console (replace with Resend / Nodemailer in production)
    console.log('📬 New contact message:', { name, email, message, timestamp: new Date().toISOString() })

    // TODO: wire up real email sending, e.g.:
    // await resend.emails.send({ from: 'portfolio@yourdomain.com', to: 'kishanspatel@email.com', ... })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
