# TechOrbit — Developer Portal

A professional React single-page application built for the BCA 3rd Semester Modern Frontend Frameworks mid-term lab project.

## Stack
- React 18 + Vite
- React Router v6
- Axios
- Modern CSS
- JSONPlaceholder REST API

## API integration
All network calls use the configured Axios client in `src/services/api.js`.
- GET `/users` — developer directory
- GET `/users/:id` — developer profile
- GET `/posts?userId=:id` — technical publications
- POST `/posts` — publish a new article

## Features
- Live API-powered developer count and directory
- Debounced name/company search
- Dynamic profile + publications
- Simulated authentication with localStorage
- Protected `/add-post` route
- Controlled form with required validation
- 201 Created success handling
- Loading skeletons, retryable errors and 404 page
- Responsive professional UI

## Run
```bash
npm install
npm run dev
```

## Production check
```bash
npm run build
npm run preview
```

## GitHub
```bash
git init
git add .
git commit -m "feat: build TechOrbit developer portal"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

The login is intentionally simulated because the supplied lab specification does not require a real authentication backend.
