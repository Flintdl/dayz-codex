# Modelo de Ameaças & Posture de Segurança

DayZ Codex é um **site estático** sem backend, sem autenticação, sem coleta
de dados. Esta é uma defesa por *redução de superfície*: a maioria das
classes de vulnerabilidade simplesmente não se aplica.

## Resumo de classes de risco

| Classe OWASP A01–A10 | Aplicabilidade | Mitigação |
|---|---|---|
| A01 Broken Access Control | ❌ N/A | Sem auth, sem objetos privados |
| A02 Cryptographic Failures | ❌ N/A | Sem dados sensíveis, TLS via Vercel |
| A03 Injection (SQL/Cmd/XSS) | ⚠️ XSS possível | CSP estrita, sanitização DOM |
| A04 Insecure Design | ✅ | Static-first, defense-in-depth |
| A05 Security Misconfig | ✅ | Headers ajustados, sem debug em prod |
| A06 Vulnerable Components | ✅ | npm audit em CI |
| A07 Auth Failures | ❌ N/A | Sem auth |
| A08 Software/Data Integrity | ✅ | SRI onde aplicável, lock files |
| A09 Logging Failures | ⚠️ | Vercel logs cobrem básico |
| A10 SSRF | ❌ N/A | Sem requests server-side a URLs do user |

## Headers HTTP (produção)

Aplicados via `next.config.ts → async headers()` em todas as rotas:

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline';
                         style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
                         font-src 'self' https://fonts.gstatic.com;
                         img-src 'self' data: blob:;
                         connect-src 'self';
                         frame-ancestors 'none';
                         base-uri 'self';
                         form-action 'self';
                         object-src 'none';
                         upgrade-insecure-requests
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
```

### Por que `'unsafe-inline'` em `script-src` e `style-src`?

Next.js 16 + Tailwind 4 geram scripts e estilos inline para hidratação React
e camadas CSS. Em sites *estáticos* com cache CDN (Vercel), nonces dinâmicos
por requisição não são aplicáveis (invalidam cache). Como **não há
input de usuário renderizado como HTML** em qualquer lugar da app, o vetor
clássico de XSS não se aplica — todo conteúdo dinâmico vai por `textContent`
ou JSX (que escapa automaticamente).

Validar em [Mozilla Observatory](https://observatory.mozilla.org/) após deploy.

## Vetores específicos auditados

### Stored XSS via localStorage (markers customizados)

Markers de usuário são salvos em `localStorage`. Mitigações em
`src/lib/markers.ts`:

- Schema Zod estrito na **leitura** e **escrita**:
  - `label` max 80 chars, regex bloqueia caracteres de controle (`\x00-\x1f`, `\x7f`)
  - `notes` max 500 chars, mesma regex
  - `id` regex `/^[a-z0-9-]{1,40}$/`
  - Coordenadas numéricas com range bounded
- Limite total de 2000 markers (anti-DoS render)
- Limite de 200KB no payload total no `localStorage` (rejeita corrompidos)
- Renderização via `document.createElement` + `textContent` —
  nunca `innerHTML` ou `dangerouslySetInnerHTML`

### Import de JSON externo

Endpoint client-side em `/mapa-interativo` aceita upload de JSON com markers.
Validação:
- Tamanho máximo 200KB
- Schema Zod completo (`MarkersFileSchema`)
- Confirmação UI antes de aplicar

### SVG inline

`globals.css` usa SVG inline em `data:` URLs. CSP `img-src 'self' data:`
permite apenas para `<img>` e `background-image`, não para `<script>` ou
`<iframe>`. Nenhum SVG inline contém JavaScript.

### Dependências (supply chain)

- `package-lock.json` commitado
- `npm run audit:ci` falha em CVEs HIGH/CRITICAL em dependências de
  produção
- Versões pinadas com `^` apenas em deps maduras
- Próximas adições: Dependabot/Renovate para alertas automáticos

#### CVEs conhecidos não-exploráveis

```
postcss <8.5.10 — XSS via Unescaped </style> (transitivo via Next.js)
```

Não-exploitable aqui porque PostCSS só processa CSS estático em build-time;
não recebe entrada de usuário runtime. Será resolvido upstream em Next 17.

### Privacidade

- Sem cookies (mesmo de sessão)
- Sem analytics, tracking ou telemetria
- `NEXT_TELEMETRY_DISABLED=1` em build/start
- Próximas adições: bloqueador de robots em `robots.ts` (já presente)

## Stack de deps validada

| Dep | Versão | Motivo |
|---|---|---|
| `next` | ^16.2.4 | Framework |
| `react` / `react-dom` | 19.2.4 | UI |
| `leaflet` | ^1.9.4 | Mapa interativo (auditado, MIT) |
| `zod` | ^4.4.3 | Validação schema |
| `tailwindcss` | ^4 | CSS utility |

Nenhuma dependência runtime adicional além das acima.

## Threats fora de escopo

- **DDoS**: cobertura via Vercel Edge / Cloudflare se proxiado
- **Bot scraping**: `robots.txt` bloqueia indexação; o conteúdo é público de
  qualquer forma
- **Account takeover**: não aplicável (sem accounts)

## Reportar vulnerabilidade

Se encontrar bug de segurança, abra issue privada / contato direto.
Não há bug bounty estruturado — projeto comunitário.

## Pré-deploy checklist

Antes de cada release:

- [ ] `npm run audit:ci` passa
- [ ] `npm run build` sem warnings
- [ ] Headers validados em [Mozilla Observatory](https://observatory.mozilla.org/)
- [ ] CSP validada em [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [ ] TLS A+ em [SSL Labs](https://www.ssllabs.com/ssltest/) (se domínio próprio)
