# 📝 Note personnelle — TaskFlow

## 1. Informations générales

**Nom du projet :** TaskFlow
**Type :** Task Management Web Application
**Contexte :** Projet de stage
**Objectif :** Créer une application permettant aux utilisateurs de gérer leurs tâches facilement, avec suivi, statistiques et assistance via chatbot.

---

## 2. Technologies utilisées

### Frontend

* React
* TypeScript
* Material UI (MUI)
* Vite

### Backend

* Node.js
* Express.js
* PostgreSQL
* JWT Authentication

### Tests

* Jest
* React Testing Library
* Supertest

### Outils

* Git
* GitHub
* Vercel
* Cursor

---

## 3. Fonctionnalités principales

### Authentication

* Register
* Login
* JWT authentication
* Protection des routes

### Task Management

* Ajouter une tâche
* Modifier une tâche
* Supprimer une tâche
* Marquer une tâche comme completed / active
* Due date
* Priority

  * High
  * Medium
  * Low
* Category

  * University
  * Work
  * Personal
  * Shopping
  * Other

### Recherche et organisation

* Search tasks
* Filter par statut
* Filter par catégorie
* Sort par date
* Sort par priorité

### Dashboard

* Total tasks
* Active tasks
* Completed tasks
* Overdue tasks
* Completion Rate
* Tasks by Priority
* Tasks by Category

### Analytics

* Tasks by Priority chart
* Tasks by Category chart
* Completion Status chart
* Priority Distribution chart

### Organisation

* Task Reminders
* Calendar
* Overdue tasks
* Due Today

### Chatbot

Le projet contient un chatbot intégré appelé :

**TaskFlow Assistant**

Le chatbot peut répondre à des demandes concernant les tâches, par exemple :

* Show my tasks
* Show completed tasks
* Show active tasks
* Show overdue tasks
* Show high priority tasks
* Give me my statistics

Le chatbot actuel est **rule-based** et ne dépend pas d'une API OpenAI.

---

## 4. Architecture générale

### Frontend

```text
src/
├── components/
│   ├── TaskForm
│   ├── TaskItem
│   ├── TaskList
│   ├── DashboardStats
│   ├── DashboardCharts
│   ├── TaskCalendar
│   ├── TaskReminders
│   └── Chatbot
│
├── services/
│   └── authService
│
├── viewmodels/
│   └── useTasks
│
└── App.tsx
```

### Backend

```text
server/
├── controllers/
├── services/
├── routes/
├── middleware/
├── db
├── app.js
└── swagger
```

Le backend utilise une architecture avec :

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
Database
```

---

## 5. API principales

### Authentication

```text
POST /auth/register
POST /auth/login
```

### Tasks

```text
GET    /tasks
POST   /tasks
PUT    /tasks/:id
DELETE /tasks/:id
```

### Chatbot

```text
POST /chatbot
```

### Documentation

```text
/api-docs
```

---

## 6. Tests

Dernier résultat :

```text
Test Suites: 18 passed, 18 total
Tests:       121 passed, 121 total
```

Tous les tests passent actuellement.

Commande :

```bash
npm test -- --runInBand
```

---

## 7. Production Build

Commande :

```bash
npm run build
```

Dernier résultat :

```text
✓ built successfully
```

Il existe actuellement un warning concernant la taille du bundle JavaScript (> 500 kB).

Ce warning n'empêche pas le build et n'est pas une erreur bloquante.

---

## 8. Git

Repository :

```text
Todo-app
```

Branch principale :

```text
main
```

Commandes importantes :

```bash
git status
git add .
git commit -m "message"
git push
```

Avant de terminer une modification :

```bash
git status
```

L'état actuel doit être :

```text
nothing to commit, working tree clean
```

---

## 9. Vercel

Le projet est déployé sur Vercel.

Le fichier important pour le routing est :

```text
vercel.json
```

Les routes backend principales doivent être redirigées vers :

```text
/api/index.js
```

Important :

```text
/auth
/tasks
/chatbot
/api-docs
```

sont configurés dans `vercel.json`.

---

## 10. Problèmes déjà résolus

### Problème 1 — JWT en production

Le site affichait :

```text
Invalid or expired token
```

Cause : problème lié à la configuration JWT en production.

Solution : vérifier que `JWT_SECRET` est correctement configuré dans les variables d'environnement Vercel.

Ne jamais partager la valeur de `JWT_SECRET`.

---

### Problème 2 — Chatbot 405

Le chatbot retournait :

```text
405 Method Not Allowed
```

Le frontend utilisait :

```text
POST /chatbot
```

Mais `vercel.json` ne contenait pas la route `/chatbot`.

Solution :

```json
{
  "src": "/chatbot(.*)",
  "dest": "/api/index.js"
}
```

Après le déploiement, le chatbot fonctionne.

---

### Problème 3 — Analytics affichait 0

Les statistiques générales fonctionnaient, mais :

```text
Tasks by Priority
Tasks by Category
```

affichaient `0`.

Cause : `DashboardStats` recevait les statistiques générales mais ne recevait pas le tableau `tasks`.

Solution :

```tsx
<DashboardStats
  totalTasks={totalTasks}
  activeTasks={activeTasks}
  completedTasks={completedTasks}
  overdueTasks={overdueTasks}
  tasks={tasks}
/>
```

Après cette correction, les statistiques affichent les bonnes valeurs.

---

## 11. Règles personnelles pour continuer le projet

Avant de modifier le projet :

1. Comprendre le problème.
2. Modifier uniquement le fichier nécessaire.
3. Ne pas supprimer une fonctionnalité existante sans raison.
4. Lancer les tests.
5. Faire le build.
6. Vérifier l'application localement.
7. Faire `git status`.
8. Commit.
9. Push.
10. Vérifier Vercel.

Ordre conseillé :

```text
Code
 ↓
Tests
 ↓
Build
 ↓
Local verification
 ↓
Git commit
 ↓
Git push
 ↓
Vercel
```

---

## 12. Commandes utiles

### Lancer le frontend

```bash
npm run dev
```

### Lancer les tests

```bash
npm test -- --runInBand
```

### Build

```bash
npm run build
```

### Vérifier Git

```bash
git status
```

### Push

```bash
git add .
git commit -m "message"
git push
```

---

## 13. Important

* Ne jamais mettre les secrets dans GitHub.
* Ne jamais partager `JWT_SECRET`.
* Ne jamais partager les passwords de database.
* Ne pas remettre OpenAI / `ai.js` dans le projet sans raison.
* Le chatbot actuel fonctionne sans OpenAI.
* Toujours tester avant de faire un push.
* La version actuelle est stable.

---

## 14. État actuel du projet

### ✅ Stable

* Authentication
* Tasks CRUD
* Priorities
* Categories
* Due dates
* Search
* Filters
* Sorting
* Dashboard
* Analytics
* Reminders
* Calendar
* Chatbot
* PostgreSQL
* JWT
* Swagger
* Tests
* Production deployment

### Tests actuels

```text
18 suites
121 tests
121 passed
```

### Git

```text
main
working tree clean
```

### Build

```text
Successful
```

---

## 15. Objectif final du projet

TaskFlow doit être présenté comme une **application complète de gestion des tâches**, et non comme une simple Todo List.

L'idée est de montrer :

```text
Frontend
   +
Backend
   +
Database
   +
Authentication
   +
Testing
   +
Analytics
   +
Calendar
   +
Chatbot
   +
Deployment
```

Ce projet peut servir de support pour expliquer les compétences acquises pendant le stage.
