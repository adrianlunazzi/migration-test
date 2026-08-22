@AGENTS.md

# Proyecto

Next.js (App Router) + Prisma + Neon Postgres + Tailwind + shadcn/ui + Cloudinary. Arquitectura Vertical Slice: cada feature autocontenida en `src/features/<feature>/{actions,queries,schema,components,types,permissions}.ts`. Sin `services/`, `controllers/`, `repositories/` globales. Código usado en 2+ slices → `src/shared/`.

Package manager: **pnpm** (nunca npm/yarn) para instalar/agregar dependencias.

Reglas y detalle completos en skill `nextjs-vsa-project` (`.claude/skills/nextjs-vsa-project/`). Para ahorrar tokens, no cargar el skill completo salvo necesidad real — ir directo al archivo puntual:
- Nueva feature / estructura de carpetas → `SKILL.md`
- Seguridad (XSS, injection, IDOR, CSRF, SSRF, uploads, path traversal, etc.) → `references/security-checklist.md`
- Auth / sesiones / roles → `references/auth.md`
- UI / tokens / tipografía / componentes → `references/design-system.md`
