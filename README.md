# Omra 2026 — Jamat Sidi Abdallah

Site d'inscription pour le voyage Omra 2026.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Vercel KV** (stockage des inscriptions)

## Développement local

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer les variables d'environnement

Copiez `.env.example` en `.env.local` et renseignez vos clés Vercel KV :

```bash
cp .env.example .env.local
```

Remplissez `.env.local` :

```
KV_URL=rediss://...
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
```

Ces clés sont disponibles dans le dashboard Vercel sous **Storage → KV**.

### 3. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Déploiement sur Vercel

### 1. Créer un projet Vercel

```bash
npx vercel
```

Ou connectez le repo GitHub depuis le dashboard Vercel.

### 2. Créer une base Vercel KV

Dans le dashboard Vercel :
- **Storage** → **Create Database** → **KV**
- Connectez la base à votre projet
- Les variables d'environnement (`KV_URL`, `KV_REST_API_URL`, etc.) sont ajoutées automatiquement

### 3. Déployer

```bash
npx vercel --prod
```

## Structure du projet

```
app/
  globals.css          — styles globaux Tailwind
  layout.tsx           — layout racine (lang="fr", metadata)
  page.tsx             — page principale (inscription multi-étapes)
  admin/
    page.tsx           — tableau de bord organisateur (mot de passe : omra2026)
  api/
    registrations/
      route.ts         — GET / POST inscriptions (Vercel KV)
    count/
      route.ts         — GET compteur familles/personnes
```

## Accès organisateur

URL : `/admin`  
Mot de passe : `omra2026`

Le tableau de bord affiche :
- Statistiques (familles, personnes, personnes attendues pondérées)
- Répartition par ville, vol, certitude
- Liste complète des inscriptions (tri par date décroissante)

## Notes

- Les données sont stockées dans **Vercel KV** sous la clé `omra2026_registrations` (tableau JSON)
- Le mot de passe admin est côté client uniquement — pour un usage interne, c'est suffisant
- Toutes les informations (dates, prix, hôtels) sont indicatives et à confirmer
