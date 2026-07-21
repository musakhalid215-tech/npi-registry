import React from "react";

export default function SearchForm({ filters, setFilters, onSearch, states, taxonomies, onReset }) {
  const update = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form className="search-panel" onSubmit={submit}>
      <div className="search-grid">
        <div className="field">
          <label htmlFor="npi">NPI Number</label>
          <input id="npi" value={filters.npi} onChange={update("npi")} placeholder="" />
        </div>
        <div className="field">
          <label htmlFor="entity_type">NPI Type</label>
          <select id="entity_type" value={filters.entity_type} onChange={update("entity_type")}>
            <option value="">Any</option>
            <option value="Individual">Individual</option>
            <option value="Organization">Organization</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="taxonomy">Taxonomy Description</label>
          <select id="taxonomy" value={filters.taxonomy_description} onChange={update("taxonomy_description")}>
            <option value="">Any</option>
            {taxonomies.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="section-label">for individuals</div>
      <div className="search-grid">
        <div className="field">
          <label htmlFor="first_name">Provider First Name</label>
          <input id="first_name" value={filters.first_name} onChange={update("first_name")} />
        </div>
        <div className="field">
          <label htmlFor="last_name">Provider Last Name</label>
          <input id="last_name" value={filters.last_name} onChange={update("last_name")} />
        </div>
      </div>

      <div className="section-label">for organizations</div>
      <div className="search-grid">
        <div className="field">
          <label htmlFor="organization_name">Organization Name (LBN, DBA, Former LBN or Other Name)</label>
          <input id="organization_name" value={filters.organization_name} onChange={update("organization_name")} />
        </div>
        <div className="field">
          <label htmlFor="official_first">Authorized Official First Name</label>
          <input id="official_first" value={filters.official_first} onChange={update("official_first")} />
        </div>
        <div className="field">
          <label htmlFor="official_last">Authorized Official Last Name</label>
          <input id="official_last" value={filters.official_last} onChange={update("official_last")} />
        </div>
      </div>

      <div className="search-grid" style={{ marginTop: "1.3rem" }}>
        <div className="field">
          <label htmlFor="city">City</label>
          <input id="city" value={filters.city} onChange={update("city")} />
        </div>
        <div className="field">
          <label htmlFor="state">State</label>
          <select id="state" value={filters.state} onChange={update("state")}>
            <option value="">Any</option>
            {states.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="country">Country</label>
          <select id="country" value={filters.country} onChange={update("country")}>
            <option value="">Any</option>
            <option value="US">United States</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="postal_code">Postal Code</label>
          <input id="postal_code" value={filters.postal_code} onChange={update("postal_code")} />
        </div>
        <div className="field">
          <label htmlFor="address_type">Address Type</label>
          <select id="address_type" value={filters.address_type} onChange={update("address_type")}>
            <option value="">Any</option>
            <option value="mailing">Mailing</option>
            <option value="practice">Practice Location</option>
          </select>
        </div>
      </div>

      <label className="exact-match-row">
        <input
          type="checkbox"
          checked={filters.exact_match}
          onChange={(e) => setFilters((f) => ({ ...f, exact_match: e.target.checked }))}
        />
        Check this box to search for Exact Matches only
      </label>

      <p className="helper-text">
        ** This search page is by default set to return similar and close results to your search keywords.
        You can check the box above if you only want the exact matches for your keywords to be returned in the search results.
      </p>
      <p className="helper-text">
        <strong>Note:</strong> The NPI Registry limits searches to the first 2100 results. If you cannot find the
        NPI that you are looking for, please refine the search.
      </p>

      <div className="search-actions">
        <button type="button" className="ghost" onClick={onReset}>Clear</button>
        <button type="submit" className="primary">Search</button>
      </div>
    </form>
  );
}