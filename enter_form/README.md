<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Gunpo Nepali Shelter Move-in Application

This is the spa-like application for shelter move-in requests with a Vite/React front end and a pair of serverless APIs for sending email notifications and verifying Facebook IDs.

## Run locally

1. Install dependencies:
   `npm install`
2. Copy the template and adjust sensitive data:
   `cp .env.example .env.local` (use `copy .env.example .env.local` on Windows PowerShell)
   or manually set the `SMTP_*` values you need for nodemailer (see below).
3. Start the local development server (express + Vite middleware):
   `npm run dev`
4. Visit `http://localhost:3000` to preview the UI and use the API endpoints on the same origin.

## Required environment variables

| Variable | Description |
| --- | --- |
| `SMTP_USER` | Username for the SMTP provider (naver.com assumed if no domain provided). |
| `SMTP_PASS` | Password or app-specific key used by the SMTP account. |
| `SMTP_SERVER` | SMTP host (defaults to `smtp.naver.com`). |
| `SMTP_PORT` | SMTP port (defaults to `465`). |
| `SMTP_TO_EMAIL` | Recipient address for the application notification. |

## Deploying to Vercel

1. Connect your Vercel project to this repository (or import the repo from GitHub).
2. Vercel automatically runs `npm run build` and serves the `dist` directory thanks to `@vercel/static-build` (configured in `vercel.json`).
3. Serverless endpoints are defined under `api/` and build with `@vercel/node`. The `vercel.json` file also wires up `/api/*` before falling back to the SPA.
4. Define the SMTP environment variables listed above in the Vercel dashboard so `api/send-email` can authenticate and deliver mail.
5. After deployment, the SPA and APIs are available under the same domain; `/api/send-email` accepts POST requests, and `/api/check-facebook/{id}` returns a quick existence guess.

## Vercel API routes

- `POST /api/send-email`: expects `subject` and `content` in the JSON body, then forwards the data through nodemailer.
- `GET /api/check-facebook/:id`: probes `https://www.facebook.com/:id` and reports whether the profile appears reachable (or if Facebook redirects it).

Once your app is deployed, share the Vercel URL with applicants and configure any additional secrets or analytics tracking via the Vercel dashboard.
