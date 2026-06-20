'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Registration {
  id: number | string
  name: string
  adults: number
  children: number
  departureCity: string
  flightPreference?: string // legacy field — no longer collected
  flightNumber?: string // legacy single-flight field
  flightNumberOut?: string
  flightNumberReturn?: string
  proba: string
  comment?: string
  date: string
}

const PROBA_CONFIG: Record<string, { label: string; emoji: string; color: string; bg: string; weight: number }> = {
  certain: { label: 'Certain(e)', emoji: '✅', color: '#16a34a', bg: '#14532d', weight: 1.0 },
  probable: { label: 'Très probable', emoji: '🟢', color: '#22c55e', bg: '#14532d', weight: 0.85 },
  possible: { label: 'Possible', emoji: '🟡', color: '#ca8a04', bg: '#422006', weight: 0.60 },
  incertain: { label: 'Incertain(e)', emoji: '🟠', color: '#ea580c', bg: '#431407', weight: 0.30 },
}

function ProbaBadge({ proba }: { proba: string }) {
  const cfg = PROBA_CONFIG[proba] ?? { label: proba, emoji: '', color: '#f0e8d5', bg: 'transparent', weight: 0 }
  return (
    <span
      className="text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap"
      style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}` }}
    >
      {cfg.emoji} {cfg.label}
    </span>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ backgroundColor: 'rgba(196,158,68,0.08)', border: '1px solid rgba(196,158,68,0.25)' }}
    >
      <div className="text-xs uppercase tracking-wider mb-1" style={{ color: '#c49e44', opacity: 0.8 }}>
        {label}
      </div>
      <div className="text-2xl font-bold" style={{ color: '#f0e8d5' }}>
        {value}
      </div>
      {sub && (
        <div className="text-xs mt-1" style={{ color: '#f0e8d5', opacity: 0.6 }}>
          {sub}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────── PASSWORD GATE ── */
function PasswordGate({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'omra2026') {
      onAuth()
    } else {
      setError(true)
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-5xl mb-6" style={{ color: '#c49e44' }}>☪</div>
      <h1 className="text-2xl font-bold mb-8" style={{ color: '#c49e44', fontFamily: 'Georgia, Palatino, serif' }}>
        Accès organisateur
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border p-6 space-y-4"
        style={{ borderColor: '#c49e44', backgroundColor: 'rgba(196,158,68,0.06)' }}
      >
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#c49e44' }}>
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false) }}
            className="w-full rounded-lg px-4 py-3 outline-none"
            style={{
              backgroundColor: 'rgba(13,37,24,0.9)',
              border: error ? '1px solid #dc2626' : '1px solid rgba(196,158,68,0.4)',
              color: '#f0e8d5',
            }}
            placeholder="••••••••"
            autoFocus
          />
          {error && (
            <p className="text-xs mt-1" style={{ color: '#fca5a5' }}>
              Mot de passe incorrect.
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-3 rounded-xl font-semibold transition-all"
          style={{ backgroundColor: '#c49e44', color: '#0d2518' }}
        >
          Accéder →
        </button>
      </form>
      <Link href="/" className="mt-6 text-sm" style={{ color: '#f0e8d5', opacity: 0.4 }}>
        ← Retour
      </Link>
    </div>
  )
}

/* ───────────────────────────────────────── ADMIN DASHBOARD ── */
function AdminDashboard({ registrations }: { registrations: Registration[] }) {
  const totalFamilies = registrations.length
  const totalPersons = registrations.reduce(
    (s, r) => s + (Number(r.adults) || 0) + (Number(r.children) || 0),
    0
  )
  const expectedPersons = registrations.reduce((s, r) => {
    const cfg = PROBA_CONFIG[r.proba]
    const weight = cfg ? cfg.weight : 0.5
    return s + ((Number(r.adults) || 0) + (Number(r.children) || 0)) * weight
  }, 0)

  const cityCount: Record<string, number> = { Lyon: 0, Paris: 0, Autre: 0 }
  const probaCount: Record<string, { families: number; persons: number }> = {}

  registrations.forEach((r) => {
    const city = r.departureCity ?? 'Autre'
    if (city in cityCount) cityCount[city]++
    else cityCount['Autre']++

    const pk = r.proba ?? 'possible'
    if (!probaCount[pk]) probaCount[pk] = { families: 0, persons: 0 }
    probaCount[pk].families++
    probaCount[pk].persons += (Number(r.adults) || 0) + (Number(r.children) || 0)
  })

  const sorted = [...registrations].sort((a, b) => Number(b.id) - Number(a.id))

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="text-center py-10 px-4 border-b" style={{ borderColor: 'rgba(196,158,68,0.2)' }}>
        <div className="text-4xl mb-3" style={{ color: '#c49e44' }}>☪</div>
        <h1 className="text-3xl font-bold mb-1" style={{ color: '#c49e44', fontFamily: 'Georgia, Palatino, serif' }}>
          Tableau de bord
        </h1>
        <p className="text-sm" style={{ color: '#f0e8d5', opacity: 0.5 }}>
          Omra 2026 — Jamat Sidi Abdallah
        </p>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">

        {/* Stats grid */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#c49e44' }}>
            Statistiques générales
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <StatCard label="Familles inscrites" value={totalFamilies} />
            <StatCard label="Personnes totales" value={totalPersons} />
            <StatCard label="Personnes attendues" value={expectedPersons.toFixed(1)} sub="pondéré par certitude" />
            <div
              className="rounded-xl p-4"
              style={{ backgroundColor: 'rgba(196,158,68,0.08)', border: '1px solid rgba(196,158,68,0.25)' }}
            >
              <div className="text-xs uppercase tracking-wider mb-2" style={{ color: '#c49e44', opacity: 0.8 }}>
                Villes de départ
              </div>
              <div className="space-y-1">
                {Object.entries(cityCount).map(([city, cnt]) => (
                  <div key={city} className="flex justify-between text-sm">
                    <span style={{ color: '#f0e8d5', opacity: 0.8 }}>{city}</span>
                    <span className="font-bold" style={{ color: '#c49e44' }}>{cnt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Certitude breakdown */}
            <div
              className="rounded-xl p-4"
              style={{ backgroundColor: 'rgba(196,158,68,0.08)', border: '1px solid rgba(196,158,68,0.25)' }}
            >
              <div className="text-xs uppercase tracking-wider mb-3" style={{ color: '#c49e44', opacity: 0.8 }}>
                Répartition par certitude
              </div>
              <div className="space-y-2">
                {Object.entries(PROBA_CONFIG).map(([key, cfg]) => {
                  const pc = probaCount[key] ?? { families: 0, persons: 0 }
                  return (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-xs" style={{ color: cfg.color }}>
                        {cfg.emoji} {cfg.label}
                      </span>
                      <span className="text-xs" style={{ color: '#f0e8d5', opacity: 0.75 }}>
                        {pc.families} famille(s) · {pc.persons} pers.
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Registrations list */}
        <section>
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#c49e44' }}>
            Liste des inscriptions ({totalFamilies})
          </h2>

          {sorted.length === 0 ? (
            <div
              className="rounded-xl p-8 text-center"
              style={{ backgroundColor: 'rgba(196,158,68,0.06)', border: '1px solid rgba(196,158,68,0.2)' }}
            >
              <p style={{ color: '#f0e8d5', opacity: 0.5 }}>Aucune inscription pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sorted.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl p-4"
                  style={{ backgroundColor: 'rgba(196,158,68,0.06)', border: '1px solid rgba(196,158,68,0.2)' }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="font-semibold text-base" style={{ color: '#f0e8d5' }}>
                        {r.name}
                      </span>
                      <span className="ml-3 text-xs" style={{ color: '#f0e8d5', opacity: 0.45 }}>
                        {r.date}
                      </span>
                    </div>
                    <ProbaBadge proba={r.proba} />
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span style={{ color: '#f0e8d5', opacity: 0.75 }}>
                      👥 {r.adults} adulte{r.adults > 1 ? 's' : ''}
                      {r.children > 0 ? ` + ${r.children} enfant${r.children > 1 ? 's' : ''}` : ''}
                      &nbsp;=&nbsp;
                      <strong style={{ color: '#c49e44' }}>
                        {(Number(r.adults) || 0) + (Number(r.children) || 0)} pers.
                      </strong>
                    </span>
                    <span style={{ color: '#f0e8d5', opacity: 0.75 }}>
                      📍 {r.departureCity}
                    </span>
                    {(r.flightNumberOut || r.flightNumber) && (
                      <span style={{ color: '#f0e8d5', opacity: 0.55 }}>
                        🛫 {r.flightNumberOut || r.flightNumber}
                      </span>
                    )}
                    {r.flightNumberReturn && (
                      <span style={{ color: '#f0e8d5', opacity: 0.55 }}>
                        🛬 {r.flightNumberReturn}
                      </span>
                    )}
                  </div>
                  {r.comment && (
                    <p className="mt-2 text-sm italic" style={{ color: '#f0e8d5', opacity: 0.6 }}>
                      &ldquo;{r.comment}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="text-center py-6 px-4 border-t mt-8" style={{ borderColor: 'rgba(196,158,68,0.2)' }}>
        <Link href="/" className="text-sm" style={{ color: '#c49e44' }}>
          ← Retour à la page d&apos;accueil
        </Link>
      </footer>
    </div>
  )
}

/* ──────────────────────────────────────────────────── ADMIN PAGE ── */
export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authenticated) return
    setLoading(true)
    fetch('/api/registrations')
      .then((r) => r.json())
      .then((data) => setRegistrations(data))
      .catch(() => setError('Impossible de charger les inscriptions.'))
      .finally(() => setLoading(false))
  }, [authenticated])

  if (!authenticated) {
    return <PasswordGate onAuth={() => setAuthenticated(true)} />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: '#f0e8d5', opacity: 0.5 }}>Chargement des inscriptions…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p style={{ color: '#fca5a5' }}>{error}</p>
        <Link href="/" style={{ color: '#c49e44' }}>← Retour</Link>
      </div>
    )
  }

  return <AdminDashboard registrations={registrations} />
}
