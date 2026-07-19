# NPI Registry Prototype

A local, self-contained clone of the CMS NPI Registry: an Express + SQLite
API and a React search UI. No external database server or API key needed —
SQLite lives in a single file on disk.

## What's included

- **`backend/`** — Express API + SQLite database (`better-sqlite3`)
  - Full CRUD for provider records
  - Search by NPI, name/org, city, state, ZIP, taxonomy, entity type, status
  - Pagination
  - NPI checksum validation (the real Luhn-based algorithm CMS uses)
  - `npm run import -- <file.csv|.json>` to load your own data
- **`frontend/`** — React (Vite) search UI
  - Filter form, paginated results, a detail card you can edit or delete from
  - Talks to the API through a dev proxy, so no CORS headaches

## 1. Install

```bash
cd backend
npm install

cd ../frontend
npm install
```

## 2. Load your data

Two ready-to-edit templates are in `backend/data/`:
- `sample_providers.csv`
- `sample_providers.json`

Match their columns/fields with your own data (see **Data schema** below),
then import:

```bash
cd backend
npm run import -- data/sample_providers.csv
# or
npm run import -- data/sample_providers.json
# or point it at your own file anywhere on disk:
npm run import -- /path/to/your_providers.csv
```

Re-running import is safe — records are upserted by NPI (existing NPIs get
updated, new ones get inserted). Rows with an invalid NPI or missing
`entity_type` are skipped and reported, not silently dropped.

## 3. Run it

In one terminal:
```bash
cd backend
npm start          # API on http://localhost:4000
```

In another terminal:
```bash
cd frontend
npm run dev         # UI on http://localhost:5173
```

Open http://localhost:5173.

## Data schema

| Field                   | Required          | Notes                                      |
|--------------------------|--------------------|---------------------------------------------|
| `npi`                    | yes                | 10 digits, must pass the Luhn check digit   |
| `entity_type`             | yes                | `Individual` or `Organization`               |
| `organization_name`       | if Organization    |                                               |
| `first_name` / `last_name` / `middle_name` | if Individual | |
| `credential`               | no                 | e.g. `MD`, `NP`, `DO`                       |
| `address_line_1` / `address_line_2` | no       |                                               |
| `city` / `state` / `postal_code` | no          |                                               |
| `phone`                   | no                 |                                               |
| `taxonomy_code` / `taxonomy_description` | no   | specialty                                    |
| `license_number` / `license_state` | no        |                                               |
| `status`                  | no                 | `Active` (default) or `Deactivated`          |
| `enumeration_date`         | no                 | any date string, e.g. `2015-03-12`           |

If you don't have real data, the official NPPES public data file (millions
of real, publicly-registered providers) can be downloaded from CMS at
https://download.cms.gov/nppes/NPI_Files.html — you'd need to map its
columns to the ones above before importing.

## API reference

```
GET  /api/providers                 Search (query params below)
GET  /api/providers/:npi            Single record
GET  /api/providers/validate/:npi   { npi, valid: true|false }
POST /api/providers                 Create
PUT  /api/providers/:npi            Update
DELETE /api/providers/:npi          Delete

GET  /api/meta/states               Distinct states in your data
GET  /api/meta/taxonomies           Distinct taxonomy descriptions
GET  /api/meta/stats                Total/individual/organization/active counts
```

Search query params (all optional, combine freely):
`npi`, `name` (matches first/last/org name), `organization_name`, `city`,
`state`, `postal_code`, `taxonomy_description`, `entity_type`, `status`,
`limit` (default 20, max 200), `offset`.

## Notes

- This is a prototype for local development — there's no authentication, so
  don't expose it to the public internet as-is.
- The database is a single file at `backend/db/npi.db`, created
  automatically on first run. Delete it to start fresh.
