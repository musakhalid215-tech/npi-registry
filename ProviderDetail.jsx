import React, { useState } from "react";
import { api } from "../api";

const FIELD_LABELS = {
  address_line_1: "Address",
  address_line_2: "Address 2",
  city: "City",
  state: "State",
  postal_code: "ZIP",
  phone: "Phone",
  taxonomy_code: "Taxonomy code",
  taxonomy_description: "Taxonomy",
  license_number: "License #",
  license_state: "License state",
  enumeration_date: "Enumeration date"
};

function displayName(p) {
  if (p.entity_type === "Organization") return p.organization_name || "(unnamed organization)";
  const parts = [p.first_name, p.middle_name, p.last_name, p.credential].filter(Boolean);
  return parts.join(" ") || "(unnamed provider)";
}

export default function ProviderDetail({ provider, onClose, onChanged }) {
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
      onClose();
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="detail-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close">×</button>
        <div className="eyebrow">{provider.entity_type} · {provider.status}</div>
        <h2>{displayName(provider)}</h2>

        {error && <div className="error-banner">{error}</div>}

        <div className="detail-row">
          <span className="label">NPI</span>
          <span className="value" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{provider.npi}</span>
        </div>

        {Object.entries(FIELD_LABELS).map(([key, label]) => (
          <div className="detail-row" key={key}>
            <span className="label">{label}</span>
            {editing ? (
              <input
                style={{ textAlign: "right", border: "1px solid var(--rule)", padding: "0.2rem 0.4rem", width: "60%" }}
                value={form[key] || ""}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              />
            ) : (
              <span className="value">{provider[key] || "—"}</span>
            )}
          </div>
        ))}

        <div className="detail-row">
          <span className="label">Status</span>
          {editing ? (
            <select
              style={{ textAlign: "right" }}
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            >
              <option value="Active">Active</option>
              <option value="Deactivated">Deactivated</option>
            </select>
          ) : (
            <span className="value">{provider.status}</span>
          )}
        </div>

        <div className="detail-actions">
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
      </div>
    </div>
  );
}
