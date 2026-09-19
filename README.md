# RealmKit for Node.js — Free Tier

A minimal Express + Keycloak starter that gets the fundamentals right:

- **JWT verification against your realm's JWKS endpoint** — keys are fetched (and cached) from Keycloak, so key rotation never breaks you. No copy-pasted public keys.
- **RS256 enforced, issuer validated** — with the `KC_ISSUER` override for the classic Docker/internal-network mismatch (the token's `iss` is the URL the *client* used, not the one your server uses).
- **Optional audience validation** (`KC_RESOURCE`) — off by default because it needs an audience mapper on your realm's client, which Keycloak doesn't ship by default.
- One public route (`/health`), one guarded route (`/me`) that returns the verified identity and realm roles.

## Quick start

You need a running Keycloak with a client your users can log in through.

```bash
# 1. point .env at your Keycloak
cp .env.template .env

# 2.
npm ci
npm run dev        # http://localhost:3000
```

Then call it with a token from your realm:

```bash
curl -H "Authorization: Bearer <access-token>" http://localhost:3000/me
```

## Want the complete, production-grade kit?

**[RealmKit for Node.js](https://realmkit.dev/nodejs/)** — the full Keycloak API kit — adds everything this free tier leaves out:

- **`docker compose up` → verified tokens on first run**: Keycloak 26 with a pre-wired realm auto-imported — clients, roles, demo users, and the audience mapper everyone forgets. Zero Keycloak setup.
- **Issuer + audience validation on by default** — a token from some other client of your realm does not get in.
- The full authorization middleware family: `hasRole`, `hasAnyRole`, `hasAllRoles`, `hasScope`, `hasResourceRole`.
- Public/secure route split, Swagger on every endpoint, fail-fast env validation, Dockerfile + PM2 config.
- Unit + e2e test suites, CI workflow, and docs that explain *why* each piece is the way it is (architecture, realm guide, production checklist, troubleshooting).

Building a frontend too? **[RealmKit for Angular](https://realmkit.dev/angular/)** is the matching SPA kit — every RealmKit ships the same realm, so they compose out of the box. Both kits together are discounted.

One-time purchase, use in unlimited projects. Launch pricing.

Build notes: [Keycloak + Angular + Node in 2026 — the complete setup, and the five places everyone gets it wrong](https://realmkit.dev/blog/keycloak-angular-node-2026/).

## License

MIT — see [LICENSE.md](./LICENSE.md).
