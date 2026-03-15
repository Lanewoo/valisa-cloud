# Valisa Cloud

Marketing website for **Valisa Cloud** — your gateway to multi-cloud excellence across Europe, Türkiye and Chinese go-global enterprises.

- **Live site**: [https://valisa.cloud](https://valisa.cloud)
- **Repository**: [github.com/Lanewoo/valisa-cloud](https://github.com/Lanewoo/valisa-cloud)

---

## What’s inside

- **Single-page site**: Hero, partners, services, why us, regions, solutions, contact, footer.
- **Multi-language**: English, Türkçe, 中文, Español, Français, Deutsch, Magyar (via `lang/*.json` and `data-i18n` in HTML).
- **Static stack**: HTML, CSS, JavaScript — no build step. Suitable for any static host or Nginx.

---

## Project structure

```
valisa-cloud/
├── index.html          # Main page
├── css/
│   └── styles.css
├── js/
│   └── main.js         # Nav, language switcher, animations
├── lang/               # i18n JSON (en, tr, zh, es, fr, de, hu)
├── assets/
│   └── images/         # Logo, etc.
├── README.md
└── DEPLOY.md           # 部署说明 (Nginx, HTTPS, updates)
```

---

## Run locally

Open `index.html` in a browser, or use a simple static server:

```bash
# Python
python -m http.server 8000

# Node (npx)
npx serve .
```

Then visit `http://localhost:8000`.

---

## Deployment

See **[DEPLOY.md](./DEPLOY.md)** for:

- First-time server setup (Nginx, site config, Let’s Encrypt)
- How to update the site after `git pull`
- Troubleshooting (500, permissions, Certbot, DNS)

---

## License

Proprietary — Valisa Cloud.
