'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type View = 'home' | 'step1' | 'step2' | 'step3'

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
        {/* Section 1 — Informations du voyage */}
        <SectionCard title="📍 Informations du voyage">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Dates', value: '~18 – 28 oct. 2026', sub: '(± 1 jour)' },
              { label: 'Villes', value: 'Makkah → Medine', sub: '' },
              { label: 'Durée', value: '~10 jours', sub: '2-3 j. Makkah + 2-3 j. Medine' },
              { label: 'Départ', value: 'Lyon & Paris', sub: '' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl p-4 text-center"
                style={{ backgroundColor: 'rgba(196,158,68,0.1)', border: '1px solid rgba(196,158,68,0.25)' }}
              >
                <div className="text-xs uppercase tracking-wider mb-2" style={{ color: '#c49e44', opacity: 0.8 }}>
                  {item.label}
                </div>
                <div className="font-semibold text-sm" style={{ color: '#f0e8d5' }}>
                  {item.value}
                </div>
                {item.sub && (
                  <div className="text-xs mt-1" style={{ color: '#f0e8d5', opacity: 0.6 }}>
                    {item.sub}
                  </div>
                )}
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Section 2 — Budget estimé */}
        <SectionCard title="💰 Budget estimé">
          <div className="text-center mb-6">
            <span className="text-3xl md:text-4xl font-bold" style={{ color: '#c49e44' }}>
              ~1 000 – 1 100 €
            </span>
            <span className="ml-2 text-lg" style={{ color: '#f0e8d5', opacity: 0.8 }}>
              / personne
            </span>
          </div>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <span className="text-xl">✈️</span>
              <span style={{ color: '#f0e8d5' }}>
                <strong style={{ color: '#c49e44' }}>Vol aller-retour :</strong>{' '}
                ~500 – 600 € <span style={{ opacity: 0.7 }}>(en cours de négociation)</span>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">🏨</span>
              <span style={{ color: '#f0e8d5' }}>
                <strong style={{ color: '#c49e44' }}>Hébergement + repas + transport sur place + visites</strong>{' '}
                (Makkah, Medine, grottes et lieux saints) : ~500 €
              </span>
            </li>
          </ul>
          <div
            className="rounded-xl p-4 italic text-sm"
            style={{ borderLeft: '3px solid #c49e44', backgroundColor: 'rgba(196,158,68,0.08)', color: '#f0e8d5', opacity: 0.9 }}
          >
            ⚠️ Estimation basée sur le voyage 2025. Le tarif définitif sera confirmé une fois les vols
            et hébergements réservés.
          </div>
        </SectionCard>

        {/* Section 3 — Notice importante */}
        <div
          className="rounded-2xl border-2 p-6 md:p-8 mb-8"
          style={{ borderColor: '#dc2626', backgroundColor: 'rgba(220,38,38,0.07)' }}
        >
          <h2
            className="text-xl md:text-2xl font-semibold mb-4"
            style={{ color: '#fca5a5', fontFamily: 'Georgia, Palatino, serif' }}
          >
            ⚠️ Notice importante — À lire attentivement
          </h2>
          <div className="space-y-4 text-base leading-relaxed" style={{ color: '#f0e8d5' }}>
            <p>
              Sidi et Oumoussama seront peut-être présents lors de ce voyage, mais{' '}
              <strong style={{ color: '#fca5a5' }}>sans aucune garantie</strong>. Vous pourrez
              insha&apos;Allah les croiser, mais ne comptez pas sur leur présence.
            </p>
            <p>
              L&apos;Omra sera organisée en petits groupes. Ne comptez pas sur Sidi pour vous
              accompagner ou vous guider personnellement pendant les rituels — chacun effectuera son
              Omra avec son groupe, selon son rythme.
            </p>
          </div>
        </div>

        {/* Section 4 — Vols */}
        <SectionCard title="✈️ Vols">
          <div className="grid md:grid-cols-2 gap-4 mb-5">
            <div
              className="rounded-xl p-4"
              style={{ backgroundColor: 'rgba(196,158,68,0.1)', border: '1px solid rgba(196,158,68,0.25)' }}
            >
              <div className="text-2xl mb-2">🛫</div>
              <div className="font-semibold mb-1" style={{ color: '#c49e44' }}>
                Aller
              </div>
              <div className="text-sm font-medium mb-1" style={{ color: '#f0e8d5' }}>
                Rome (FCO) → Jeddah (JED)
              </div>
              <div className="text-sm" style={{ color: '#f0e8d5', opacity: 0.75 }}>
                Option intéressante avec WizzAir depuis Rome à l&apos;étude.
              </div>
            </div>
            <div
              className="rounded-xl p-4"
              style={{ backgroundColor: 'rgba(196,158,68,0.1)', border: '1px solid rgba(196,158,68,0.25)' }}
            >
              <div className="text-2xl mb-2">🛬</div>
              <div className="font-semibold mb-1" style={{ color: '#c49e44' }}>
                Retour
              </div>
              <div className="text-sm font-medium mb-1" style={{ color: '#f0e8d5' }}>
                Medine (MED) → Paris (ORY)
              </div>
              <div className="text-sm" style={{ color: '#f0e8d5', opacity: 0.75 }}>
                Option intéressante avec Transavia depuis Medine vers Paris à l&apos;étude.
              </div>
            </div>
          </div>
          <div
            className="rounded-xl p-4 text-sm leading-relaxed space-y-3"
            style={{ backgroundColor: 'rgba(13,37,24,0.8)', border: '1px solid rgba(196,158,68,0.2)', color: '#f0e8d5' }}
          >
            <p style={{ opacity: 0.9 }}>
              Nous contactons compagnies et agences pour un tarif groupe. Pour l&apos;instant les
              agences proposent les mêmes prix voire plus cher — les négociations continuent.
            </p>
            <p>
              <strong style={{ color: '#c49e44' }}>Si un bon tarif groupe est trouvé</strong> → tout
              le monde voyage ensemble avec accueil coordonné à l&apos;aéroport.
            </p>
            <p>
              <strong style={{ color: '#c49e44' }}>Sinon</strong> → chacun réserve son propre
              billet. On organisera 1 ou 2 navettes de pickup selon les vols les plus représentés.
              Les autres rejoindront l&apos;hôtel par leurs propres moyens.
            </p>
          </div>
        </SectionCard>

        {/* Section 5 — Hébergement */}
        <SectionCard title="🏨 Hébergement">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {[
              {
                city: 'Makkah',
                name: 'Abraj Al Tayseer Tuwa Hotel',
                stars: '3★',
                desc: "Hôtel 3★ à ~15 min à pied de la Grande Mosquée. Navette gratuite. Déjà utilisé en 2025.",
                href: 'https://www.booking.com/hotel/sa/al-tayseer-towers.html',
              },
              {
                city: 'Medine',
                name: 'Diyar AlSaliheen Serviced Apartments',
                stars: 'Appart.',
                desc: "Appartements spacieux avec cuisine. ~10 min en taxi de la Mosquée du Prophète. Navette aux heures de prière. Déjà utilisé en 2025.",
                href: 'https://www.booking.com/hotel/sa/diyar-alsaliheen-dyr-lslhyn.html',
              },
            ].map((h) => (
              <div
                key={h.city}
                className="rounded-xl p-4"
                style={{ backgroundColor: 'rgba(196,158,68,0.1)', border: '1px solid rgba(196,158,68,0.25)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: '#c49e44', color: '#0d2518' }}>
                    {h.city}
                  </span>
                </div>
                <div className="font-semibold text-sm mb-2" style={{ color: '#c49e44' }}>
                  {h.name}
                </div>
                <p className="text-sm mb-3" style={{ color: '#f0e8d5', opacity: 0.85 }}>
                  {h.desc}
                </p>
                <a
                  href={h.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs underline"
                  style={{ color: '#c49e44' }}
                >
                  Voir sur Booking.com →
                </a>
              </div>
            ))}
          </div>
          <p className="text-sm italic" style={{ color: '#f0e8d5', opacity: 0.65 }}>
            D&apos;autres établissements sont également à l&apos;étude selon les disponibilités et les tarifs.
          </p>
        </SectionCard>

        {/* Section 6 — CTA Inscription */}
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
          <div className="mt-5">
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
}: {
  onFound: (reg: Registration) => void
  onNew: (name: string) => void
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

    const normName = fullName.toLowerCase()
    const normNom = nom.trim().toLowerCase()

    // Exact match (case-insensitive)
    const exact = registrations.find(
      (r) => r.name.toLowerCase() === normName
    )
    if (exact) {
      onFound(exact)
      return
    }

    // Same last name, different first name
    const sameLastName = registrations.filter((r) =>
      r.name.toLowerCase().split(' ').slice(1).join(' ') === normNom ||
      r.name.toLowerCase().endsWith(' ' + normNom)
    )
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
}: {
  fullName: string
  existing: Registration | null
  onSuccess: (reg: Registration) => void
}) {
  const [adults, setAdults] = useState(existing?.adults ?? 1)
  const [children, setChildren] = useState(existing?.children ?? 0)
  const [departureCity, setDepartureCity] = useState(existing?.departureCity ?? '')
  const [flightPreference, setFlightPreference] = useState(existing?.flightPreference ?? '')
  const [proba, setProba] = useState(existing?.proba ?? '')
  const [comment, setComment] = useState(existing?.comment ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const isEditing = !!existing

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!departureCity || !flightPreference || !proba) {
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
      flightPreference,
      proba,
      comment,
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

            {/* Flight preference */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: '#c49e44' }}>
                Préférence vol
              </label>
              <div className="grid gap-3">
                <button
                  type="button"
                  onClick={() => setFlightPreference('groupe')}
                  className="text-left px-5 py-4 rounded-xl transition-all"
                  style={{
                    backgroundColor: flightPreference === 'groupe' ? 'rgba(196,158,68,0.25)' : 'rgba(196,158,68,0.07)',
                    border: flightPreference === 'groupe' ? '2px solid #c49e44' : '2px solid rgba(196,158,68,0.3)',
                    color: '#f0e8d5',
                  }}
                >
                  <div className="font-semibold mb-1" style={{ color: flightPreference === 'groupe' ? '#c49e44' : '#f0e8d5' }}>
                    🤝 Réservation groupe
                  </div>
                  <div className="text-sm" style={{ opacity: 0.75 }}>
                    Je préfère voyager avec le groupe
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFlightPreference('individuel')}
                  className="text-left px-5 py-4 rounded-xl transition-all"
                  style={{
                    backgroundColor: flightPreference === 'individuel' ? 'rgba(196,158,68,0.25)' : 'rgba(196,158,68,0.07)',
                    border: flightPreference === 'individuel' ? '2px solid #c49e44' : '2px solid rgba(196,158,68,0.3)',
                    color: '#f0e8d5',
                  }}
                >
                  <div className="font-semibold mb-1" style={{ color: flightPreference === 'individuel' ? '#c49e44' : '#f0e8d5' }}>
                    ✈️ Billet individuel
                  </div>
                  <div className="text-sm" style={{ opacity: 0.75 }}>
                    Je gère mon propre billet et mon transport à l&apos;arrivée
                  </div>
                </button>
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
              {
                label: 'Préférence vol',
                value: registration.flightPreference === 'groupe' ? '🤝 Réservation groupe' : '✈️ Billet individuel',
              },
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
    return <Step1View onFound={handleFound} onNew={handleNew} />
  }
  if (view === 'step2') {
    return <Step2View fullName={fullName} existing={existingReg} onSuccess={handleSuccess} />
  }
  if (view === 'step3' && confirmedReg) {
    return <Step3View registration={confirmedReg} onHome={handleHome} />
  }
  return <HomeView onRegister={handleRegisterClick} count={count} />
}
