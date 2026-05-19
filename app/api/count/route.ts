import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const KV_KEY = 'omra2026_registrations'

interface Registration {
  id: number | string
  name: string
  adults: number
  children: number
  departureCity: string
  flightPreference: string
  proba: string
  comment?: string
  date: string
}

export async function GET() {
  try {
    const registrations = (await kv.get<Registration[]>(KV_KEY)) ?? []
    const families = registrations.length
    const persons = registrations.reduce(
      (sum, r) => sum + (Number(r.adults) || 0) + (Number(r.children) || 0),
      0
    )
    return NextResponse.json({ families, persons })
  } catch (error) {
    console.error('GET /api/count error:', error)
    return NextResponse.json({ families: 0, persons: 0 })
  }
}
