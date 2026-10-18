'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { normalizeName } from './lib/normalizeName'
import {
  SAFETY_CHECKLIST,
  MEAL_INFO,
  ARRIVALS,
  ARRIVALS_TOTAL,
  ARRIVALS_NOTE,
  ZIYARA_PLAN,
  ZIYARA_NOTE,
  MATAF_PHOTOS,
  ROOM_GROUPS,
  HOTELS,
  EMERGENCY_CONTACTS,
  PRACTICAL_NOTE,
  WIFI_PASSWORD,
} from './tripContent'

// One color per group, cycled — lets the same group be spotted at a glance
// across both the "Groupes d'arrivée" and "Qui partage ma chambre" sections,
// echoing the color-coding from the organizer's original room sheet.
const GROUP_COLORS = [
  '#86efac', // vert
  '#93c5fd', // bleu
  '#fdba74', // orange
  '#d8b4fe', // lilas
  '#5eead4', // turquoise
  '#f9a8d4', // rose
  '#d1d5db', // gris
  '#bef264', // vert anis
  '#fca5a5', // rouge/saumon
  '#67e8f9', // cyan
  '#f0abfc', // magenta
  '#fcd34d', // ambre
  '#a5b4fc', // indigo
]
function groupColor(i: number): string {
  return GROUP_COLORS[i % GROUP_COLORS.length]
}

type View = 'home' | 'step1' | 'step2' | 'step3'

interface Person {
  type: 'adulte' | 'enfant'
  passportNumber: string
  nationality: string
  birthDate: string
}

interface Registration {
  id: number | string
  name: string
  adults: number
  children: number
  departureCity: string
  flightPreference?: string // kept for backward compatibility — no longer displayed
  flightNumber?: string // legacy single-flight field — migrated into flightNumberOut
  flightNumberOut?: string
  flightNumberReturn?: string
  flightDateOut?: string
  flightDateReturn?: string
  proba: string
  comment?: string
  date: string
  persons?: Person[] // kept optional — absent on registrations created before this field existed
}

/** Build the per-person list to match the current adults/children counts,
 *  reusing already-entered data (by type + position) and trimming/padding as needed. */
function buildPersons(adults: number, children: number, current: Person[]): Person[] {
  const blank = (type: Person['type']): Person => ({ type, passportNumber: '', nationality: '', birthDate: '' })
  const adultsCurrent = current.filter((p) => p.type === 'adulte')
  const childrenCurrent = current.filter((p) => p.type === 'enfant')
  const newAdults = Array.from({ length: adults }, (_, i) => adultsCurrent[i] ?? blank('adulte'))
  const newChildren = Array.from({ length: children }, (_, i) => childrenCurrent[i] ?? blank('enfant'))
  return [...newAdults, ...newChildren]
}

const PROBA_CONFIG: Record<string, { label: string; emoji: string; color: string; bg: string }> = {
  certain: { label: 'Certain(e)', emoji: '✅', color: '#16a34a', bg: '#14532d' },
  probable: { label: 'Très probable', emoji: '🟢', color: '#22c55e', bg: '#14532d' },
  possible: { label: 'Possible', emoji: '🟡', color: '#ca8a04', bg: '#422006' },
  incertain: { label: 'Incertain(e)', emoji: '🟠', color: '#ea580c', bg: '#431407' },
}

/* ─────────────────────────────────────────────────────────── COUNTER ── */
function Counter({
  value,
  min,
  onChange,
}: {
  value: number
  min: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-10 h-10 rounded-full border-2 text-xl font-bold flex items-center justify-center transition-colors"
        style={{ borderColor: '#c49e44', color: '#c49e44', backgroundColor: 'transparent' }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c49e44', e.currentTarget.style.color = '#0d2518')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent', e.currentTarget.style.color = '#c49e44')}
      >
        −
      </button>
      <span className="text-2xl font-bold w-8 text-center" style={{ color: '#f0e8d5' }}>
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="w-10 h-10 rounded-full border-2 text-xl font-bold flex items-center justify-center transition-colors"
        style={{ borderColor: '#c49e44', color: '#c49e44', backgroundColor: 'transparent' }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c49e44', e.currentTarget.style.color = '#0d2518')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent', e.currentTarget.style.color = '#c49e44')}
      >
        +
      </button>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────── HEADER ── */
function Header() {
  return (
    <header className="text-center py-12 px-4">
      <div className="text-6xl mb-4" style={{ color: '#c49e44' }}>☪</div>
      <h1
        className="text-5xl md:text-6xl font-bold mb-4"
        style={{ color: '#c49e44', fontFamily: 'Georgia, Palatino, serif' }}
      >
        Omra 2026
      </h1>
      <div className="mx-auto my-5 h-px max-w-xs" style={{ backgroundColor: '#c49e44', opacity: 0.6 }} />
      <p
        className="text-sm tracking-[0.3em] uppercase"
        style={{ color: '#f0e8d5', letterSpacing: '0.3em' }}
      >
        Jamat Sidi Abdallah
      </p>
    </header>
  )
}

/* ─────────────────────────────────────────────────────── SECTION CARD ── */
function SectionCard({
  title,
  children,
  className = '',
}: {
  title?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-2xl border p-6 md:p-8 mb-8 ${className}`}
      style={{ borderColor: 'rgba(196,158,68,0.4)', backgroundColor: 'rgba(196,158,68,0.06)' }}
    >
      {title && (
        <h2
          className="text-xl md:text-2xl font-semibold mb-5"
          style={{ color: '#c49e44', fontFamily: 'Georgia, Palatino, serif' }}
        >
          {title}
        </h2>
      )}
      {children}
    </div>
  )
}

/* ──────────────────────────────────────────────────────── HOME VIEW ── */
function HomeView({
  onRegister,
  count,
}: {
  onRegister: () => void
  count: { families: number; persons: number } | null
}) {
  return (
    <div>
      <Header />

      <main className="max-w-3xl mx-auto px-4 pb-16">
        {/* Section 1 — À vérifier avant de partir */}
        <div
          className="rounded-2xl border-2 p-6 md:p-8 mb-8"
          style={{ borderColor: '#dc2626', backgroundColor: 'rgba(220,38,38,0.07)' }}
        >
          <h2
            className="text-xl md:text-2xl font-semibold mb-4"
            style={{ color: '#fca5a5', fontFamily: 'Georgia, Palatino, serif' }}
          >
            ⚠️ À vérifier avant de partir
          </h2>
          <ul className="space-y-2.5">
            {SAFETY_CHECKLIST.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-base font-medium"
                style={{ color: '#f0e8d5' }}
              >
                <span style={{ color: '#fca5a5' }}>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 2 — Groupes d'arrivée */}
        <SectionCard title="✈️ Groupes d'arrivée">
          <p className="text-sm mb-4" style={{ color: '#f0e8d5', opacity: 0.75 }}>
            Tableau des arrivées — qui arrive quand, pour former de petits groupes et faire l&apos;Omra
            ensemble.
          </p>
          <div className="space-y-2 mb-4">
            {ARRIVALS.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl p-3 text-sm"
                style={{ backgroundColor: 'rgba(196,158,68,0.08)', border: '1px solid rgba(196,158,68,0.2)' }}
              >
                <div className="text-xs font-semibold whitespace-nowrap" style={{ color: '#c49e44', minWidth: '5.5rem' }}>
                  {a.date}
                </div>
                <div className="text-xs whitespace-nowrap" style={{ color: '#f0e8d5', opacity: 0.6, minWidth: '3rem' }}>
                  {a.time}
                </div>
                <div className="flex-1" style={{ color: '#f0e8d5' }}>
                  {a.name}
                </div>
                <div
                  className="text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap"
                  style={{ backgroundColor: 'rgba(196,158,68,0.15)', color: '#c49e44' }}
                >
                  {a.count} pers.
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm font-semibold mb-2" style={{ color: '#c49e44' }}>
            Total : {ARRIVALS_TOTAL} personnes
          </p>
          <p className="text-xs italic" style={{ color: '#f0e8d5', opacity: 0.6 }}>{ARRIVALS_NOTE}</p>
        </SectionCard>

        {/* Section 3 — Hôtels et contacts d'urgence */}
        <SectionCard title="🏨 Hôtels et contacts d'urgence">
          <div className="grid md:grid-cols-2 gap-4 mb-5">
            {HOTELS.map((h) => (
              <div
                key={h.city}
                className="rounded-xl p-4"
                style={{ backgroundColor: 'rgba(196,158,68,0.1)', border: '1px solid rgba(196,158,68,0.25)' }}
              >
                <div className="text-xs px-2 py-0.5 rounded-full font-semibold inline-block mb-2" style={{ backgroundColor: '#c49e44', color: '#0d2518' }}>
                  {h.city}
                </div>
                <div className="font-semibold text-sm mb-1" style={{ color: '#c49e44' }}>{h.hotelName}</div>
                <p className="text-sm mb-2" style={{ color: '#f0e8d5', opacity: 0.85 }}>{h.hotelAddress}</p>
                <a
                  href={h.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs underline"
                  style={{ color: '#c49e44' }}
                >
                  Voir sur Google Maps →
                </a>
              </div>
            ))}
          </div>

          <div
            className="rounded-xl p-3 mb-5 flex items-center gap-2 text-sm"
            style={{ backgroundColor: 'rgba(196,158,68,0.1)', border: '1px solid rgba(196,158,68,0.25)' }}
          >
            <span style={{ color: '#c49e44' }}>📶 Wifi hôtel :</span>
            <strong style={{ color: '#f0e8d5', letterSpacing: '0.05em' }}>{WIFI_PASSWORD}</strong>
          </div>

          <div className="font-semibold mb-3" style={{ color: '#c49e44' }}>
            Contacts d&apos;urgence — WhatsApp uniquement
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {EMERGENCY_CONTACTS.map((c) => (
              <a
                key={c.name}
                href={c.phone ? `https://wa.me/${c.phone.replace(/[^0-9]/g, '')}` : undefined}
                target={c.phone ? '_blank' : undefined}
                rel={c.phone ? 'noopener noreferrer' : undefined}
                className="rounded-xl p-3 text-center text-sm font-semibold"
                style={{
                  backgroundColor: 'rgba(196,158,68,0.1)',
                  border: '1px solid rgba(196,158,68,0.25)',
                  color: c.phone ? '#c49e44' : '#f0e8d5',
                  opacity: c.phone ? 1 : 0.5,
                  cursor: c.phone ? 'pointer' : 'default',
                }}
              >
                {c.name}
                {!c.phone && <div className="text-xs font-normal mt-1">(voir PDF)</div>}
              </a>
            ))}
          </div>
          <p className="text-xs italic" style={{ color: '#f0e8d5', opacity: 0.6 }}>{PRACTICAL_NOTE}</p>
        </SectionCard>

        {/* Section 4 — Repas et ziyara */}
        <SectionCard title="🍽 Repas et ziyara">
          <div
            className="rounded-xl p-4 mb-5"
            style={{ backgroundColor: 'rgba(196,158,68,0.1)', border: '1px solid rgba(196,158,68,0.25)' }}
          >
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-xs uppercase tracking-wider mb-1" style={{ color: '#c49e44', opacity: 0.8 }}>
                  1er repas
                </div>
                <div className="font-semibold text-sm" style={{ color: '#f0e8d5' }}>{MEAL_INFO.first}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider mb-1" style={{ color: '#c49e44', opacity: 0.8 }}>
                  2e repas
                </div>
                <div className="font-semibold text-sm" style={{ color: '#f0e8d5' }}>{MEAL_INFO.second}</div>
              </div>
            </div>
            <p className="text-sm font-semibold mb-1" style={{ color: '#fca5a5' }}>
              ⚠️ {MEAL_INFO.lateRule}
            </p>
            <p className="text-xs" style={{ color: '#f0e8d5', opacity: 0.7 }}>{MEAL_INFO.note}</p>
          </div>

          <div className="font-semibold mb-3" style={{ color: '#c49e44' }}>
            Programme des ziyarat
          </div>
          <div className="space-y-2 mb-3">
            {ZIYARA_PLAN.map((z, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl p-3 text-sm"
                style={{ backgroundColor: 'rgba(196,158,68,0.08)', border: '1px solid rgba(196,158,68,0.2)' }}
              >
                <div className="text-xs font-semibold whitespace-nowrap pt-0.5" style={{ color: '#c49e44', minWidth: '5.5rem' }}>
                  {z.date}
                </div>
                <div className="flex-1">
                  <div style={{ color: '#f0e8d5' }}>{z.place}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#f0e8d5', opacity: 0.6 }}>
                    {z.time}{z.city !== '—' ? ` · ${z.city}` : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs italic" style={{ color: '#f0e8d5', opacity: 0.6 }}>{ZIYARA_NOTE}</p>
        </SectionCard>

        {/* Section 5 — Guide du Mataf */}
        <SectionCard title="🕋 Guide du Mataf">
          <div className="grid md:grid-cols-3 gap-4">
            {MATAF_PHOTOS.map((photo) => (
              <div
                key={photo.src}
                className="rounded-xl overflow-hidden"
                style={{ border: '1px solid rgba(196,158,68,0.25)' }}
              >
                <div className="relative w-full" style={{ aspectRatio: '3 / 4' }}>
                  <Image
                    src={photo.src}
                    alt={photo.caption}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm mb-2" style={{ color: '#f0e8d5' }}>{photo.caption}</p>
                  <a
                    href={photo.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline"
                    style={{ color: '#c49e44' }}
                  >
                    Voir sur Google Maps →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Section 6 — Qui partage ma chambre */}
        <SectionCard title="🛏 Qui partage ma chambre">
          <p className="text-xs italic mb-5" style={{ color: '#f0e8d5', opacity: 0.6 }}>
            Regroupements d&apos;hébergement — certains membres de famille apparaissent seulement par
            leur lien de parenté (ex. &laquo; épouse &raquo;, &laquo; fils &raquo;) plutôt que par leur
            nom, selon la façon dont la liste a été préparée.
          </p>
          {ROOM_GROUPS.map((cityGroup) => {
            const hotel = HOTELS.find((h) => h.city === cityGroup.city)
            return (
              <div key={cityGroup.city} className="mb-6 last:mb-0">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ backgroundColor: '#c49e44', color: '#0d2518' }}
                  >
                    {cityGroup.city}
                  </span>
                  {hotel && (
                    <span className="text-xs" style={{ color: '#f0e8d5', opacity: 0.7 }}>
                      {hotel.hotelName} · {hotel.hotelAddress}
                    </span>
                  )}
                </div>
                {hotel && (
                  <a
                    href={hotel.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline mb-3 inline-block"
                    style={{ color: '#c49e44' }}
                  >
                    Voir l&apos;hôtel sur Google Maps →
                  </a>
                )}
                <div className="grid md:grid-cols-2 gap-3">
                  {cityGroup.groups.map((group, i) => (
                    <div
                      key={i}
                      className="rounded-xl p-3 text-sm"
                      style={{
                        backgroundColor: 'rgba(196,158,68,0.08)',
                        border: '1px solid rgba(196,158,68,0.2)',
                        borderLeftWidth: '4px',
                        borderLeftColor: groupColor(i),
                      }}
                    >
                      {group.map((name) => (
                        <div key={name} style={{ color: '#f0e8d5', opacity: 0.9 }}>{name}</div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </SectionCard>

        {/* Section — Inscription (gardé, déplacé en bas de page) */}
        <div
          className="rounded-2xl border p-6 md:p-8 mb-8 text-center"
          style={{ borderColor: '#c49e44', backgroundColor: 'rgba(196,158,68,0.1)' }}
        >
          <h2
            className="text-xl md:text-2xl font-semibold mb-3"
            style={{ color: '#c49e44', fontFamily: 'Georgia, Palatino, serif' }}
          >
            📝 Inscription
          </h2>
          {count !== null && (
            <p className="mb-5 text-sm" style={{ color: '#f0e8d5', opacity: 0.8 }}>
              <strong style={{ color: '#c49e44' }}>{count.families}</strong> famille(s) inscrite(s)
              &nbsp;·&nbsp;
              <strong style={{ color: '#c49e44' }}>{count.persons}</strong> personne(s) au total
            </p>
          )}
          {count === null && (
            <p className="mb-5 text-sm" style={{ color: '#f0e8d5', opacity: 0.5 }}>
              Chargement des inscriptions…
            </p>
          )}
          <button
            onClick={onRegister}
            className="inline-block px-8 py-4 rounded-xl text-lg font-semibold transition-all"
            style={{ backgroundColor: '#c49e44', color: '#0d2518' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#d4af54')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#c49e44')}
          >
            S&apos;inscrire / Modifier mon inscription
          </button>
          <div className="mt-5 flex items-center justify-center gap-4">
            <a
              href="https://www.flightradar24.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs underline"
              style={{ color: '#f0e8d5', opacity: 0.5 }}
            >
              ✈️ Suivre mon vol
            </a>
            <Link
              href="/admin"
              className="text-xs"
              style={{ color: '#f0e8d5', opacity: 0.35 }}
            >
              Accès organisateur
            </Link>
          </div>
        </div>
      </main>

      <footer className="text-center py-6 px-4 border-t" style={{ borderColor: 'rgba(196,158,68,0.2)' }}>
        <p className="text-xs" style={{ color: '#f0e8d5', opacity: 0.45 }}>
          Jamat Sidi Abdallah · Omra 2026 · Informations non définitives, à confirmer
        </p>
      </footer>
    </div>
  )
}

/* ────────────────────────────────────────────────────── STEP 1 VIEW ── */
function Step1View({
  onFound,
  onNew,
  onCancel,
}: {
  onFound: (reg: Registration) => void
  onNew: (name: string) => void
  onCancel: () => void
}) {
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [matches, setMatches] = useState<Registration[] | null>(null)

  useEffect(() => {
    fetch('/api/registrations')
      .then((r) => r.json())
      .then((data) => setRegistrations(data))
      .catch(() => setRegistrations([]))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fullName = `${prenom.trim()} ${nom.trim()}`.trim()
    if (!fullName) return

    const normName = normalizeName(fullName)
    const normNom = normalizeName(nom)

    // Exact match (case / accent / whitespace insensitive)
    const exact = registrations.find(
      (r) => normalizeName(r.name) === normName
    )
    if (exact) {
      onFound(exact)
      return
    }

    // Same last name, different first name
    const sameLastName = registrations.filter((r) => {
      const norm = normalizeName(r.name)
      return (
        norm.split(' ').slice(1).join(' ') === normNom ||
        norm.endsWith(' ' + normNom)
      )
    })
    if (sameLastName.length > 0) {
      setMatches(sameLastName)
      return
    }

    // No match
    onNew(fullName)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-xl mx-auto w-full px-4 pb-16">
        <div
          className="rounded-2xl border p-6 md:p-8"
          style={{ borderColor: '#c49e44', backgroundColor: 'rgba(196,158,68,0.06)' }}
        >
          <button
            type="button"
            onClick={onCancel}
            className="mb-4 inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ border: '2px solid rgba(196,158,68,0.5)', color: '#c49e44', backgroundColor: 'transparent' }}
          >
            ← Retour à l&apos;accueil
          </button>
          <h2
            className="text-2xl font-semibold mb-2"
            style={{ color: '#c49e44', fontFamily: 'Georgia, Palatino, serif' }}
          >
            Étape 1 — Identification
          </h2>
          <p className="text-sm mb-6" style={{ color: '#f0e8d5', opacity: 0.7 }}>
            Entrez votre prénom et nom pour créer ou retrouver votre inscription.
          </p>

          {loading && (
            <p className="text-sm mb-4" style={{ color: '#f0e8d5', opacity: 0.5 }}>
              Chargement…
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#c49e44' }}>
                Prénom
              </label>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                required
                className="w-full rounded-lg px-4 py-3 text-base outline-none"
                style={{
                  backgroundColor: 'rgba(13,37,24,0.9)',
                  border: '1px solid rgba(196,158,68,0.4)',
                  color: '#f0e8d5',
                }}
                placeholder="Votre prénom"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#c49e44' }}>
                Nom
              </label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                className="w-full rounded-lg px-4 py-3 text-base outline-none"
                style={{
                  backgroundColor: 'rgba(13,37,24,0.9)',
                  border: '1px solid rgba(196,158,68,0.4)',
                  color: '#f0e8d5',
                }}
                placeholder="Votre nom de famille"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-base transition-all"
              style={{ backgroundColor: '#c49e44', color: '#0d2518' }}
            >
              Continuer →
            </button>
          </form>

          {/* Existing last name matches */}
          {matches && matches.length > 0 && (
            <div
              className="mt-6 rounded-xl p-4"
              style={{ backgroundColor: 'rgba(202,138,4,0.12)', border: '1px solid rgba(202,138,4,0.4)' }}
            >
              <p className="text-sm font-semibold mb-3" style={{ color: '#fbbf24' }}>
                Des inscriptions avec ce nom de famille existent déjà :
              </p>
              <div className="space-y-2 mb-4">
                {matches.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => onFound(m)}
                    className="w-full text-left px-4 py-2 rounded-lg text-sm transition-colors"
                    style={{ backgroundColor: 'rgba(196,158,68,0.15)', color: '#f0e8d5', border: '1px solid rgba(196,158,68,0.3)' }}
                  >
                    <span style={{ color: '#c49e44' }}>{m.name}</span>
                    <span className="ml-2 text-xs" style={{ opacity: 0.6 }}>
                      — inscrit le {m.date}
                    </span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  const fullName = `${prenom.trim()} ${nom.trim()}`.trim()
                  onNew(fullName)
                }}
                className="w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                style={{ border: '1px solid rgba(196,158,68,0.5)', color: '#c49e44', backgroundColor: 'transparent' }}
              >
                Non, je crée une nouvelle inscription
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

/* ────────────────────────────────────────────────────── STEP 2 VIEW ── */
function Step2View({
  fullName,
  existing,
  onSuccess,
  onBack,
}: {
  fullName: string
  existing: Registration | null
  onSuccess: (reg: Registration) => void
  onBack: () => void
}) {
  const [adults, setAdults] = useState(existing?.adults ?? 1)
  const [children, setChildren] = useState(existing?.children ?? 0)
  const [departureCity, setDepartureCity] = useState(existing?.departureCity ?? '')
  const [flightNumberOut, setFlightNumberOut] = useState(existing?.flightNumberOut ?? existing?.flightNumber ?? '')
  const [flightNumberReturn, setFlightNumberReturn] = useState(existing?.flightNumberReturn ?? '')
  const [flightDateOut, setFlightDateOut] = useState(existing?.flightDateOut ?? '')
  const [flightDateReturn, setFlightDateReturn] = useState(existing?.flightDateReturn ?? '')
  const [proba, setProba] = useState(existing?.proba ?? '')
  const [comment, setComment] = useState(existing?.comment ?? '')
  const [persons, setPersons] = useState<Person[]>(() =>
    buildPersons(existing?.adults ?? 1, existing?.children ?? 0, existing?.persons ?? [])
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const isEditing = !!existing

  // Keep the per-person list in sync with the adults/children counters,
  // preserving already-entered data.
  useEffect(() => {
    setPersons((prev) => buildPersons(adults, children, prev))
  }, [adults, children])

  const updatePerson = (index: number, field: keyof Omit<Person, 'type'>, value: string) => {
    setPersons((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!departureCity || !proba) {
      setError('Veuillez remplir tous les champs obligatoires.')
      return
    }
    setError('')
    setSaving(true)

    const payload: Registration = {
      id: existing?.id ?? Date.now(),
      name: fullName,
      adults,
      children,
      departureCity,
      // flightPreference kept silently for backward compatibility with existing entries
      ...(existing?.flightPreference ? { flightPreference: existing.flightPreference } : {}),
      flightNumberOut,
      flightNumberReturn,
      flightDateOut,
      flightDateReturn,
      proba,
      comment,
      persons,
      date: new Date().toLocaleDateString('fr-FR'),
    }

    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Erreur serveur')
      onSuccess(payload)
    } catch {
      setError("Erreur lors de la sauvegarde. Veuillez réessayer.")
    } finally {
      setSaving(false)
    }
  }

  const cityOptions = ['Lyon', 'Paris', 'Autre']

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-xl mx-auto w-full px-4 pb-16">
        <div
          className="rounded-2xl border p-6 md:p-8"
          style={{ borderColor: '#c49e44', backgroundColor: 'rgba(196,158,68,0.06)' }}
        >
          <button
            type="button"
            onClick={onBack}
            className="mb-4 inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ border: '2px solid rgba(196,158,68,0.5)', color: '#c49e44', backgroundColor: 'transparent' }}
          >
            ← Retour
          </button>
          <h2
            className="text-2xl font-semibold mb-1"
            style={{ color: '#c49e44', fontFamily: 'Georgia, Palatino, serif' }}
          >
            Étape 2 — {isEditing ? 'Modifier' : 'Votre inscription'}
          </h2>
          <p className="text-sm mb-6" style={{ color: '#f0e8d5', opacity: 0.7 }}>
            Inscription pour : <strong style={{ color: '#c49e44' }}>{fullName}</strong>
          </p>

          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Adults */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: '#c49e44' }}>
                Nombre d&apos;adultes
              </label>
              <Counter value={adults} min={1} onChange={setAdults} />
            </div>

            {/* Children */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: '#c49e44' }}>
                Nombre d&apos;enfants
              </label>
              <Counter value={children} min={0} onChange={setChildren} />
            </div>

            {/* Per-person details */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#c49e44' }}>
                Informations par personne{' '}
                <span style={{ opacity: 0.5, fontWeight: 'normal' }}>(optionnel — pour le visa)</span>
              </label>
              <p className="text-xs mb-3" style={{ color: '#f0e8d5', opacity: 0.5 }}>
                Passeport, nationalité et date de naissance de chaque adulte / enfant. Vous pouvez les
                compléter plus tard.
              </p>
              <div className="space-y-4">
                {persons.map((p, i) => {
                  const rank = i < adults ? i + 1 : i - adults + 1
                  return (
                    <div
                      key={i}
                      className="rounded-xl p-4"
                      style={{ backgroundColor: 'rgba(13,37,24,0.6)', border: '1px solid rgba(196,158,68,0.25)' }}
                    >
                      <div className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: '#c49e44', opacity: 0.8 }}>
                        {p.type === 'adulte' ? `Adulte ${rank}` : `Enfant ${rank}`}
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={p.passportNumber}
                          onChange={(e) => updatePerson(i, 'passportNumber', e.target.value)}
                          className="w-full rounded-lg px-4 py-2.5 text-sm outline-none"
                          style={{ backgroundColor: 'rgba(13,37,24,0.9)', border: '1px solid rgba(196,158,68,0.4)', color: '#f0e8d5' }}
                          placeholder="Numéro de passeport"
                        />
                        <input
                          type="text"
                          value={p.nationality}
                          onChange={(e) => updatePerson(i, 'nationality', e.target.value)}
                          className="w-full rounded-lg px-4 py-2.5 text-sm outline-none"
                          style={{ backgroundColor: 'rgba(13,37,24,0.9)', border: '1px solid rgba(196,158,68,0.4)', color: '#f0e8d5' }}
                          placeholder="Nationalité"
                        />
                        <div>
                          <label className="block text-xs mb-1" style={{ color: '#f0e8d5', opacity: 0.6 }}>
                            Date de naissance
                          </label>
                          <input
                            type="date"
                            value={p.birthDate}
                            onChange={(e) => updatePerson(i, 'birthDate', e.target.value)}
                            className="w-full rounded-lg px-4 py-2.5 text-sm outline-none"
                            style={{ backgroundColor: 'rgba(13,37,24,0.9)', border: '1px solid rgba(196,158,68,0.4)', color: '#f0e8d5' }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Departure city */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: '#c49e44' }}>
                Ville de départ
              </label>
              <div className="flex gap-3 flex-wrap">
                {cityOptions.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setDepartureCity(city)}
                    className="px-5 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      backgroundColor: departureCity === city ? '#c49e44' : 'transparent',
                      color: departureCity === city ? '#0d2518' : '#c49e44',
                      border: '2px solid #c49e44',
                    }}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Certitude */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: '#c49e44' }}>
                Niveau de certitude
              </label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(PROBA_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setProba(key)}
                    className="px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      backgroundColor: proba === key ? cfg.bg : 'rgba(13,37,24,0.8)',
                      border: proba === key ? `2px solid ${cfg.color}` : '2px solid rgba(196,158,68,0.2)',
                      color: proba === key ? cfg.color : '#f0e8d5',
                      opacity: proba === key ? 1 : 0.7,
                    }}
                  >
                    {cfg.emoji} {cfg.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Flight numbers */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#c49e44' }}>
                Numéro de vol — Aller <span style={{ opacity: 0.5, fontWeight: 'normal' }}>(optionnel)</span>
              </label>
              <input
                type="text"
                value={flightNumberOut}
                onChange={(e) => setFlightNumberOut(e.target.value)}
                className="w-full rounded-lg px-4 py-3 text-base outline-none"
                style={{
                  backgroundColor: 'rgba(13,37,24,0.9)',
                  border: '1px solid rgba(196,158,68,0.4)',
                  color: '#f0e8d5',
                }}
                placeholder="Ex : W6 2137, TO 7895..."
              />
              <label className="block text-xs mb-1 mt-2" style={{ color: '#f0e8d5', opacity: 0.6 }}>
                Date de départ <span style={{ opacity: 0.7 }}>(optionnel)</span>
              </label>
              <input
                type="date"
                value={flightDateOut}
                onChange={(e) => setFlightDateOut(e.target.value)}
                className="w-full rounded-lg px-4 py-3 text-base outline-none"
                style={{
                  backgroundColor: 'rgba(13,37,24,0.9)',
                  border: '1px solid rgba(196,158,68,0.4)',
                  color: '#f0e8d5',
                }}
              />

              <label className="block text-sm font-medium mb-2 mt-4" style={{ color: '#c49e44' }}>
                Numéro de vol — Retour <span style={{ opacity: 0.5, fontWeight: 'normal' }}>(optionnel)</span>
              </label>
              <input
                type="text"
                value={flightNumberReturn}
                onChange={(e) => setFlightNumberReturn(e.target.value)}
                className="w-full rounded-lg px-4 py-3 text-base outline-none"
                style={{
                  backgroundColor: 'rgba(13,37,24,0.9)',
                  border: '1px solid rgba(196,158,68,0.4)',
                  color: '#f0e8d5',
                }}
                placeholder="Ex : TO 7896, W6 2138..."
              />
              <label className="block text-xs mb-1 mt-2" style={{ color: '#f0e8d5', opacity: 0.6 }}>
                Date d&apos;arrivée <span style={{ opacity: 0.7 }}>(optionnel)</span>
              </label>
              <input
                type="date"
                value={flightDateReturn}
                onChange={(e) => setFlightDateReturn(e.target.value)}
                className="w-full rounded-lg px-4 py-3 text-base outline-none"
                style={{
                  backgroundColor: 'rgba(13,37,24,0.9)',
                  border: '1px solid rgba(196,158,68,0.4)',
                  color: '#f0e8d5',
                }}
              />
              <p className="text-xs mt-1" style={{ color: '#f0e8d5', opacity: 0.5 }}>
                Indiquez les vols que vous envisagez de prendre. Cela nous aide à organiser les
                navettes depuis et vers l&apos;aéroport. Vous pourrez les modifier plus tard.
              </p>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#c49e44' }}>
                Commentaire <span style={{ opacity: 0.5, fontWeight: 'normal' }}>(optionnel)</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full rounded-lg px-4 py-3 text-sm outline-none resize-none"
                style={{
                  backgroundColor: 'rgba(13,37,24,0.9)',
                  border: '1px solid rgba(196,158,68,0.4)',
                  color: '#f0e8d5',
                }}
                placeholder="Questions, remarques, contraintes particulières…"
              />
            </div>

            {error && (
              <p className="text-sm px-4 py-3 rounded-lg" style={{ backgroundColor: 'rgba(220,38,38,0.15)', color: '#fca5a5', border: '1px solid rgba(220,38,38,0.3)' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 rounded-xl font-semibold text-base transition-all"
              style={{
                backgroundColor: saving ? 'rgba(196,158,68,0.5)' : '#c49e44',
                color: '#0d2518',
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
            >
              {saving ? 'Enregistrement…' : isEditing ? 'Mettre à jour ✓' : 'Valider mon inscription ✓'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

/* ────────────────────────────────────────────────────── STEP 3 VIEW ── */
function Step3View({
  registration,
  onHome,
}: {
  registration: Registration
  onHome: () => void
}) {
  const cfg = PROBA_CONFIG[registration.proba] ?? PROBA_CONFIG.possible

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-xl mx-auto w-full px-4 pb-16">
        {/* Success banner */}
        <div
          className="rounded-2xl p-6 text-center mb-6"
          style={{ backgroundColor: 'rgba(22,163,74,0.15)', border: '2px solid rgba(22,163,74,0.5)' }}
        >
          <div className="text-4xl mb-3">🌙</div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: '#4ade80' }}>
            Inscription enregistrée ! Barakallah fikoum.
          </h2>
          <p className="text-sm" style={{ color: '#f0e8d5', opacity: 0.75 }}>
            Vous pouvez modifier votre inscription à tout moment en entrant à nouveau votre prénom et nom.
          </p>
        </div>

        {/* Recap card */}
        <div
          className="rounded-2xl border p-6 mb-6"
          style={{ borderColor: '#c49e44', backgroundColor: 'rgba(196,158,68,0.06)' }}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#c49e44' }}>
            Récapitulatif
          </h3>
          <dl className="space-y-3">
            {[
              { label: 'Nom', value: registration.name },
              { label: 'Adultes', value: registration.adults.toString() },
              { label: 'Enfants', value: registration.children.toString() },
              { label: 'Total personnes', value: (registration.adults + registration.children).toString() },
              { label: 'Ville de départ', value: registration.departureCity },
              ...(registration.flightNumberOut
                ? [{ label: 'Vol — Aller', value: registration.flightNumberOut }]
                : []),
              ...(registration.flightDateOut
                ? [{ label: 'Date de départ', value: registration.flightDateOut }]
                : []),
              ...(registration.flightNumberReturn
                ? [{ label: 'Vol — Retour', value: registration.flightNumberReturn }]
                : []),
              ...(registration.flightDateReturn
                ? [{ label: "Date d'arrivée", value: registration.flightDateReturn }]
                : []),
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-start gap-4">
                <dt className="text-sm" style={{ color: '#f0e8d5', opacity: 0.65 }}>
                  {item.label}
                </dt>
                <dd className="text-sm font-medium text-right" style={{ color: '#f0e8d5' }}>
                  {item.value}
                </dd>
              </div>
            ))}
            <div className="flex justify-between items-center gap-4">
              <dt className="text-sm" style={{ color: '#f0e8d5', opacity: 0.65 }}>
                Certitude
              </dt>
              <dd>
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}` }}
                >
                  {cfg.emoji} {cfg.label}
                </span>
              </dd>
            </div>
            {registration.comment && (
              <div>
                <dt className="text-sm mb-1" style={{ color: '#f0e8d5', opacity: 0.65 }}>
                  Commentaire
                </dt>
                <dd className="text-sm italic" style={{ color: '#f0e8d5', opacity: 0.8 }}>
                  &ldquo;{registration.comment}&rdquo;
                </dd>
              </div>
            )}
            <div className="flex justify-between items-center gap-4 pt-2 border-t" style={{ borderColor: 'rgba(196,158,68,0.2)' }}>
              <dt className="text-sm" style={{ color: '#f0e8d5', opacity: 0.65 }}>
                Date d&apos;inscription
              </dt>
              <dd className="text-sm" style={{ color: '#f0e8d5', opacity: 0.65 }}>
                {registration.date}
              </dd>
            </div>
          </dl>
        </div>

        {/* Per-person details, only shown if at least one field was filled in */}
        {registration.persons?.some((p) => p.passportNumber || p.nationality || p.birthDate) && (
          <div
            className="rounded-2xl border p-6 mb-6"
            style={{ borderColor: '#c49e44', backgroundColor: 'rgba(196,158,68,0.06)' }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#c49e44' }}>
              Informations par personne
            </h3>
            <div className="space-y-4">
              {registration.persons.map((p, i) => {
                const adultsCount = registration.adults
                const rank = i < adultsCount ? i + 1 : i - adultsCount + 1
                return (
                  <div key={i}>
                    <div className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#c49e44', opacity: 0.8 }}>
                      {p.type === 'adulte' ? `Adulte ${rank}` : `Enfant ${rank}`}
                    </div>
                    <dl className="space-y-1">
                      {[
                        { label: 'Passeport', value: p.passportNumber },
                        { label: 'Nationalité', value: p.nationality },
                        { label: 'Naissance', value: p.birthDate },
                      ]
                        .filter((item) => item.value)
                        .map((item) => (
                          <div key={item.label} className="flex justify-between items-start gap-4">
                            <dt className="text-sm" style={{ color: '#f0e8d5', opacity: 0.65 }}>
                              {item.label}
                            </dt>
                            <dd className="text-sm font-medium text-right" style={{ color: '#f0e8d5' }}>
                              {item.value}
                            </dd>
                          </div>
                        ))}
                    </dl>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <button
          onClick={onHome}
          className="w-full py-3 rounded-xl text-sm font-medium transition-all"
          style={{ border: '2px solid rgba(196,158,68,0.5)', color: '#c49e44', backgroundColor: 'transparent' }}
        >
          ← Retour à la page d&apos;accueil
        </button>
      </main>
    </div>
  )
}

/* ───────────────────────────────────────────────────────── ROOT PAGE ── */
export default function Page() {
  const [view, setView] = useState<View>('home')
  const [fullName, setFullName] = useState('')
  const [existingReg, setExistingReg] = useState<Registration | null>(null)
  const [confirmedReg, setConfirmedReg] = useState<Registration | null>(null)
  const [count, setCount] = useState<{ families: number; persons: number } | null>(null)

  useEffect(() => {
    fetch('/api/count')
      .then((r) => r.json())
      .then(setCount)
      .catch(() => setCount({ families: 0, persons: 0 }))
  }, [])

  const handleRegisterClick = () => setView('step1')

  const handleFound = (reg: Registration) => {
    setFullName(reg.name)
    setExistingReg(reg)
    setView('step2')
  }

  const handleNew = (name: string) => {
    setFullName(name)
    setExistingReg(null)
    setView('step2')
  }

  const handleSuccess = (reg: Registration) => {
    setConfirmedReg(reg)
    // Refresh count
    fetch('/api/count')
      .then((r) => r.json())
      .then(setCount)
      .catch(() => {})
    setView('step3')
  }

  const handleHome = () => {
    setView('home')
    setFullName('')
    setExistingReg(null)
    setConfirmedReg(null)
  }

  if (view === 'home') {
    return <HomeView onRegister={handleRegisterClick} count={count} />
  }
  if (view === 'step1') {
    return <Step1View onFound={handleFound} onNew={handleNew} onCancel={handleHome} />
  }
  if (view === 'step2') {
    return <Step2View fullName={fullName} existing={existingReg} onSuccess={handleSuccess} onBack={() => setView('step1')} />
  }
  if (view === 'step3' && confirmedReg) {
    return <Step3View registration={confirmedReg} onHome={handleHome} />
  }
  return <HomeView onRegister={handleRegisterClick} count={count} />
}
