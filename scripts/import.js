/**
 * Usage:
 *   node scripts/import.js path/to/providers.csv
 *   node scripts/import.js path/to/providers.json
 *
 * CSV must have a header row. JSON must be an array of objects.
 * Accepted columns/fields (all optional except npi + entity_type):
 *   npi, entity_type, organization_name, first_name, last_name, middle_name,
 *   credential, address_line_1, address_line_2, city, state, postal_code,
 *   phone, taxonomy_code, taxonomy_description, license_number, license_state,
 *   official_first_name, official_last_name, status, enumeration_date
 *
 * Existing NPIs are updated (upsert); new NPIs are inserted.
 */
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const db = require("../db/database");
const { isValidNPI } = require("../utils/npiValidator");

const ALL_FIELDS = [
  "npi", "entity_type", "organization_name", "first_name", "last_name",
  "middle_name", "credential", "address_line_1", "address_line_2", "city",
  "state", "postal_code", "phone", "taxonomy_code", "taxonomy_description",
  "license_number", "license_state", "official_first_name", "official_last_name",
  "status", "enumeration_date"
];

function loadRecords(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".json") {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) throw new Error("JSON file must contain an array of provider objects");
    return data;
  }

  if (ext === ".csv") {
    return parse(raw, { columns: true, skip_empty_lines: true, trim: true });
  }

  throw new Error("File must be .csv or .json");
}

function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: node scripts/import.js <path/to/file.csv|.json>");
    process.exit(1);
  }
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const records = loadRecords(filePath);
  console.log(`Read ${records.length} record(s) from ${filePath}`);

  const upsert = db.prepare(`
    INSERT INTO providers (${ALL_FIELDS.join(", ")})
    VALUES (${ALL_FIELDS.map((f) => `@${f}`).join(", ")})
    ON CONFLICT(npi) DO UPDATE SET
      ${ALL_FIELDS.filter((f) => f !== "npi").map((f) => `${f} = excluded.${f}`).join(", ")},
      last_updated = CURRENT_TIMESTAMP
  `);

  let inserted = 0, skipped = 0;
  const errors = [];

  const runAll = db.transaction((rows) => {
    for (const [i, row] of rows.entries()) {
      const npi = String(row.npi || "").trim();
      const entity_type = row.entity_type || row.entityType || "";

      if (!isValidNPI(npi)) {
        errors.push(`Row ${i + 2}: invalid or missing NPI "${npi}" — skipped`);
        skipped++;
        continue;
      }
      if (!["Individual", "Organization"].includes(entity_type)) {
        errors.push(`Row ${i + 2}: entity_type must be "Individual" or "Organization" — skipped`);
        skipped++;
        continue;
      }

      const clean = {};
      for (const f of ALL_FIELDS) clean[f] = row[f] !== undefined && row[f] !== "" ? row[f] : null;
      clean.npi = npi;
      clean.entity_type = entity_type;
      clean.status = clean.status || "Active";

      upsert.run(clean);
      inserted++;
    }
  });

  runAll(records);

  console.log(`Imported/updated: ${inserted}`);
  console.log(`Skipped: ${skipped}`);
  if (errors.length) {
    console.log("\nIssues:");
    errors.forEach((e) => console.log("  - " + e));
  }
}

main();