# Benta POS Website

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `.env.local` and replace the placeholders with your reCAPTCHA and SMTP credentials. Only `VITE_RECAPTCHA_SITE_KEY` is public and may be used by the browser; never expose the reCAPTCHA secret or SMTP values with a `VITE_` prefix. Never commit `.env.local`.

The `/api/inquiries` handler is compatible with Vercel-style serverless deployments. It validates and sanitizes input, verifies reCAPTCHA with Google, limits repeated requests in-process, and sends inquiries through SMTP using Nodemailer.

For SMTP, use `SMTP_SECURE=true` with port `465`. For port `587`, use `SMTP_SECURE=false` so the connection can upgrade with STARTTLS. `SMTP_PASS` may be an app password or provider-generated SMTP password.

## Vercel environment variables

In your Vercel project, open **Settings → Environment Variables** and add every variable from `.env.example` to the environments you use: Development, Preview, and Production. Redeploy after adding or changing Production variables. Vercel keeps these environments separate, so a value configured only for Preview will not automatically be available in Production.

If the previous `.env.example` reCAPTCHA secret has ever been used as a real credential, rotate it in Google reCAPTCHA and update the replacement in Vercel and `.env.local`.

```bash
npm run build
```
