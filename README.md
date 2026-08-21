# Benta POS Website

## Local development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and set the reCAPTCHA public key to render the checkbox. The serverless inquiry endpoint also requires the private values in the example file. Never expose secret values with a `VITE_` prefix.

The `/api/inquiries` handler is compatible with Vercel-style serverless deployments. It validates and sanitizes input, verifies reCAPTCHA with Google, limits repeated requests in-process, and sends inquiries through Resend.

```bash
npm run build
```
