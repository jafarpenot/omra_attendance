import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const KV_KEY = 'omra2026_registrations'

export async function GET() {
  try {
    const registrations = await kv.get<object[]>(KV_KEY)
    return NextResponse.json(registrations ?? [])
  } catch (error) {
    console.error('GET /api/registrations error:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const existing = (await kv.get<object[]>(KV_KEY)) ?? []

    const idx = (existing as { id: number | string }[]).findIndex(
      (r) => r.id === body.id
    )

    let updated: object[]
    if (idx >= 0) {
      updated = [...existing]
      updated[idx] = body
    } else {
      updated = [...existing, body]
    }

    await kv.set(KV_KEY, updated)
    return NextResponse.json(body, { status: 200 })
  } catch (error) {
    console.error('POST /api/registrations error:', error)
    return NextResponse.json({ error: 'Erreur lors de la sauvegarde' }, { status: 500 })
  }
}
