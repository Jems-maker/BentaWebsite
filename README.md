# Benta POS Website

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `.env.local` and replace the placeholders with your reCAPTCHA and SMTP credentials. Only `VITE_RECAPTCHA_SITE_KEY` is public and may be used by the browser; never expose the reCAPTCHA secret or SMTP values with a `VITE_` prefix. Never commit `.env`, `.env.local`, or any other local environment file.

## Google reCAPTCHA v2 setup

Create a Google reCAPTCHA **v2 → “I’m not a robot” Checkbox** key. Do not use a v3, Invisible, or Enterprise key with this form. The site key and secret key must come from the same v2 checkbox registration.

Register these hostnames in Google reCAPTCHA:

- `localhost`
- `127.0.0.1`
- Your actual production hostname

Enter hostnames only. Do not include `https://`, URL paths, or arbitrary domains. Set `VITE_RECAPTCHA_SITE_KEY` in the Vite environment and `RECAPTCHA_SECRET_KEY` only in the server/Vercel environment. The browser receives only the site key; the API verifies the submitted token with the secret key before sending email.

The `/api/inquiries` handler is compatible with Vercel-style serverless deployments. It validates and sanitizes input, verifies reCAPTCHA with Google, limits repeated requests in-process, and sends inquiries through SMTP using Nodemailer.

For SMTP, use `SMTP_SECURE=true` with port `465`. For port `587`, use `SMTP_SECURE=false` so the connection can upgrade with STARTTLS. `SMTP_PASS` may be an app password or provider-generated SMTP password.

## Vercel environment variables

In your Vercel project, open **Settings → Environment Variables** and add every variable from `.env.example` to the environments you use: Development, Preview, and Production. Redeploy after adding or changing Production variables. Vercel keeps these environments separate, so a value configured only for Preview will not automatically be available in Production.

If the previous `.env.example` reCAPTCHA secret has ever been used as a real credential, rotate it in Google reCAPTCHA and update the replacement in Vercel and `.env.local`.

```bash
npm run build
```
