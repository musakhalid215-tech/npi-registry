import React, { useState } from "react";

function toCsv(rows) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (val) => {
    if (val === null || val === undefined) return "";
    const s = String(val);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(","));
  }
  return lines.join("\n");
}

function download(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function DownloadsPage() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(null);

  const fetchAll = async () => {
    const res = await fetch("/api/providers?limit=200");
    const data = await res.json();
    return data.results;
  };

  const handleDownload = async (format) => {
    setBusy(true);
    setError(null);
    try {
      const rows = await fetchAll();
      setCount(rows.length);
      if (format === "csv") {
        download("providers_export.csv", toCsv(rows), "text/csv");
      } else {
        download("providers_export.json", JSON.stringify(rows, null, 2), "application/json");
      }
    } catch (e) {
      setError(e.message || "Could not reach the API.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page-content">
      <h1 className="page-title">Downloads</h1>
      <div className="about-block">
        <p>
          Other Name Reference File - this file contains additional Other Names associated with Type 2 NPIs.
          Practice Location Reference File - this file contains all the non-primary Practice Locations
          associated with Type 1 and Type 2 NPIs. Endpoint Reference File - this file contains all Endpoints
          associated with Type 1 and Type 2 NPIs. Detailed information about the NPI files is included in the
          Data Dissemination File - Readme file.
        </p>
        <p style={{ fontSize: "0.85rem", color: "#323a45", borderTop: "1px solid #d6d7d9", paddingTop: "1rem" }}>
          The paragraph above describes the real, full NPPES dissemination files CMS publishes at{" "}
          <a href="https://download.cms.gov/nppes/NPI_Files.html" target="_blank" rel="noreferrer">
            download.cms.gov/nppes/NPI_Files.html
          </a>{" "}
          — those are national files covering every real NPI, and this local prototype does not host or serve
          them. What you can actually export below is only the data you've personally imported into this
          prototype's local database.
        </p>

        {error && <div className="error-banner">{error}</div>}

        <div className="search-actions" style={{ marginTop: "1.5rem" }}>
          <button className="primary" disabled={busy} onClick={() => handleDownload("csv")}>
            {busy ? "Preparing…" : "Download my data as CSV"}
          </button>
          <button className="primary" disabled={busy} onClick={() => handleDownload("json")}>
            {busy ? "Preparing…" : "Download my data as JSON"}
          </button>
        </div>

        {count !== null && !busy && (
          <p style={{ marginTop: "1rem" }}>Exported {count} record{count === 1 ? "" : "s"}.</p>
        )}
      </div>
    </div>
  );
}