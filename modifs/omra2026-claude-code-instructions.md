# Omra 2026 — Registration Website

## PROMPT TO GIVE CLAUDE CODE

Build a French-language Umrah 2026 registration web page using Next.js, deployable on Vercel with Vercel KV for data persistence.

---

## TECH STACK
- Next.js 14 (App Router)
- Vercel KV (Redis) for storing registrations
- Tailwind CSS for styling
- Single page app with multiple views (no separate routes except /admin)

---

## DESIGN
Dark green & gold Islamic aesthetic.
- Background: #0d2518
- Gold accents: #c49e44
- Text: #f0e8d5
- Elegant, mobile-first. Font: serif (Georgia or Palatino).

---

## PAGE CONTENT (all text in French)

### Header
- Large crescent moon icon ☪
- Title: "Omra 2026"
- Gold divider line
- Subtitle: "Jamat Sidi Abdallah" (uppercase, spaced letters)

---

### Section 1 — Informations du voyage
4-card grid:
- Dates : ~18 – 28 octobre 2026 (±1 jour)
- Villes : Makkah → Medine
- Durée : ~10 jours · 2-3 j. Makkah + 2-3 j. Medine
- Départ : Lyon & Paris

---

### Section 2 — Budget estimé
Large gold text: "~1 000 – 1 100 € / personne"
Two line items:
- ✈️ Vol aller-retour : ~500 – 600 € (en cours de négociation)
- 🏨 Hébergement + repas + transport sur place + visites (Makkah, Medine, grottes et lieux saints) : ~500 €

Warning box (gold italic):
"⚠️ Estimation basée sur le voyage 2025. Le tarif définitif sera confirmé une fois les vols et hébergements réservés."

---

### Section 3 — Notice importante (RED border, prominent, large)
Title: ⚠️ Notice importante — À lire attentivement

Text:
"Sidi et Oumoussama seront peut-être présents lors de ce voyage, mais sans aucune garantie. Vous pourrez insha'Allah les croiser, mais ne comptez pas sur leur présence.

L'Omra sera organisée en petits groupes. Ne comptez pas sur Sidi pour vous accompagner ou vous guider personnellement pendant les rituels — chacun effectuera son Omra avec son groupe, selon son rythme."

---

### Section 4 — Vols
Two flight cards:
- 🛫 Aller — Rome (FCO) → Jeddah (JED) : Option intéressante avec WizzAir depuis Rome à l'étude.
- 🛬 Retour — Medine (MED) → Paris (ORY) : Option intéressante avec Transavia depuis Medine vers Paris à l'étude.

Info card below:
"Nous contactons compagnies et agences pour un tarif groupe. Pour l'instant les agences proposent les mêmes prix voire plus cher — les négociations continuent.

Si un bon tarif groupe est trouvé → tout le monde voyage ensemble avec accueil coordonné à l'aéroport.

Sinon → chacun réserve son propre billet. On organisera 1 ou 2 navettes de pickup selon les vols les plus représentés. Les autres rejoindront l'hôtel par leurs propres moyens."

---

### Section 5 — Hébergement
Two hotel cards:

1. Abraj Al Tayseer Tuwa Hotel
   City: Makkah
   "Hôtel 3★ à ~15 min à pied de la Grande Mosquée. Navette gratuite. Déjà utilisé en 2025."
   Link: https://www.booking.com/hotel/sa/al-tayseer-towers.html

2. Diyar AlSaliheen Serviced Apartments
   City: Medine
   "Appartements spacieux avec cuisine. ~10 min en taxi de la Mosquée du Prophète. Navette aux heures de prière. Déjà utilisé en 2025."
   Link: https://www.booking.com/hotel/sa/diyar-alsaliheen-dyr-lslhyn.html

Note below hotels:
"D'autres établissements sont également à l'étude selon les disponibilités et les tarifs."

---

### Section 6 — CTA Inscription (green card)
- Live count: "X famille(s) inscrite(s) · X personne(s) au total" (fetched from API)
- Large gold button: "S'inscrire / Modifier mon inscription"
- Small discreet link below: "Accès organisateur"

---

### Footer
"Jamat Sidi Abdallah · Omra 2026 · Informations non définitives, à confirmer"

---

## REGISTRATION FLOW (client-side, multi-step)

### Step 1 — Identification
Two fields: Prénom + Nom

Logic (call GET /api/registrations on load, do matching client-side):
- Exact full name match (case-insensitive, trimmed) → load that entry for editing
- Same last name, different first name → show warning card:
  "⚠️ Un membre de votre famille [NOM] est déjà inscrit. Quelqu'un de votre famille vous a peut-être déjà inclus dans son inscription."
  Button 1: "✏️ Modifier la fiche de [full name]" (for each match)
  Button 2: "Non, je crée une nouvelle inscription"
- No match → go to form with blank fields

### Step 2 — Registration Form
Fields:

1. Nombre d'adultes (18 ans et +)
   +/- counter buttons, minimum 1

2. Nombre d'enfants (moins de 18 ans)
   +/- counter buttons, minimum 0

3. Ville de départ
   Radio/button choice: Lyon | Paris | Autre

4. Préférence vol
   Radio/button choice:
   - "🤝 Réservation groupe — Je préfère voyager avec le groupe"
   - "✈️ Billet individuel — Je gère mon propre billet et mon transport à l'arrivée"

5. Niveau de certitude
   4 colored buttons:
   - ✅ Certain(e)      (green,  weight 100%)
   - 🟢 Très probable  (green,  weight 85%)
   - 🟡 Possible       (yellow, weight 60%)
   - 🟠 Incertain(e)   (orange, weight 30%)

6. Commentaire / Question (optional textarea)
   Placeholder: "Contrainte particulière, question, mobilité réduite…"

Submit button: "Valider mon inscription ✓" (or "Mettre à jour ✓" if editing)
Show loading state while saving.
Show error message if save fails.

### Step 3 — Confirmation Screen
Show recap card:
- Name
- Adults / Children
- Departure city
- Flight preference
- Certitude level (with emoji + color badge)
- Comment (if any)

Message: "🌙 Inscription enregistrée ! Barakallah fikoum."
Sub-message: "Vous pouvez modifier votre inscription à tout moment en entrant à nouveau votre prénom et nom."
Button: "← Retour à la page d'accueil"

---

## ADMIN DASHBOARD (/admin)

Password gate: "omra2026"
(Simple client-side password check is fine, no need for auth system)

Stats section (card grid):
- Total familles inscrites
- Total personnes (adults + children)
- Personnes attendues (weighted by certitude %)
- Répartition par ville de départ (Lyon / Paris / Autre) with counts
- Répartition par préférence vol (groupe / individuel) with counts
- Répartition par certitude (4 levels) with family count + person count each

Full registrations list (most recent first):
Each row shows: Name | Adults | Children | City | Flight pref | Certitude badge | Date | Comment

Button: "← Retour à la page"

---

## API ROUTES

### GET /api/registrations
Returns full array of registrations from Vercel KV.
Key in KV: "omra2026_registrations"

### POST /api/registrations
Body: registration object
Logic: if entry with same id exists → replace it, else append.
Saves full updated array back to KV.

### GET /api/count
Returns: { families: number, persons: number }
Used for the public live counter on the main page.

---

## DATA STRUCTURE
Each registration object:
{
  id: number,           // Date.now() timestamp
  name: string,         // "Prénom Nom"
  adults: number,       // min 1
  children: number,     // min 0
  departureCity: string, // "Lyon" | "Paris" | "Autre"
  flightPreference: string, // "groupe" | "individuel"
  proba: string,        // "certain" | "probable" | "possible" | "incertain"
  comment: string,      // optional, can be empty string
  date: string          // e.g. "12/05/2026" (fr-FR locale)
}

---

## DEPLOYMENT NOTES
- Must work with Vercel KV (use @vercel/kv package)
- Include a .env.example file with: KV_URL, KV_REST_API_URL, KV_REST_API_TOKEN, KV_REST_API_READ_ONLY_TOKEN
- Include README with deployment steps:
  1. npm install
  2. vercel login
  3. vercel deploy
  4. Add KV database in Vercel dashboard → Storage → Create KV → link to project
  5. Redeploy
