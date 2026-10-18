// All the trip-guide wording lives here in one place so it's easy to review
// and edit without touching the page layout.

export const SAFETY_CHECKLIST: string[] = [
  'Passeport valide et sur vous (jamais en bagage en soute)',
  "Visa / permis Omra prêt sur votre téléphone",
  "Détails du vol et adresse de l'hôtel enregistrés hors ligne",
  "Téléphone chargé, numéro de l'organisateur enregistré",
  "Restez avec votre groupe d'arrivée",
  'Médicaments en bagage à main',
]

export const MEAL_INFO = {
  first: '9 h 30 – 11 h',
  second: 'Après la prière de Asr',
  lateRule:
    "Si vous êtes en retard pour un repas, rien n'est gardé. Vous vous débrouillez par vous-même.",
  note: 'Les repas seront soit livrés, soit pris en extérieur. Vous serez tenus informés via le canal de discussion WhatsApp.',
}

// Reproduced as-is from arrivees.pdf — do not infer or complete missing rows.
export const ARRIVALS: { date: string; time: string; name: string; count: number }[] = [
  { date: '17 octobre', time: '15h00', name: 'Jafar', count: 1 },
  { date: '17 octobre', time: '17h00', name: 'Samir Taleb', count: 1 },
  { date: '18 octobre', time: '06h40', name: 'Famille Taleb Nasser', count: 6 },
  { date: '18 octobre', time: '15h10', name: 'Famille BELHADJ', count: 4 },
  { date: '18 octobre', time: '15h10', name: 'Khedhiri + Adnane', count: 1 },
  { date: '18 octobre', time: '15h10', name: 'Tidiane', count: 1 },
  { date: '18 octobre', time: '15h10', name: 'Famille Bobaker Selhami', count: 3 },
  { date: '18 octobre', time: '17h15', name: 'Belle-sœur Nasser Taleb', count: 1 },
  { date: '18 octobre', time: '21h15', name: 'Djamel Maarouf', count: 1 },
  { date: '19 octobre', time: '01h55', name: 'LAAZOUZI Yassine + Samir A + Sauguy', count: 3 },
  { date: '19 octobre', time: '04h55', name: 'Famille NASRALLAH', count: 4 },
  { date: '19 octobre', time: '18h10', name: 'Nordine Syg', count: 3 },
  { date: '19 octobre', time: '19h30', name: 'LAAZOUZI Adil', count: 1 },
  { date: '20 octobre', time: '01h10', name: 'Urtis', count: 6 },
  { date: '20 octobre', time: '01h10', name: 'Ouzana', count: 2 },
]
export const ARRIVALS_TOTAL = 38
export const ARRIVALS_NOTE =
  "Informations manquantes : date d'arrivée non communiquée pour la famille Mohamed Taleb et Madame Bouri. Aucune information disponible concernant les Mezidi."

export const WIFI_PASSWORD = '123456789'

export const ZIYARA_PLAN: { date: string; time: string; place: string; city: string }[] = [
  { date: '19 octobre', time: '17 h, avant Maghreb', place: 'Jabal Nour', city: 'La Mecque' },
  { date: '20 octobre', time: '6 h 30, après Fajr', place: '2e Omra', city: 'La Mecque' },
  { date: '20 octobre', time: '17 h, avant Maghreb', place: 'Jabal Thawr', city: 'La Mecque' },
  { date: '21 octobre', time: '6 h 30, après Fajr', place: 'Trajet direction Médine via Badr', city: '—' },
  { date: '23 octobre', time: '17 h, avant Maghreb', place: 'Masjid Khandaq', city: 'Médine' },
  { date: '25 octobre', time: '18 h, après Maghreb', place: 'Bir Ghars et Masjid Quba', city: 'Médine' },
  { date: '27 octobre', time: '6 h 30, après Fajr', place: 'Al Aliyah — Palm Farm', city: 'Médine' },
]

export const ZIYARA_NOTE =
  "Soirées à Médine : en l'absence de visite programmée, une visite à Uhud et des majliss seront organisés."

export const MATAF_PHOTOS: { src: string; caption: string; mapsUrl: string }[] = [
  {
    src: '/mataf/porte-79.jpg',
    caption: 'Porte 79 — entrée principale du Mataf',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Masjid+al-Haram+Gate+79+Makkah',
  },
  {
    src: '/mataf/porte-79-nuit.jpg',
    caption: 'Porte 79, de nuit — repère visuel',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Masjid+al-Haram+Gate+79+Makkah',
  },
  {
    src: '/mataf/pharmacie.jpg',
    caption: 'Si vous êtes perdu : rendez-vous à la pharmacie en face de la porte 79',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Masjid+al-Haram+Makkah+pharmacy',
  },
]

// Room groups, transcribed from the organizer's photos — not official room
// numbers, just who shares accommodation with whom. Some entries are
// relation labels from the source sheet (e.g. "N T épouse") rather than
// full names, so a few family members won't show up under their own name.
export const ROOM_GROUPS: { city: string; groups: string[][] }[] = [
  {
    city: 'La Mecque',
    groups: [
      ['Sidi Abu al Azz', 'Oum al Azz', 'Abdulkarim', 'A U épouse', 'A U fils'],
      ['Wafa Bouri', 'Amina Taleb', 'Rahma Taleb', 'B S épouse', 'B S fille'],
      ['Nacer Taleb', 'N T Soeur', 'N T Ali', 'N T Fille 1'],
      ['Taleb Maman', 'N T Frère', 'N T Belle soeur', 'N T Neveu'],
      ['Samir Taleb', 'Abdelhak Ouazna', 'Boubekar Selhami', 'Yassine Laazouzi', 'Adil Laazouzi'],
      ['Tidjane Gostymen', 'Mahmadou Traore', 'M T Fils', 'Samir Ahmada', 'Sauguy Sow'],
      ['Mohamed Taleb', 'Amr Taleb', 'Adil Taleb', 'Nordine Syg', 'Mehdi Syg'],
      ['Nabil Urtis', 'N U Épouse', 'Suleyman Urtis', 'Anas Urtis'],
      ['Nadia Belhadj', 'M T Fille', 'J J épouse', 'A O fille', 'Nordine Syg Ép'],
      ['Djamel Marouf', 'Jamel Japonais', 'MIB', 'Hilane Khedri', 'Adnane Rabah'],
      ['Sidi', 'Oumoussama', 'Oussama Penot', 'Jafar Penot', 'Abdelkader Penot'],
      ['Abobaker Nasr-Allah', 'A N Fils', 'A N épouse', 'A N fille'],
      ['Soraya Mezidi', 'Ghufran Mezidi', 'Halima Mezidi', 'Othman Mezidi'],
    ],
  },
  {
    city: 'Médine',
    groups: [
      ['Oum al Azz', 'Abdulkarim', 'Anas Urtis', 'A U épouse', 'A U fils', 'N U Épouse', 'Nabil Urtis', 'Suleyman Urtis', 'Sidi Abu al Azz'],
      ['Nacer Taleb', 'N T Soeur', 'N T Ali', 'N T Fille 1', 'Taleb Maman', 'N T Frère', 'N T Belle soeur', 'N T Neveu'],
      ['Samir Taleb', 'Abdelhak Ouazna', 'Boubekar Selhami', 'Yassine Laazouzi', 'Mahmadou Traore', 'M T Fils', 'Samir Ahmada', 'Sauguy Sow', 'Tidjane Gostymen'],
      ['Adnane Rabah', 'Mohamed Taleb', 'Amr Taleb', 'Adil Taleb', 'Abobaker Nasr-Allah', 'A N Fils'],
      ['A O fille', 'Wafa Bouri', 'Amina Taleb', 'Rahma Taleb', 'B S épouse', 'B S fille'],
      ['A N épouse', 'A N fille', 'Nadia Belhadj', 'M T Fille', 'J J épouse', 'Nordine Syg Ép', 'Soraya Mezidi', 'Halima Mezidi', 'Ghufran Mezidi'],
      ['Djamel Marouf', 'Mustafa Azzaoui', 'Jamel Japonais', 'MIB', 'Nordine Syg', 'Mehdi Syg', 'Hilane Khedri', 'Adil Laazouzi', 'Mounir Amara'],
      ['Sidi', 'Oumoussama', 'Oussama Penot', 'Myriam Penot', 'Ali Penot', 'Ashim Penot', 'Jafar Penot', 'Abdelkader Penot', 'Othman Mezidi'],
    ],
  },
]

export const HOTELS: { city: string; hotelName: string; hotelAddress: string; mapsUrl: string }[] = [
  {
    city: 'La Mecque',
    hotelName: 'Abraj Tayseer Hôtel',
    hotelAddress: '2978 Bir Tuwa Street, Al Taysir, Makkah 24231',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Abraj+Tayseer+Hotel+Makkah',
  },
  {
    city: 'Médine',
    hotelName: 'Diyar as Saliheen',
    hotelAddress: "8460 Sayyid Al Shuhada' Street, Masjid Al Dar, Medina 42313",
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Diyar+as+Saliheen+Medina',
  },
]

// Phone numbers left blank on purpose — fill these in yourself below
// (kept out of this file by Claude Code's own PII write-protection when
// combined with names). See /docs/fiche-omra-2026.pdf for the numbers.
export const EMERGENCY_CONTACTS: { name: string; phone: string }[] = [
  { name: 'Jafar', phone: '' },
  { name: 'Mohamed', phone: '' },
  { name: 'Anas', phone: '' },
  { name: 'Samir A', phone: '' },
]

export const PRACTICAL_NOTE =
  "Taux légal indicatif : 1 € = 4,26 riyals saoudiens. Inscrivez-vous sur Nusuk pour la Rawda Charifa et le Zamzam à l'aéroport."
