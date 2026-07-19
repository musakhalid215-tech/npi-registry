const path = require("path");
const Database = require("better-sqlite3");

const DB_PATH = path.join(__dirname, "npi.db");
const db = new Database(DB_PATH);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS providers (
    npi                   TEXT PRIMARY KEY,
    entity_type           TEXT NOT NULL CHECK (entity_type IN ('Individual', 'Organization')),
    organization_name     TEXT,
    first_name            TEXT,
    last_name             TEXT,
    middle_name            TEXT,
    credential            TEXT,
    address_line_1        TEXT,
    address_line_2        TEXT,
    city                  TEXT,
    state                 TEXT,
    postal_code            TEXT,
    phone                 TEXT,
    taxonomy_code         TEXT,
    taxonomy_description  TEXT,
    license_number        TEXT,
    license_state         TEXT,
    official_first_name   TEXT,
    official_last_name    TEXT,
    status                TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Deactivated')),
    enumeration_date      TEXT,
    last_updated          TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_last_name ON providers(last_name);
  CREATE INDEX IF NOT EXISTS idx_org_name ON providers(organization_name);
  CREATE INDEX IF NOT EXISTS idx_city ON providers(city);
  CREATE INDEX IF NOT EXISTS idx_state ON providers(state);
  CREATE INDEX IF NOT EXISTS idx_postal ON providers(postal_code);
  CREATE INDEX IF NOT EXISTS idx_taxonomy ON providers(taxonomy_description);
  CREATE INDEX IF NOT EXISTS idx_official_last ON providers(official_last_name);
`);

module.exports = db;