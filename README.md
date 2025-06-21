# Holiday Calendar App

A Java Spring Boot backend and React frontend app for viewing country holidays highlighted on a calendar.

---

## Prerequisites

- Java 17 or newer
- Node.js 18+ and npm

---

## Setup & Run (Local Development)

### 1. Clone the repository

```sh
git clone <your-repo-url>
cd holiday-app
```

### 2. Start the Backend

In one terminal window/tab:

```sh
cd backend
./gradlew build
./gradlew bootRun
```

- The backend will start on [http://localhost:8080](http://localhost:8080).

---

### 3. Start the Frontend

Open a new terminal window/tab:

```sh
cd frontend
npm install
npm start
```

- The frontend will start on [http://localhost:3000](http://localhost:3000).
- It will automatically proxy API requests to the backend.

---

### 4. Usage

- Visit [http://localhost:3000](http://localhost:3000) in your browser.
- Select a country from the dropdown.
- Holidays for the selected country will be highlighted in orange on the calendar.

---

## Packaging (Production)

- To build backend JAR:  
  `cd backend && ./gradlew build`
- To build frontend static files:  
  `cd frontend && npm run build`
- You can serve the frontend build with any static server, or copy it inside Spring Boot’s `src/main/resources/static/` for a single deployable JAR.

---

## Notes

- Backend uses the public API [Nager.Date](https://date.nager.at/swagger/index.html).
- For production, consider CORS configuration and environment variables.
