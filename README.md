# Auth Vault

A premium, fully-featured authentication boilerplate built with **React, Vite, Firebase Auth, and Tailwind CSS v4**.

**Live Demo:** [https://auth-vault-d8132.web.app/](https://auth-vault-d8132.web.app/)

## Features
- **Email & Password Authentication:** Full signup and login flows.
- **Google OAuth:** One-click "Sign in with Google".
- **Password Reset:** Secure password recovery flow using Firebase `sendPasswordResetEmail`.
- **Protected Routes:** `react-router-dom` v6 integration with custom `PrivateRoute` and `PublicRoute` wrappers.
- **Firestore Integration:** Automatically creates a user profile document in Firestore on registration.
- **Premium UI:** Dark mode glassmorphism design system built from scratch with Tailwind CSS v4.

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/YashG1195/auth-vault.git
   cd auth-vault
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   Copy `.env.example` to `.env` and add your Firebase Project credentials.
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

This project is configured for Firebase Hosting with React Router SPA rewrite rules included in `firebase.json`.

```bash
npm run build
firebase deploy --only hosting
```
