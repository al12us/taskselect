# ⚙️ Documentație Tehnică: TaskSelect Flow Manager

Această documentație prezintă arhitectura software, modelul de date, deciziile de proiectare și specificațiile de implementare pentru aplicația **TaskSelect**, dezvoltată în cadrul ecosistemului **Next.js 16 (App Router)** cu **React 19**, **Tailwind CSS v4** și **Prisma ORM**.

---

## 1. Arhitectura de Ansamblu (High-Level Architecture)

Aplicația implementează modelul arhitectural **Server Components + Server Actions** promovat de Next.js App Router:
- **Server Component Root (`src/app/page.tsx`)**: Efectuează citirea inițială a datelor (`getProjects`, `getTasks`) asincron pe server fără expunerea de rute API suplimentare.
- **Client Component Controller (`DashboardView.tsx`)**: Gestionează starea efemeră din browser (proiectul selectat, termenul de căutare, vizualizarea Kanban vs. Listă, ferestrele modale).
- **Server Actions (`src/app/actions.ts`)**: Funcții asincrone marcate cu `'use server'` care execută mutațiile în baza de date și revalidează cache-ul Next.js prin `revalidatePath('/')`.

```mermaid
graph TD
    subgraph Browser_Client [Browser (Client-Side)]
        DashboardView[DashboardView.tsx: Controller de Stare]
        Sidebar[Sidebar.tsx: Gestiune Proiecte]
        StatsHeader[StatsHeader.tsx: KPI & Filtre]
        KanbanBoard[KanbanBoard.tsx: Bord 3 Coloane]
        TaskTable[TaskTableView.tsx: Vizualizare Tabelară]
        ProjectCards[ProjectCardsView.tsx: Grilă Carduri Interactive]
        NewTaskModal[NewTaskModal.tsx]
        NewProjModal[NewProjectModal.tsx]

        DashboardView --> Sidebar
        DashboardView --> StatsHeader
        DashboardView --> KanbanBoard
        DashboardView --> TaskTable
        DashboardView --> ProjectCards
        DashboardView --> NewTaskModal
        DashboardView --> NewProjModal
    end

    subgraph NextJS_Server [Next.js 16 Server]
        Page[src/app/page.tsx: Server Component]
        Actions[src/app/actions.ts: Server Actions]
        PrismaClient[src/lib/prisma.ts: Prisma Client Singleton]

        Page -->|Fetch inițial| PrismaClient
        Actions -->|Create / Update / Delete| PrismaClient
        Actions -->|revalidatePath| Page
    end

    subgraph Database_Layer [Database Layer]
        SQLite[(SQLite Database: dev.db)]
        PrismaClient --> SQLite
    end

    Page -->|Propagă projects & tasks| DashboardView
    NewTaskModal -.->|FormData| Actions
    NewProjModal -.->|FormData| Actions
    KanbanBoard -.->|updateTaskStatus| Actions
    Sidebar -.->|deleteProject| Actions
```

---

## 2. Modelul de Date (Prisma Schema)

Fișier: [prisma/schema.prisma](file:///c:/PORTABLE/dev/projects/FirstReact_project_react/NextJS_Tutorial/taskselect/prisma/schema.prisma)

### Diagrama Relațională
```mermaid
erDiagram
    PROJECT ||--o{ TASK : "conține (onDelete: Cascade)"
    PROJECT {
        string id PK "UUID"
        string title "Nume Proiect"
        string description "Descriere Opțională"
        string color "Culoare Identificare Hex"
        string status "ACTIVE, COMPLETED, ARCHIVED"
        datetime createdAt
        datetime updatedAt
    }
    TASK {
        string id PK "UUID"
        string title "Titlu Sarcină"
        string description "Descriere Sarcină"
        string status "TODO, IN_PROGRESS, DONE"
        string priority "LOW, MEDIUM, HIGH, URGENT"
        datetime dueDate "Termen Limită Opțional"
        string projectId FK "Referință la Project.id"
        datetime createdAt
        datetime updatedAt
    }
```

### Reguli de Integritate:
- **Ștergere în cascadă (`onDelete: Cascade`)**: La eliminarea unui proiect, toate sarcinile asociate acestuia sunt șterse automat din baza de date, prevenind înregistrările orfane.
- **Valori implicite**:
  - `Project.color` are valoarea implicită `#3b82f6` (Albastru Tailwind).
  - `Task.status` începe cu starea `TODO`.
  - `Task.priority` este setată implicit pe `MEDIUM`.

---

## 3. Ciclul de Viață al Mutațiilor prin Server Actions

Spre deosebire de o arhitectură clasică bazată pe `fetch('/api/...')` și `useEffect`, mutațiile din TaskSelect utilizează Server Actions cuplate cu hook-ul **React 19 `useOptimistic`** pentru o reacție instantanee (0ms latență vizuală):

```mermaid
sequenceDiagram
    autonumber
    actor Utilizator
    participant UI as Componentă Client (KanbanBoard)
    participant OptState as React 19 useOptimistic
    participant Action as Server Action (actions.ts)
    participant Prisma as Prisma ORM
    participant DB as SQLite (dev.db)

    Utilizator->>UI: Drag & Drop sau Click "Înainte"
    UI->>OptState: setOptimisticTasks(UPDATE_STATUS)
    OptState-->>UI: Re-randare INSTANTANEE (0ms) în noua coloană!
    UI->>Action: updateTaskStatus(taskId, "IN_PROGRESS")
    Action->>Prisma: prisma.task.update(where, data)
    Prisma->>DB: UPDATE Task SET status = ...
    DB-->>Prisma: Înregistrare persistată în SQLite
    Action-->>UI: Revalidare fundal confirmată
```

### Server Actions Implementate:
1. **`getProjects()`**: Interoghează lista proiectelor împreună cu numărul de task-uri finalizate și totale.
2. **`createProject(formData)`**: Extrage valorile `title`, `description`, `color` din formular și creează înregistrarea.
3. **`deleteProject(id)`**: Șterge proiectul și revalidează pagina.
4. **`getTasks(projectId?, priority?, search?)`**: Interogare flexibilă cu filtrare direct pe server în Prisma / SQLite.
5. **`filterTasksAction(projectId?, priority?, search?)`**: Server Action apelabil dinamic din interfață pentru filtrare asincronă cu indicator de încărcare în timp real și sincronizare URL.
6. **`createTask(formData)`**: Validează câmpurile obligatorii și persistă sarcina în baza de date.
7. **`updateTaskStatus(id, status)`**: Actualizează starea sarcinii (`TODO` -> `IN_PROGRESS` -> `DONE`).
8. **`deleteTask(id)`**: Elimină sarcina selectată.
9. **`seedInitialDataIfEmpty()`**: Populează automat baza de date la prima rulare dacă nu există proiecte.

### Integrarea Server-Side Data Fetching cu Revalidare Dinamică:
- **Inițializare SSR prin `searchParams`**: La accesarea paginii rădăcină [src/app/page.tsx](file:///c:/PORTABLE/dev/projects/FirstReact_project_react/NextJS_Tutorial/taskselect/src/app/page.tsx), parametrii de interogare din URL (`?project=...&priority=...&search=...`) sunt citiți asincron pe server, iar interogarea Prisma rulează direct cu clauzele `WHERE` corespunzătoare.
- **Sincronizare URL Bidirecțională**: Modificarea filtrelor din interfață apelează Server Action-ul `filterTasksAction` în interiorul unui apel `useTransition`, actualizând parametrii din bara de adresă a browserului (`window.history.replaceState`) fără reîncărcarea paginii. Astfel, orice stare de filtrare poate fi partajată prin link sau reîmprospătată cu `F5` păstrând datele intacte.

---

## 4. Sistemul de Design și Stilizare (Tailwind CSS v4)

Aplicația folosește **Tailwind CSS v4** cu o tematică Dark Mode modernă:
- **Fundal General**: `bg-slate-950` (negru-albăstrui profund).
- **Containere și Panouri**: `bg-slate-900` cu borduri subtile `border-slate-800`.
- **Carduri Interactive**: `bg-slate-800/80` cu efecte de tranziție la hover.
- **Accente de Culoare per Prioritate**:
  - `URGENT`: Fundal `bg-rose-500/15`, text `text-rose-400`, bordură `border-rose-500/30`.
  - `HIGH`: Fundal `bg-amber-500/15`, text `text-amber-400`, bordură `border-amber-500/30`.
  - `MEDIUM`: Fundal `bg-blue-500/15`, text `text-blue-400`, bordură `border-blue-500/30`.
  - `LOW`: Fundal `bg-slate-700/50`, text `text-slate-400`, bordură `border-slate-600/40`.

---

## 5. Ghid de Rulare și Verificare Locală

Pentru a porni aplicația pe mașina locală:

```bash
# 1. Navigare în director
cd c:\PORTABLE\dev\projects\FirstReact_project_react\NextJS_Tutorial\taskselect

# 2. Instalare pnpm
pnpm install

# 3. Inițializare Prisma
npx prisma db push

# 4. Rulare dezvoltare
pnpm dev
```
Serverul local va rula pe portul standard: `http://localhost:3000`.
