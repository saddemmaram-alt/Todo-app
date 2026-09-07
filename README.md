TaskFlow 🚀

A full-stack task management and productivity application built with React, TypeScript, Node.js, and Express.

TaskFlow started as a simple Todo List designed to practice automated testing with Jest, React Testing Library, and Supertest. The project was progressively extended into a richer task management platform with task organization, filtering, sorting, productivity statistics, responsive design, Swagger API documentation, backend layering, and continuous integration.

📌 Project Overview

TaskFlow allows users to create, organize, update, complete, and delete tasks through a modern responsive web interface.

The application currently supports:

Create tasks
Display tasks
Edit tasks
Complete / reactivate tasks
Delete tasks
Delete confirmation
Task validation
Priorities
Due dates
Categories
Search
Status filters
Category filters
Sorting
Productivity statistics
Completion rate
Loading state
Error state
Retry mechanism
Empty states
Success notifications
Dark mode
Responsive design
REST API
Swagger / OpenAPI documentation
Automated frontend and backend testing
GitHub Actions CI
🛠️ Tech Stack
Frontend
React 19
TypeScript
Vite
Material UI (MUI)
Backend
Node.js
Express 5
CORS
dotenv
Testing
Jest
React Testing Library
Jest DOM
Supertest
ts-jest
API Documentation
OpenAPI 3.0
Swagger UI Express
Swagger JSDoc
CI
GitHub Actions
🏗️ Architecture

TaskFlow follows a separated frontend/backend architecture.

Frontend Architecture
React Application
       │
       ▼
Components
       │
       ▼
useTasks ViewModel
       │
       ▼
REST API
Backend Architecture
HTTP Request
      │
      ▼
   Routes
      │
      ▼
Validation Middleware
      │
      ▼
 Controllers
      │
      ▼
  Services
      │
      ▼
In-Memory Storage
      │
      ▼
 HTTP Response
Complete Architecture
flowchart TD
    A[React + TypeScript] --> B[UI Components]
    B --> C[useTasks ViewModel]
    C --> D[REST API]

    D --> E[Express]
    E --> F[Routes]
    F --> G[Validation Middleware]
    G --> H[Controllers]
    H --> I[Services]
    I --> J[In-Memory Storage]

    H --> K[Error Handler]

    L[Jest + React Testing Library] --> B
    L --> C

    M[Jest + Supertest] --> D

    N[Swagger / OpenAPI] --> D

    O[GitHub Actions] --> L
    O --> M
    O --> P[Vite Build]
📂 Project Structure
todo-app/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── DashboardStats.tsx
│   │   ├── DashboardStats.test.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskForm.test.tsx
│   │   ├── TaskItem.tsx
│   │   ├── TaskItem.test.tsx
│   │   ├── TaskList.tsx
│   │   └── TaskList.test.tsx
│   │
│   ├── utils/
│   │   ├── validateTask.ts
│   │   └── validateTask.test.ts
│   │
│   ├── viewmodels/
│   │   ├── useTasks.ts
│   │   └── useTasks.test.ts
│   │
│   ├── App.tsx
│   ├── App.test.tsx
│   └── App.css
│
├── server/
│   ├── controllers/
│   │   └── tasksController.js
│   │
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── validateTask.js
│   │
│   ├── routes/
│   │   ├── tasks.js
│   │   └── tasks.test.js
│   │
│   ├── services/
│   │   ├── taskService.js
│   │   └── swagger.test.js
│   │
│   ├── swagger.js
│   ├── app.js
│   ├── server.cjs
│   └── setupTests.js
│
├── package.json
├── vite.config.ts
├── babel.config.cjs
└── README.md
✨ Features
Task Management

Users can:

Create a task
Edit an existing task
Mark a task as completed
Reactivate a completed task
Delete a task
Confirm deletion before removing a task

Each task can contain:

Task text
Priority
Category
Due date
Completion status
🔴 Priorities

Tasks support three priority levels:

🔴 High
🟠 Medium
🟢 Low

Tasks can be sorted from high to low or low to high priority.

🏷️ Categories

Supported categories:

🎓 University
💼 Work
👤 Personal
🛒 Shopping
📌 Other

Tasks can be filtered by category.

📅 Due Dates

Tasks can have a due date.

The application also identifies overdue active tasks and displays them in the dashboard.

🔎 Search

Tasks can be searched by text.

Example:

Search: React

Search can be combined with:

Status filters
Category filters
Sorting
🔍 Filters
Status
All Tasks
Active
Completed
Overdue
Category
All
University
Work
Personal
Shopping
Other

Filters can be combined with search.

↕️ Sorting

Available sorting options:

Default order
Priority: High → Low
Priority: Low → High
Due date
Alphabetical A → Z
📊 Productivity Dashboard

TaskFlow includes a dashboard with dynamically calculated statistics.

Main Statistics
Total
Active
Completed
Overdue
Completion Rate

The application calculates:

Completed Tasks / Total Tasks × 100
Tasks by Priority

The dashboard displays:

High
Medium
Low
Tasks by Category

The dashboard displays:

University
Work
Personal
Shopping
Other
🎨 User Experience
Loading State

While tasks are being retrieved:

Loading tasks...
Error State

If the API cannot be reached:

Unable to load tasks.
Please try again.

The user can retry without refreshing the page.

Empty State

When no tasks exist:

📝 No tasks yet.
Create your first task!

When search or filters return no result:

🔍 No matching tasks.
Try changing your search or filters.
Notifications

Successful operations display notifications such as:

Task added successfully
Task updated successfully
Task completed
Task deleted successfully
Delete Confirmation

Deleting a task requires explicit confirmation.

Dark Mode

The interface supports light and dark themes.

Responsive Design

The UI adapts to:

Desktop
Tablet
Mobile
🔌 REST API

The backend exposes a REST API for task management.

GET /tasks

Retrieve all tasks.

Response
[
  {
    "id": 1,
    "text": "Learn React",
    "completed": false,
    "dueDate": "2026-09-15",
    "priority": "medium",
    "category": "University"
  }
]
POST /tasks

Create a new task.

Request
{
  "text": "Learn React",
  "dueDate": "2026-09-15",
  "priority": "medium",
  "category": "University"
}
Responses
201 Created
400 Bad Request
PUT /tasks/:id

Update an existing task.

Request
{
  "text": "Learn TypeScript",
  "dueDate": "2026-09-20",
  "priority": "high",
  "category": "University"
}
Responses
200 OK
400 Bad Request
404 Not Found
PATCH /tasks/:id

Toggle the completion state of a task.

Responses
200 OK
404 Not Found
DELETE /tasks/:id

Delete a task.

Responses
204 No Content
404 Not Found
📖 Swagger / OpenAPI

Interactive API documentation is available through Swagger UI.

Start the backend:

node server/server.cjs

Then open:

http://localhost:3000/api-docs/

The documented endpoints are:

GET    /tasks
POST   /tasks
PUT    /tasks/{id}
PATCH  /tasks/{id}
DELETE /tasks/{id}

The API documentation follows the OpenAPI 3.0 specification.

🧪 Testing

Testing is a central part of TaskFlow.

Frontend Tests

The frontend test suite covers:

Components
Form interactions
Validation
Task operations
Search
Filtering
Sorting
Dashboard statistics
Loading state
Empty state
Error state
Delete confirmation
Success notifications
Backend Tests

The backend test suite covers:

GET /tasks
POST /tasks
PUT /tasks/:id
PATCH /tasks/:id
DELETE /tasks/:id
Validation
Error responses
Swagger documentation
📈 Test Coverage

Current automated test results:

Test Suites: 9 passed
Tests:       72 passed

Current coverage:

Statements: 88.42%
Branches:   69.73%
Functions:  78.16%
Lines:      88.35%

Generate the coverage report with:

npm run test:coverage

Jest generates the coverage report in the coverage/ directory.

🔄 Continuous Integration

TaskFlow uses GitHub Actions to automatically validate changes.

The CI pipeline performs:

Push / Pull Request
        ↓
Checkout repository
        ↓
Setup Node.js 24
        ↓
Install dependencies
        ↓
Run Jest tests
        ↓
Build application

The workflow is defined in:

.github/workflows/ci.yml

Current CI status:

✅ Tests
✅ Production build
🏗️ Backend Engineering

The backend is separated into multiple layers.

Routes

Responsible for defining API endpoints.

server/routes/
Middleware

Responsible for validation and centralized error handling.

server/middleware/
Controllers

Responsible for handling HTTP requests and responses.

server/controllers/
Services

Responsible for business logic and task operations.

server/services/

This separation improves:

Maintainability
Readability
Testability
Separation of concerns
💾 Data Storage

The current version uses an in-memory array on the backend.

This was intentionally chosen during the training phase to keep the focus on:

React development
REST APIs
Express architecture
Automated testing
Software design

Because the data is stored in memory, tasks are reset when the backend server restarts.

🚀 Getting Started
1. Install dependencies
npm install
2. Start the frontend
npm run dev

The frontend is available at:

http://localhost:5173
3. Start the backend

Open another terminal:

node server/server.cjs

The backend is available at:

http://localhost:3000
4. Open Swagger
http://localhost:3000/api-docs/
📜 Available Scripts
Development
npm run dev
Production build
npm run build
Run tests
npm test
Run tests with coverage
npm run test:coverage
Lint
npm run lint
Preview production build
npm run preview
🧠 Testing Strategy

The project follows a layered testing approach:

Utility Tests
      ↓
Component Tests
      ↓
ViewModel / Logic Tests
      ↓
API Integration Tests
      ↓
Swagger Tests
      ↓
CI Validation

The goal is to continuously verify the application while adding new features.

🔮 Future Improvements

Possible future versions may introduce:

User authentication
JWT authorization
Database persistence
User accounts
Calendar view
Custom categories
Task reminders
Advanced productivity analytics
End-to-end testing
Deployment
Additional CI/CD automation
🎓 Project Purpose

TaskFlow was initially created as an internship-training project to learn automated testing before applying the same principles to production-oriented modules.

The project provides practical experience in:

React
TypeScript
REST API development
Express
Component testing
API testing
Validation
Error handling
Software architecture
Continuous integration
👩‍💻 Development Approach

The application was developed progressively.

For each feature, the development process followed:

Requirement
     ↓
Implementation
     ↓
Testing
     ↓
Refactoring
     ↓
Build Verification

This approach allowed the project to grow from a basic Todo List into a more complete task management application while continuously preserving existing functionality.

✅ Current Project Status
Frontend                         ✅
Backend                          ✅
CRUD                             ✅
Validation                       ✅
Priorities                       ✅
Due Dates                        ✅
Categories                       ✅
Search                           ✅
Filtering                        ✅
Sorting                          ✅
Dashboard                        ✅
Loading State                    ✅
Error State                      ✅
Retry                            ✅
Empty State                      ✅
Confirmation Dialog              ✅
Toast Notifications              ✅
Dark Mode                        ✅
Responsive Design                ✅
Backend Layering                 ✅
Swagger / OpenAPI                ✅
Automated Tests                  ✅
GitHub Actions CI                ✅
Production Build                 ✅

TaskFlow is currently a functional, tested, documented full-stack task management project.