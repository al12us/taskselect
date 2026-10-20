# 🚀 TaskSelect: Task & Project Flow Manager

**TaskSelect** este o aplicație modernă, de nivel moderat, pentru gestionarea proiectelor și a sarcinilor de echipă. Construită pe baza **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4** și **Prisma ORM (SQLite)**, aplicația oferă o experiență fluidă și reactivă fără complexitate enterprise inutilă.

---

## 🌟 Funcționalități Principale

### 1. 📊 Dashboard Unificat cu Indicatori KPI
- Contorizare automată a numărului de sarcini (*Total*, *În Desfășurare*, *Finalizate*).
- Bară dinamică de progres cu procentajul de finalizare a sarcinilor.

### 2. 🗂️ Vizualizare Triplă: Bord Kanban, Tabel Listă & Carduri Proiecte
- **Carduri Interactive de Proiecte**: Grilă modernă de carduri pentru fiecare proiect cu bară de accent colorată, badge de status (`Activ`, `Finalizat`, `Arhivat`), indicator procentual de progres, bare de progres animate, distribuția sarcinilor (*De făcut*, *În lucru*, *Gata*) și efecte dinamice de hover (`hover:-translate-y-1.5`, umbră de adâncime).
- **Bord Kanban interactiv (Drag & Drop)**: Trei etape clare (*De Făcut*, *În Desfășurare*, *Finalizat*), cu tragere directă a cardurilor între coloane, indicator vizual de drop zone și butoane rapide de avansare.
- **Actualizare Instantanee (0ms) prin React 19 `useOptimistic`**: Schimbarea stării sau ștergerea unei sarcini se reflectă instantaneu pe ecran fără timpi de așteptare, în timp ce Server Action-ul sincronizează datele în SQLite în fundal.
- **Tabel / Listă structurată**: Prezentare tabelară cu filtrare instantanee, statusuri comutabile direct din rând și selecție de priorități.

### 3. 🔍 Filtrare Dinamică & Căutare Server-Side (Server Actions)
- **Filtrare directă pe server**: Căutarea după text, selecția de proiect și nivelul de prioritate (`LOW`, `MEDIUM`, `HIGH`, `URGENT`) apelează Server Action-ul `filterTasksAction`, interogând baza de date SQLite în timp real.
- **Sincronizare URL Bidirecțională**: Parametrii de filtrare se actualizează automat în URL (`?project=...&priority=...&search=...`), permițând partajarea link-urilor sau reîmprospătarea paginii păstrând starea.
- **Indicator Vizual în Timp Real**: Badge animat `Filtrare server...` afișat în antet pe durata interogării asincrone.

### 4. 📁 Gestiune Proiecte (Sidebar & Carduri)
- Creare rapidă de proiecte cu titlu, descriere și paletă de culori identificatoare.
- Mini bară de progres integrată în Sidebar sub fiecare proiect.
- Contor de progres per proiect (sarcini finalizate vs. totale).
- Posibilitate de ștergere cu confirmare (ștergerea unui proiect elimină în cascadă sarcinile asociate).

### 5. ⚡ Mutații Rapide prin Server Actions
- Fără boilerplate clasic de API REST: adăugarea, actualizarea și ștergerea folosesc funcții `'use server'` native din Next.js cu revalidare dinamică a cache-ului (`revalidatePath`).

---

## 🛠️ Tehnologii Utilizate

- **Next.js 16.4 (App Router & Turbopack)**
- **React 19 & React DOM 19**
- **Tailwind CSS v4** (stiluri utilitare moderne)
- **Prisma ORM 5.22 + SQLite** (bază de date locală rapidă)
- **Lucide React** (iconografie vectorială)
- **TypeScript 5** (type-safety complet)
- **pnpm** (manager de pachete rapid și eficient)

---

## 💻 Instalare și Rulare

### 1. Navigare în folderul proiectului
```bash
cd c:\PORTABLE\dev\projects\FirstReact_project_react\NextJS_Tutorial\taskselect
```

### 2. Instalare dependențe cu pnpm
```bash
pnpm install
```

### 3. Generare Prisma Client & Sincronizare Bază de Date
```bash
npx prisma db push
```

*(La prima rulare, baza de date SQLite `dev.db` va fi creată automat și populată cu date demonstrative)*.

### 4. Pornire Server de Dezvoltare
```bash
pnpm dev
```
Accesează în browser: [http://localhost:3000](http://localhost:3000)

---

## 📂 Structura Proiectului

```text
taskselect/
├── prisma/
│   ├── dev.db                 # Baza de date SQLite locală
│   └── schema.prisma          # Modelele Project și Task
├── src/
│   ├── app/
│   │   ├── actions.ts         # Server Actions (CRUD Proiecte & Sarcini)
│   │   ├── globals.css        # Import Tailwind CSS v4 & variabile font
│   │   ├── layout.tsx         # Root layout cu fonturile Geist
│   │   └── page.tsx           # Server Component principal
│   ├── components/
│   │   ├── DashboardView.tsx  # Controller-ul client-side pentru starea activă
│   │   ├── KanbanBoard.tsx    # Bordul Kanban pe coloane
│   │   ├── NewProjectModal.tsx# Fereastră modală adăugare proiect
│   │   ├── NewTaskModal.tsx   # Fereastră modală adăugare sarcină
│   │   ├── Sidebar.tsx        # Meniu lateral filtrare & gestiune proiecte
│   │   ├── StatsHeader.tsx    # Header KPI & bară de căutare/filtrare
│   │   └── TaskTableView.tsx  # Prezentare tabelară a sarcinilor
│   └── lib/
│       ├── prisma.ts          # Singleton Prisma Client
│       └── utils.ts           # Utilitarul cn() pentru clase CSS
├── technical_documentation.md # Documentația tehnică detaliată
├── package.json
└── README.md
```
