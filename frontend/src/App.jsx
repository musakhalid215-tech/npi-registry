import React, { useEffect, useState, useCallback } from "react";
import { api } from "./api";
import SearchForm from "./components/SearchForm";
import ResultsList from "./components/ResultsList";
import NppesPage from "./pages/NppesPage";
import DownloadsPage from "./pages/DownloadsPage";
import ApiPage from "./pages/ApiPage";
import HelpPage from "./pages/HelpPage";
import ProviderView from "./pages/ProviderView";

const EMPTY_FILTERS = {
  npi: "", entity_type: "", taxonomy_description: "",
  first_name: "", last_name: "",
  organization_name: "", official_first: "", official_last: "",
  city: "", state: "", country: "", postal_code: "", address_type: "",
  exact_match: false
};

const LIMIT = 10;

function toApiParams(f) {
  const name = [f.first_name, f.last_name].filter(Boolean).join(" ").trim();
  return {
    npi: f.npi,
    name: name || undefined,
    organization_name: f.organization_name,
    city: f.city,
    state: f.state,
    postal_code: f.postal_code,
    taxonomy_description: f.taxonomy_description,
    entity_type: f.entity_type,
    official_first_name: f.official_first,
    official_last_name: f.official_last
  };
}

export default function App() {
  // view: "nppes" | "downloads" | "api" | "help" | "search-form" | "search-results" | "provider-detail"
  const [view, setView] = useState("search-form");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [offset, setOffset] = useState(0);
  const [results, setResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [states, setStates] = useState([]);
  const [taxonomies, setTaxonomies] = useState([]);
  const [selectedNpi, setSelectedNpi] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const loadMeta = useCallback(async () => {
    try {
      const [s, t] = await Promise.all([api.getStates(), api.getTaxonomies()]);
      setStates(s);
      setTaxonomies(t);
    } catch (e) {
      // meta failures shouldn't block search
    }
  }, []);

  useEffect(() => { loadMeta(); }, [loadMeta]);

  const runSearch = useCallback(async (f, off) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.searchProviders({ ...toApiParams(f), limit: LIMIT, offset: off });
      setResults(data.results);
      setTotalCount(data.total_count);
    } catch (e) {
      setError(e.message || "Could not reach the API. Is the backend running on port 4000?");
      setResults([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!selectedNpi) { setSelectedProvider(null); return; }
    api.getProvider(selectedNpi).then(setSelectedProvider).catch((e) => setError(e.message));
  }, [selectedNpi]);

  const handleSearch = () => {
    setAppliedFilters(filters);
    setOffset(0);
    runSearch(filters, 0);
    setView("search-results");
  };

  const handleReset = () => {
    setFilters(EMPTY_FILTERS);
  };

  const goHome = () => {
    setFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setResults([]);
    setTotalCount(0);
    setSelectedNpi(null);
    setView("search-form");
  };

  const handlePage = (newOffset) => {
    setOffset(newOffset);
    runSearch(appliedFilters, newOffset);
  };

  const openProvider = (npi) => {
    setSelectedNpi(npi);
    setView("provider-detail");
  };

  const backToResults = () => {
    setSelectedNpi(null);
    setView("search-results");
  };

  const refreshAfterChange = () => {
    runSearch(appliedFilters, offset);
    if (selectedNpi) api.getProvider(selectedNpi).then(setSelectedProvider).catch(() => {});
    loadMeta();
  };

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand" style={{ cursor: "pointer" }} onClick={goHome}>
          NPPES NPI Registry
        </div>
        <nav>
          <span onClick={() => setView("nppes")} style={{ fontWeight: view === "nppes" ? 700 : 400 }}>NPPES</span>
          <span onClick={() => setView("downloads")} style={{ fontWeight: view === "downloads" ? 700 : 400 }}>Downloads</span>
          <span onClick={() => setView("api")} style={{ fontWeight: view === "api" ? 700 : 400 }}>API</span>
          <span onClick={() => setView("help")} style={{ fontWeight: view === "help" ? 700 : 400 }}>Help</span>
        </nav>
      </div>

      {view === "nppes" && <NppesPage />}
      {view === "downloads" && <DownloadsPage />}
      {view === "api" && <ApiPage />}
      {view === "help" && <HelpPage />}

      {view === "search-form" && (
        <div className="page-content">
          <h1 className="page-title">Search NPI Records</h1>

          <div className="notice-box">
            <strong>Effective 6/25/2024:</strong> To ensure the best experience, NPPES has limited the amount of NPI
            Registry queries that can be completed per hour
            <ul>
              <li>Bulk NPI Registry queries must use the DDS file.</li>
            </ul>
          </div>

          <SearchForm
            filters={filters}
            setFilters={setFilters}
            onSearch={handleSearch}
            onReset={handleReset}
            states={states}
            taxonomies={taxonomies}
          />

          {error && <div className="error-banner">{error}</div>}

          <div className="about-block">
            <p>
              <strong>Please Note:</strong> Issuance of an NPI does not ensure or validate that the Health Care
              Provider is Licensed or Credentialed. For more information please refer to{" "}
              <a href="#">NPI: What You Need to Know</a>
            </p>
            <p>
              NPI Registry Public Search is a free directory of all active National Provider Identifier (NPI)
              records. Healthcare providers acquire their unique 10-digit NPIs to identify themselves in a
              standard way throughout their industry.
            </p>
            <p>
              This is a local prototype and is not affiliated with or endorsed by CMS. Data shown is whatever
              you've imported into your own local database.
            </p>
          </div>
        </div>
      )}

      {view === "search-results" && (
        <div className="page-content">
          <p className="breadcrumb">
            <a href="#" onClick={(e) => { e.preventDefault(); goHome(); }}>New Search</a>
          </p>
          {error && <div className="error-banner">{error}</div>}
          <ResultsList
            results={results}
            totalCount={totalCount}
            limit={LIMIT}
            offset={offset}
            onSelect={openProvider}
            onPage={handlePage}
            loading={loading}
          />
        </div>
      )}

      {view === "provider-detail" && selectedProvider && (
        <ProviderView
          provider={selectedProvider}
          onHome={goHome}
          onBackToResults={backToResults}
          onChanged={refreshAfterChange}
        />
      )}

      <footer className="gov-footer">
        <div className="seal">HHS</div>
        <div className="foot-text">
          <div>A federal-style layout for local prototyping — managed by no one.</div>
        </div>
      </footer>
    </div>
  );
}