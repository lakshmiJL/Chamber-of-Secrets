# Remix & Deployment Guide for Tom Riddle's Diary

This guide explains how to fork/remix this project and deploy it to **Netlify**, **Vercel**, or **Google Cloud Run**.

---

## 1. Why Handwriting & Chat Failed on Netlify (Fixed!)

Static web hosts like Netlify serve pre-built static HTML/JS (`dist/`) and **do not run Express backend servers (`server.ts`)**. 
Previously, the quill handwriting recognition and chat attempted to call `/api/diary/*` server endpoints, which returned Netlify's 404/redirect pages, resulting in `[Handwritten entry - ink smear]`.

### The Solution:
We implemented a **hybrid client/server service (`diaryService.ts`)**:
- **On Cloud Run / Node servers**: Calls Express `/api/*` endpoints.
- **On Netlify / Static Hosts**:
  1. If you configure `VITE_GEMINI_API_KEY` in Netlify, it directly calls Gemini API client-side for live handwriting recognition and AI responses.
  2. If no API key is provided or when offline, it executes an **intelligent client-side Hogwarts simulation engine** with keyword matching and lore generation!

---

## 2. Steps to Remix (Fork & Run Locally)

1. **Clone or Fork the Repository**:
   ```bash
   git clone <your-repo-url>
   cd <your-repo-folder>
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional)**:
   Create a `.env` file at the root:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the Local Dev Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 3. Steps to Deploy on Netlify

1. **Push your code to GitHub / GitLab**.
2. **Import Site to Netlify**:
   - Log in to [Netlify](https://app.netlify.com).
   - Click **Add new site** -> **Import an existing project**.
   - Choose your Git repository.
3. **Build Settings**:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. **Environment Variables (For Live AI Recognition)**:
   - Go to **Site Configuration** -> **Environment variables**.
   - Add a new variable: `VITE_GEMINI_API_KEY` = `<Your Gemini API Key>`.
5. **Click Deploy**. Netlify will build and deploy your site!

---

## 4. Firebase Authentication Setup (If using Google Sign-In)

If you use Firebase Google Auth in production:
1. Open the [Firebase Console](https://console.firebase.google.com).
2. Go to **Authentication** -> **Settings** -> **Authorized domains**.
3. Add your Netlify domain (e.g. `your-app-name.netlify.app`).
