const express = require("express");
const router = express.Router();
const db = require("../db/database");
const { isValidNPI } = require("../utils/npiValidator");

const ALL_FIELDS = [
  "npi", "entity_type", "organization_name", "first_name", "last_name",
  "middle_name", "credential", "address_line_1", "address_line_2", "city",
  "state", "postal_code", "phone", "taxonomy_code", "taxonomy_description",
  "license_number", "license_state", "official_first_name", "official_last_name",
  "status", "enumeration_date"
];

// GET /api/providers  — search with filters + pagination
router.get("/", (req, res) => {
  const {
    npi, name, organization_name, city, state, postal_code,
    taxonomy_description, entity_type, status,
    official_first_name, official_last_name,
    limit = 20, offset = 0
  } = req.query;

  const clauses = [];
  const params = {};

  if (npi) { clauses.push("npi = @npi"); params.npi = npi; }
  if (name) {
    clauses.push(`(
      last_name LIKE @name OR
      first_name LIKE @name OR
      organization_name LIKE @name
    )`);
    params.name = `%${name}%`;
  }
  if (organization_name) {
    clauses.push("organization_name LIKE @organization_name");
    params.organization_name = `%${organization_name}%`;
  }
  if (city) { clauses.push("city LIKE @city"); params.city = `%${city}%`; }
  if (state) { clauses.push("state = @state"); params.state = state.toUpperCase(); }
  if (postal_code) { clauses.push("postal_code LIKE @postal_code"); params.postal_code = `${postal_code}%`; }
  if (taxonomy_description) {
    clauses.push("taxonomy_description LIKE @taxonomy_description");
    params.taxonomy_description = `%${taxonomy_description}%`;
  }
  if (entity_type) { clauses.push("entity_type = @entity_type"); params.entity_type = entity_type; }
  if (status) { clauses.push("status = @status"); params.status = status; }
  if (official_first_name) {
    clauses.push("official_first_name LIKE @official_first_name");
    params.official_first_name = `%${official_first_name}%`;
  }
  if (official_last_name) {
    clauses.push("official_last_name LIKE @official_last_name");
    params.official_last_name = `%${official_last_name}%`;
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

  const cappedLimit = Math.min(parseInt(limit, 10) || 20, 200);
  const cappedOffset = parseInt(offset, 10) || 0;

  const total = db.prepare(`SELECT COUNT(*) AS count FROM providers ${where}`).get(params).count;

  const rows = db.prepare(`
    SELECT * FROM providers
    ${where}
    ORDER BY last_name, organization_name
    LIMIT @limit OFFSET @offset
  `).all({ ...params, limit: cappedLimit, offset: cappedOffset });

  res.json({
    result_count: rows.length,
    total_count: total,
    limit: cappedLimit,
    offset: cappedOffset,
    results: rows
  });
});

// GET /api/providers/validate/:npi — check digit validation only (no DB lookup)
router.get("/validate/:npi", (req, res) => {
  res.json({ npi: req.params.npi, valid: isValidNPI(req.params.npi) });
});

// GET /api/providers/:npi — single record
router.get("/:npi", (req, res) => {
  const row = db.prepare("SELECT * FROM providers WHERE npi = ?").get(req.params.npi);
  if (!row) return res.status(404).json({ error: "Provider not found" });
  res.json(row);
});

// POST /api/providers — create a new provider record
router.post("/", (req, res) => {
  const body = req.body;

  if (!body.npi || !isValidNPI(body.npi)) {
    return res.status(400).json({ error: "A valid 10-digit NPI is required" });
  }
  if (!body.entity_type || !["Individual", "Organization"].includes(body.entity_type)) {
    return res.status(400).json({ error: "entity_type must be 'Individual' or 'Organization'" });
  }

  const existing = db.prepare("SELECT npi FROM providers WHERE npi = ?").get(body.npi);
  if (existing) return res.status(409).json({ error: "NPI already exists" });

  const cols = ALL_FIELDS.filter((f) => body[f] !== undefined);
  const placeholders = cols.map((c) => `@${c}`).join(", ");
  db.prepare(`INSERT INTO providers (${cols.join(", ")}) VALUES (${placeholders})`).run(body);

  const created = db.prepare("SELECT * FROM providers WHERE npi = ?").get(body.npi);
  res.status(201).json(created);
});

// PUT /api/providers/:npi — update an existing record
router.put("/:npi", (req, res) => {
  const existing = db.prepare("SELECT npi FROM providers WHERE npi = ?").get(req.params.npi);
  if (!existing) return res.status(404).json({ error: "Provider not found" });

  const body = req.body;
  const cols = ALL_FIELDS.filter((f) => f !== "npi" && body[f] !== undefined);
  if (cols.length === 0) return res.status(400).json({ error: "No updatable fields provided" });

  const setClause = cols.map((c) => `${c} = @${c}`).join(", ");
  db.prepare(`UPDATE providers SET ${setClause}, last_updated = CURRENT_TIMESTAMP WHERE npi = @npi`)
    .run({ ...body, npi: req.params.npi });

  const updated = db.prepare("SELECT * FROM providers WHERE npi = ?").get(req.params.npi);
  res.json(updated);
});

// DELETE /api/providers/:npi
router.delete("/:npi", (req, res) => {
  const result = db.prepare("DELETE FROM providers WHERE npi = ?").run(req.params.npi);
  if (result.changes === 0) return res.status(404).json({ error: "Provider not found" });
  res.status(204).send();
});

module.exports = router;