const express = require("express");
const router = express.Router();
const db = require("../db/database");

// GET /api/meta/states — distinct states present in the data
router.get("/states", (req, res) => {
  const rows = db.prepare(`
    SELECT DISTINCT state FROM providers
    WHERE state IS NOT NULL AND state != ''
    ORDER BY state
  `).all();
  res.json(rows.map((r) => r.state));
});

// GET /api/meta/taxonomies — distinct taxonomy descriptions present in the data
router.get("/taxonomies", (req, res) => {
  const rows = db.prepare(`
    SELECT DISTINCT taxonomy_description FROM providers
    WHERE taxonomy_description IS NOT NULL AND taxonomy_description != ''
    ORDER BY taxonomy_description
  `).all();
  res.json(rows.map((r) => r.taxonomy_description));
});

// GET /api/meta/stats — quick counts for a dashboard/homepage
router.get("/stats", (req, res) => {
  const total = db.prepare("SELECT COUNT(*) AS c FROM providers").get().c;
  const individuals = db.prepare("SELECT COUNT(*) AS c FROM providers WHERE entity_type = 'Individual'").get().c;
  const organizations = db.prepare("SELECT COUNT(*) AS c FROM providers WHERE entity_type = 'Organization'").get().c;
  const active = db.prepare("SELECT COUNT(*) AS c FROM providers WHERE status = 'Active'").get().c;
  res.json({ total, individuals, organizations, active, deactivated: total - active });
});

module.exports = router;
