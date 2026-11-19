<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/npm/@vulpfest/icons@0.3/svg/vulpfest-logo-night.svg">
    <img src="https://cdn.jsdelivr.net/npm/@vulpfest/icons@0.3/svg/vulpfest-logo-day.svg" alt="Vulpfest" width="150">
  </picture>
</p>

# Scam Check — web

The user-facing site for **Scam Check** (part of [Vulpfest Lab](https://lab.vulpfest.com)): a free tool that
helps anyone avoid scams by checking a suspicious link before they click it.

Paste a link from SMS, WhatsApp, email or social media. **Our server opens it, not your phone**, then
flags common signs of a scam and returns one of three honest levels — **danger / caution / no danger found**
— never "safe", because no tool can guarantee a link is safe. English and Indonesian.

Live at **[lab.vulpfest.com/scamcheck](https://lab.vulpfest.com/scamcheck)**.

## What it looks for

- App downloads (`.apk`, `.exe`) hidden behind "invitation" or "receipt" links
- Look-alike domains impersonating banks, wallets or well-known brands (global and Indonesian)
- Hidden redirects and link shorteners (the final destination is revealed)
- Pages that ask for passwords, PINs or OTPs and send them elsewhere
- Newly registered domains, risky TLDs, IP-address hosts, and other technical red flags

## How it is built

This is a **Next.js + TypeScript + Lucide** frontend. The checking engine is a separate, SSRF-guarded
Python/Flask API: [FebriOsht/linkcheck](https://github.com/FebriOsht/linkcheck). The frontend calls
`POST /api/check` and renders the result; it never opens suspicious links itself.

## Run locally

```bash
npm install
npm run dev            # http://localhost:3000
```

Set `NEXT_PUBLIC_API_URL` to your own backend if you self-host the API.

## Responsible use

Use this only to check links you have received or your own sites.

## Security

Found a security issue? Please report it privately — see [SECURITY.md](SECURITY.md).

## Support this project

If these free tools help you, you can support their development at
[github.com/FebriOsht#support](https://github.com/FebriOsht#support) (Saweria, PayPal, or crypto).
Only send on the network stated there.

## License

MIT © 2026 Febri Osht (Vulpfest). See [LICENSE](LICENSE).