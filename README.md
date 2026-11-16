# Calibra — web

Sitio de la marca **Calibra** (elevadores, desmontadoras y balanceadoras). Next.js 16 + Tailwind 4.

- **Datos**: tablas `cb_category` / `cb_product` / `cb_singleton` del proyecto Supabase web (el mismo de launchweb), solo lectura con la anon key + RLS (solo lo activo). SQL en `hub-nami/prisma/web/alter_calibra.sql`.
- **Edición**: en el hub, Admin → Web → **Web Calibra** (`/calibra`): fichas, fotos, categorías, WhatsApp y textos del hero.
- **Fotos**: bucket público `web-images`, bajo `calibra/`. PNG/WebP **sin fondo**: el sitio las ilumina sobre fondo oscuro.
- **Carga inicial**: `hub-nami/scripts/calibra/load-calibra-web.mts`.
- Las páginas se regeneran cada 5 minutos (ISR).

```bash
npm install
npm run dev    # http://localhost:3002
```

Variables: ver `.env.example`.
