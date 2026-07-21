import React from "react";

const REAL_PARAMS = [
  { name: "number", desc: "The NPI assigned to the provider." },
  { name: "enumeration_type", desc: "The Provider Type. Limits results to only Individual Providers (NPI-1) or Organizational Providers (NPI-2)." },
  { name: "taxonomy_description", desc: "Scalar character vector with an exact description or exact specialty, or a wildcard * after 2 characters, from the NUCC Healthcare Provider Taxonomy." },
  { name: "first_name", desc: "This field only applies to Individual Providers." },
  { name: "last_name", desc: "Applies to Individual Providers only." },
  { name: "organization_name", desc: "This field only applies to Organizational Providers (NPI-2)." },
  { name: "city", desc: "The City associated with the provider's address identified in Address Purpose." },
  { name: "state", desc: "The State abbreviation associated with the provider's address identified in Address Purpose. Cannot be used as the only input criterion — at least one other field, besides Enumeration Type and Country, must be populated." },
  { name: "postal_code", desc: "The Postal Code associated with the provider's address identified in Address Purpose. A 5-digit postal code will match any appropriate 9-digit (zip+4) codes in the data. Trailing wildcard entries are permitted, requiring at least two characters (e.g., \"21*\")." },
  { name: "country_code", desc: "The Country associated with the provider's address identified in Address Purpose. Can be used as the only input criterion as long as the value selected is not US." },
  { name: "limit", desc: "Number of results to return." }
];

const LOCAL_ENDPOINTS = [
  { method: "GET", path: "/api/providers", desc: "Search providers. Supports npi, name, organization_name, city, state, postal_code, taxonomy_description, entity_type, status, official_first_name, official_last_name, limit, offset." },
  { method: "GET", path: "/api/providers/:npi", desc: "Fetch a single provider record by NPI." },
  { method: "GET", path: "/api/providers/validate/:npi", desc: "Check whether an NPI passes the Luhn checksum. Returns { npi, valid }." },
  { method: "POST", path: "/api/providers", desc: "Create a new provider record." },
  { method: "PUT", path: "/api/providers/:npi", desc: "Update fields on an existing provider record." },
  { method: "DELETE", path: "/api/providers/:npi", desc: "Delete a provider record." },
  { method: "GET", path: "/api/meta/states", desc: "List distinct states present in your data." },
  { method: "GET", path: "/api/meta/taxonomies", desc: "List distinct taxonomy descriptions present in your data." },
  { method: "GET", path: "/api/meta/stats", desc: "Totals: overall, individuals, organizations, active, deactivated." }
];

export default function ApiPage() {
  return (
    <div className="page-content">
      <h1 className="page-title">API</h1>

      <div className="about-block">
        <p>
          The real NPI Registry API (Version 2.1) is a free, public REST API run by CMS at{" "}
          <code>https://npiregistry.cms.hhs.gov/api/</code>. Its documented search parameters include:
        </p>

        {REAL_PARAMS.map((p) => (
          <div className="detail-row" key={p.name} style={{ alignItems: "flex-start" }}>
            <span className="label" style={{ minWidth: "140px" }}><code>{p.name}</code></span>
            <span className="value" style={{ textAlign: "left", flex: 1, marginLeft: "1rem" }}>{p.desc}</span>
          </div>
        ))}

        <p style={{ fontSize: "0.85rem", color: "#323a45", borderTop: "1px solid #d6d7d9", paddingTop: "1rem", marginTop: "1.5rem" }}>
          The parameter list above matches the real CMS API. This prototype does not call that live API —
          it exposes its own local API instead, described below.
        </p>

        <h2 style={{ fontSize: "1.1rem", marginTop: "2rem" }}>This prototype's local API</h2>
        <p>Running at <code>http://localhost:4000</code> — reads and writes only your local database.</p>

        {LOCAL_ENDPOINTS.map((e) => (
          <div className="detail-row" key={e.path + e.method} style={{ alignItems: "flex-start" }}>
            <span className="label" style={{ minWidth: "120px" }}>
              {e.method} <code>{e.path}</code>
            </span>
            <span className="value" style={{ textAlign: "left", flex: 1, marginLeft: "1rem" }}>{e.desc}</span>
          </div>
        ))}

        <p style={{ marginTop: "1.5rem" }}>Example request from a terminal:</p>
        <pre style={{ background: "#f4f4f4", padding: "0.75rem 1rem", borderRadius: "3px", overflowX: "auto" }}>
{`curl "http://localhost:4000/api/providers?state=TX&limit=10"`}
        </pre>
      </div>
    </div>
  );
}