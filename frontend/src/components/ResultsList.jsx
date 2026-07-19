import React from "react";

function PersonIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="8" r="4" fill="#4a4a4a" />
      <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="#4a4a4a" />
    </svg>
  );
}

function displayName(p) {
  if (p.entity_type === "Organization") return p.organization_name || "(unnamed organization)";
  const parts = [p.first_name, p.middle_name, p.last_name].filter(Boolean);
  return parts.join(" ") || "(unnamed provider)";
}

export default function ResultsList({ results, totalCount, limit, offset, onSelect, onPage, loading }) {
  if (loading) return <div className="empty-state">Searching registry…</div>;

  if (results.length === 0) {
    return <div className="empty-state">No providers match those filters. Try broadening your search.</div>;
  }

  const page = Math.floor(offset / limit) + 1;
  const pageCount = Math.max(1, Math.ceil(totalCount / limit));

  return (
    <div>
      <div className="results-header">
        <span>{totalCount} record{totalCount === 1 ? "" : "s"} found</span>
        <span>page {page} of {pageCount}</span>
      </div>

      {results.map((p) => (
        <div key={p.npi} className={`result-row-table ${p.status === "Deactivated" ? "deactivated" : ""}`}>
          <div className="rrt-npi">
            <a href="#" onClick={(e) => { e.preventDefault(); onSelect(p.npi); }}>{p.npi}</a>
          </div>
          <div className="rrt-icon"><PersonIcon /></div>
          <div className="rrt-main">
            <div className="name">{displayName(p)}</div>
            <div className="subline">
              {[p.address_line_1, [p.city, p.state].filter(Boolean).join(", "), p.postal_code].filter(Boolean).join(" · ")}
            </div>
            <span className={`badge ${p.status === "Deactivated" ? "deactivated" : "active"}`}>{p.status}</span>
          </div>
          <div className="rrt-phone">{p.phone || "—"}</div>
          <div className="rrt-taxonomy">{p.taxonomy_description || p.entity_type}</div>
        </div>
      ))}

      <div className="pagination">
        <button className="ghost" disabled={offset === 0} onClick={() => onPage(Math.max(0, offset - limit))}>
          ← Prev
        </button>
        <span>{page} / {pageCount}</span>
        <button
          className="ghost"
          disabled={offset + limit >= totalCount}
          onClick={() => onPage(offset + limit)}
        >
          Next →
        </button>
      </div>
    </div>
  );
}