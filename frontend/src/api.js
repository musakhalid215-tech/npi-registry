const BASE = "https://npi-registry.onrender.com/api";

async function handle(res) {
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const api = {
  searchProviders: (params) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== "" && v !== undefined && v !== null)
    ).toString();
    return fetch(`${BASE}/providers?${qs}`).then(handle);
  },
  getProvider: (npi) => fetch(`${BASE}/providers/${npi}`).then(handle),
  validateNpi: (npi) => fetch(`${BASE}/providers/validate/${npi}`).then(handle),
  createProvider: (payload) =>
    fetch(`${BASE}/providers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(handle),
  updateProvider: (npi, payload) =>
    fetch(`${BASE}/providers/${npi}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(handle),
  deleteProvider: (npi) => fetch(`${BASE}/providers/${npi}`, { method: "DELETE" }).then(handle),
  getStates: () => fetch(`${BASE}/meta/states`).then(handle),
  getTaxonomies: () => fetch(`${BASE}/meta/taxonomies`).then(handle),
  getStats: () => fetch(`${BASE}/meta/stats`).then(handle)
};
