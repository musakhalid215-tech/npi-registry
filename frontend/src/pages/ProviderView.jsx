import React, { useState } from "react";
import { api } from "../api";

function displayName(p) {
  if (p.entity_type === "Organization") return p.organization_name || "(unnamed organization)";
  const parts = [p.first_name, p.middle_name, p.last_name, p.credential].filter(Boolean);
  return parts.join(" ") || "(unnamed provider)";
}

export default function ProviderView({ provider, onHome, onBackToResults, onChanged }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(provider);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      await api.updateProvider(provider.npi, form);
      setEditing(false);
      onChanged();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete record ${provider.npi}? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await api.deleteProvider(provider.npi);
      onChanged();
      onBackToResults();
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  };

  const address = [provider.address_line_1, provider.address_line_2].filter(Boolean).join(", ");
  const cityStateZip = [provider.city, provider.state].filter(Boolean).join(", ") + (provider.postal_code ? " " + provider.postal_code : "");

  return (
    <div className="page-content">
      <h1 className="page-title">Provider Information for {provider.npi}</h1>

      <p>The following NPI(s) contain information matching your search criteria. Please select the NPI to view all the data associated with the NPI.</p>

      <p className="breadcrumb">
        <a href="#" onClick={(e) => { e.preventDefault(); onHome(); }}>Home</a>
        {" / "}
        <a href="#" onClick={(e) => { e.preventDefault(); onBackToResults(); }}>Back To Results</a>
        {" / "}
        <span>NPI View</span>
      </p>

      <p className="helper-text">
        <strong>Please Note:</strong> Issuance of an NPI does not ensure or validate that the Health Care
        Provider is Licensed or Credentialed. For more information please refer to{" "}
        <a href="#">NPI: What You Need to Know</a>
      </p>

      {error && <div className="error-banner">{error}</div>}

      <div className="provider-name-block">
        <h2>{provider.entity_type === "Individual" ? "Mr./Ms. " : ""}{displayName(provider)}</h2>
        {provider.entity_type === "Individual" && <p>Sex: —</p>}
      </div>

      <p className="meta-line">
        NPI: {provider.npi} &nbsp;·&nbsp; Last Updated: {provider.last_updated ? provider.last_updated.split("T")[0] : "—"}
      </p>

      <div className="search-actions" style={{ margin: "1rem 0 1.5rem" }}>
        {editing ? (
          <>
            <button className="primary" disabled={busy} onClick={save}>Save changes</button>
            <button className="ghost" disabled={busy} onClick={() => { setEditing(false); setForm(provider); }}>Cancel</button>
          </>
        ) : (
          <>
            <button className="primary" onClick={() => setEditing(true)}>Edit record</button>
            <button className="ghost" disabled={busy} onClick={remove}>Delete record</button>
          </>
        )}
      </div>

      <h3 className="section-heading">Details</h3>
      <table className="detail-table">
        <thead><tr><th>Name</th><th>Value</th></tr></thead>
        <tbody>
          <tr><td>NPI</td><td>{provider.npi}</td></tr>
          <tr><td>Enumeration Date</td><td>{provider.enumeration_date || "—"}</td></tr>
          <tr><td>NPI Type</td><td>{provider.entity_type === "Individual" ? "NPI-1 Individual" : "NPI-2 Organization"}</td></tr>
          <tr><td>Status</td><td>{provider.status}</td></tr>
          <tr>
            <td>Mailing / Practice Address</td>
            <td>
              {editing ? (
                <>
                  <input value={form.address_line_1 || ""} onChange={(e) => setForm((f) => ({ ...f, address_line_1: e.target.value }))} placeholder="Address line 1" style={{ marginBottom: "0.4rem", width: "100%" }} />
                  <input value={form.city || ""} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} placeholder="City" style={{ marginBottom: "0.4rem", width: "100%" }} />
                  <input value={form.state || ""} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} placeholder="State" style={{ width: "100%" }} />
                </>
              ) : (
                <>
                  {address || "—"}<br />
                  {cityStateZip}<br />
                  United States<br />
                  Phone: {provider.phone || "—"}
                </>
              )}
            </td>
          </tr>
          <tr><td>Health Information Exchange</td><td style={{ color: "#8a8f96" }}>Endpoint type Endpoint Description</td></tr>
          <tr><td>Other Identifiers</td><td style={{ color: "#8a8f96" }}>Not tracked</td></tr>
        </tbody>
      </table>

      <h3 className="section-heading" style={{ marginTop: "1.5rem" }}>Taxonomy</h3>
      <table className="detail-table">
        <thead><tr><th>Taxonomy</th><th>State</th><th>primary Taxonomy</th><th>Selected Taxonomy</th><th>License Number</th></tr></thead>
        <tbody>
          <tr>
            <td>
              {editing ? (
                <input value={form.taxonomy_description || ""} onChange={(e) => setForm((f) => ({ ...f, taxonomy_description: e.target.value }))} />
              ) : (
                <>{provider.taxonomy_code || "—"} - {provider.taxonomy_description || "—"}</>
              )}
            </td>
            <td>
              {editing ? (
                <input value={form.license_state || ""} onChange={(e) => setForm((f) => ({ ...f, license_state: e.target.value }))} />
              ) : (provider.license_state || "—")}
            </td>
            <td>
                
            </td>
            <td>
                  {editing ? (
                <input value={form.state_Taxonomy || ""} onChange={(e) => setForm((f) => ({ ...f, state_Taxonomy: e.target.value }))} />
              ) : (provider.state_Taxonomy || "—")}
            </td>
            <td>
              {editing ? (
                <input value={form.license_number || ""} onChange={(e) => setForm((f) => ({ ...f, license_number: e.target.value }))} />
              ) : (provider.license_number || "—")}
            </td>
          </tr>
        </tbody>
      </table>

      {provider.entity_type === "Organization" && (
        <>
          <h3 className="section-heading" style={{ marginTop: "1.5rem" }}>Authorized Official</h3>
          <table className="detail-table">
            <thead><tr><th>First Name</th><th>Last Name</th></tr></thead>
            <tbody>
              <tr>
                <td>{editing ? <input value={form.official_first_name || ""} onChange={(e) => setForm((f) => ({ ...f, official_first_name: e.target.value }))} /> : (provider.official_first_name || "—")}</td>
                <td>{editing ? <input value={form.official_last_name || ""} onChange={(e) => setForm((f) => ({ ...f, official_last_name: e.target.value }))} /> : (provider.official_last_name || "—")}</td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}