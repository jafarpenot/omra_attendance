# Omra 2026 — Instructions de mise à jour (round 2)

Please apply all the following changes to the existing Next.js Omra 2026 website.
All text is in French. Do NOT break existing registration data — only modify display and form fields.

---

## 1. SECTION "Notice importante" — Complete rewrite

Replace the entire content of the Notice importante section with the following.
Keep the same red border / prominent styling.

Title: ⚠️ Notice importante — À lire attentivement

Content (use clear sub-sections or paragraphs):

### Sidi et Oumoussama
"Sidi et Oumoussama seront peut-être présents lors de ce voyage, mais sans aucune garantie. Vous pourrez insha'Allah les croiser, mais ne comptez pas sur leur présence permanente. L'Omra ne sera pas effectuée avec eux — chacun effectuera son Omra avec son groupe, selon son rythme."

### Responsabilité familiale
"Cette Omra est organisée pour l'ensemble du groupe, mais chaque participant est entièrement responsable de sa propre famille : ses enfants, ses personnes âgées et toute personne à sa charge. Les organisateurs ne peuvent pas assurer la prise en charge individuelle des membres de chaque famille."

### Organisation bénévole — aucune réclamation
"Ce voyage est organisé bénévolement, dans le seul but de faciliter l'accès à l'Omra de manière simple et abordable. En conséquence, aucune réclamation ou plainte ne pourra être acceptée. Si un aspect de l'organisation ne convient pas à un participant (transport, hébergement, programme...), il est libre d'organiser cela par ses propres moyens — à condition d'en informer les organisateurs à l'avance."

### Séparation hommes / femmes
"Dans un souci d'organisation et d'économie, les chambres seront réparties entre hommes et femmes séparément. Ne comptez pas nécessairement sur être dans la même chambre que votre famille ou votre conjoint(e). Cette organisation nous permet de minimiser les coûts pour tout le monde."

### Date limite d'inscription — IMPORTANT
"Les inscriptions doivent être confirmées avant mi-juillet 2026, et au plus tard fin juillet 2026.
Passé cette date, les personnes non inscrites ne seront pas comptabilisées et ne pourront plus rejoindre le groupe.
Toute personne confirmée fin juillet s'engage à participer et à régler sa part des frais d'hébergement, qui sera réservé sur cette base."

---

## 2. SECTION "Programme & Visites" — Add to Medina visits list

In the Médine visits list, add this item:
- Palmeraie de Médine — plantation de palmiers-dattiers historique

(Add it at the end of the Médine list, after Puits de Ghars)

---

## 3. SECTION "Vols" — Small update

Remove any mention of group booking preference or shared flight option.
The section should clearly state that everyone books their own flight individually.
Keep the three airline options (WizzAir, Transavia, Aegean) as-is.
Keep the transport navette section as-is.

Note: flight links will be added later — add a placeholder comment in the code:
// TODO: add flight links when provided

---

## 4. SECTION "À faire maintenant" — Update visa card

Replace the visa card content with:

Title: 🛂 Faire son visa

Text:
"Le visa touristique pour l'Arabie Saoudite est obligatoire et s'obtient entièrement en ligne.

⚠️ Important : Demandez un VISA TOURISTIQUE — pas un visa Omra. Le visa touristique vous permet d'effectuer l'Omra (vous pouvez sélectionner 'Omra' comme motif de visite lors de la demande, mais le type de visa doit bien être 'Touristique').

Vérifiez que votre passeport est valable au moins 6 mois après la date d'arrivée sur le territoire saoudien.

🔗 Lien officiel pour faire votre visa :"

Then add a visible button/link: "Faire son visa →" pointing to https://visa.visitsaudi.com/

---

## 5. SECTION "À faire avant de partir" — Add clarification + vaccine + conversion certificate

### Rename / clarify the section title
Change the section title to:
"🧳 À faire juste avant de prendre l'avion"

Add an intro note at the top of the section:
"Les étapes suivantes sont à effectuer le jour du départ ou juste avant de prendre l'avion — pas maintenant."

### Update the vaccine bullet point
Replace:
"💉 Faire le vaccin méningite (obligation sujette à ambiguïté — chacun est libre de se renseigner)"

With:
"💉 Vaccin méningite — En pratique, il n'a pas été demandé aux voyageurs ces dernières années, et de nombreux sites confirment qu'il n'est plus obligatoire. Cependant, une ambiguïté subsiste entre certains sites officiels. Chacun est libre de le faire ou non en connaissance de cause."

### Add a new bullet point after the vaccine
"📄 Certificat de conversion à l'Islam (pour les convertis) — En pratique, ce document n'est généralement pas demandé à l'entrée du territoire saoudien. Chaque personne concernée prend sa propre décision en connaissance de cause."

### Update the Ihram note
Change:
"La prise d'Ihram se fait à l'escale ou dans l'avion, avant de passer les Miqats."

To:
"🕋 La prise d'Ihram se fait à l'escale ou dans l'avion, juste avant de passer les Miqats — gardez votre Ihram dans vos bagages à main, pas en soute."

---

## 6. SECTION "Programme & Visites" — Update transport footnote

Find the footnote that says something like:
"Les déplacements vers les lieux saints (mosquée Al-Haram et Mosquée du Prophète) se font via les navettes de l'hôtel..."

Replace it with:
"* Les allers-retours quotidiens vers les deux Haramayn — Al-Masjid Al-Haram (La Mecque) et Al-Masjid An-Nabawi (Mosquée du Prophète à Médine) — ne sont pas organisés par nos soins. L'hôtel met à disposition des navettes aux heures de prière, libres à vous de les utiliser. En revanche, les visites listées ci-dessus seront organisées et encadrées par le groupe."

---

## 7. REGISTRATION FORM — Three changes

### Important: Do NOT break existing registration data.
Existing entries may have a 'flightPreference' field — simply stop displaying it, do not delete it from the data.
The new 'flightNumber' field will be empty for existing registrations — that is fine.

### Change 1 — Add a back button
On the registration form screen, add a "← Retour" button that goes back to the identification/login screen.
Style it as a secondary button (same as other secondary buttons on the site).

### Change 2 — Remove flight preference field
Remove the field:
"Préférence vol — Réservation groupe / Billet individuel"

Do not delete this field from the database — just remove it from the form UI and from the confirmation screen display.
Keep it in the data model silently (for backward compatibility with existing entries).

### Change 3 — Add flight number field
Add a new optional text field after the certitude/probability selector:

Label: "Numéro de vol envisagé (optionnel)"
Placeholder: "Ex : W6 2137, TO 7895..."
Help text below field (small, gray): "Indiquez le vol que vous envisagez de prendre. Cela nous aide à organiser les navettes depuis l'aéroport. Vous pourrez le modifier plus tard."
Field name in data: flightNumber (string, optional, default empty string "")

This field should appear on:
- The registration form
- The confirmation screen (only if not empty)
- The admin dashboard list (only if not empty, shown as small gray text)

---

## DESIGN NOTES
- Keep all existing dark green & gold styling
- New content should match existing card/section aesthetic
- Mobile-first
- All text in French
- The visa link button should be clearly visible (gold button style)
