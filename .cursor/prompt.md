# Cursor IDE Prompt Rules for Express + SQLite REST API Projects

These rules should be followed when generating or editing code in Cursor IDE for a simple backend REST API project using Node.js, Express, and SQLite.

---

## 1. General Coding Practices

- Write **clean, readable, and maintainable code**.
- Use **ES6+ syntax** wherever possible (e.g., `const`, `let`, arrow functions, template literals).
- Prefer **async/await** for asynchronous operations; avoid nested callbacks.
- Follow **single responsibility principle**: each function or module should have a clear, focused purpose.
- Avoid unnecessary comments.
  - **Only add comments for complex, non-obvious logic** or tricky SQL queries.
  - Do **not comment obvious things** like `const app = express();`.

---

## 2. Project Structure Best Practices

- Keep a **modular structure**:

```
src/
  controllers/ # Handle request logic
  routes/ # API routes
  models/ # DB models or query wrappers
  db/ # SQLite connection setup
  app.js # Entry point
  data/ # SQLite database file
```

- Keep `.env` for configuration: `PORT`, `DB_PATH`, etc.
- Use `package.json` scripts for start/dev tasks (`start`, `dev` with nodemon).

---

## 3. Express / REST API Guidelines

- Always separate **routes** and **controllers**.
- Use **express.Router()** for modular routing.
- Follow **REST naming conventions** (`GET /users`, `POST /users`, `PUT /users/:id`, `DELETE /users/:id`).
- Handle **errors consistently** with a central error handler.
- Validate inputs before DB operations (basic validation is enough for simple projects).

---

## 4. SQLite Guidelines

- Use a **single DB connection module** (`db.js`) and export it for other modules.
- Prefer **parameterized queries** to avoid SQL injection.
- Wrap callbacks in **promises** to use async/await.
- Keep schema initialization separate from business logic.

---

## 5. Cursor IDE Specific Rules

- **Do not write trivial comments**; explain only non-obvious code.
- Always **return complete, working code snippets** without placeholders when possible.
- Use **clear, descriptive variable and function names**.
- Avoid inline SQL strings when they can be modularized into functions.
- Prefer **readable formatting and indentation** suitable for Cursor IDE’s preview.
- Generate **ES module syntax (`import`/`export`)**
- Include **basic error handling** for DB and API requests.
- Provide **self-contained snippets** that can be copied directly into the project.

---

## 6. Optional Enhancements

- Include comments for:
- Complex SQL queries
- Async error handling patterns
- Middleware usage that is not trivial
- Avoid comments for:
- `app.use(express.json())`
- Standard CRUD endpoints with obvious logic
- Simple variable assignments

---
