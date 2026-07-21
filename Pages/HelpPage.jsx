import React from "react";

const REAL_FAQS = [
  {
    q: "How is NPPES accessed?",
    a: "NPPES can be accessed via https://nppes.cms.hhs.gov"
  },
  {
    q: "How does CMS disseminate NPPES data?",
    a: "In September 2007, CMS began disclosing NPPES health care provider data that can be disclosed under the Freedom of Information Act (FOIA)."
  },
  {
    q: "How is NPPES being updated?",
    a: "As of January 1, 2020, NPPES allows providers to attest to the accuracy of their NPI data. If a provider's information is correct, they will be able to attest to it and NPPES will record and reflect the attestation date."
  },
  {
    q: "Does NPPES have the ability for multiple provider addresses?",
    a: "Yes, NPPES was recently updated to allow providers to input multiple addresses."
  },
  {
    q: "Why does CMS feel that NPPES is a good source for provider directories?",
    a: "NPPES provides core directory data elements (provider name, provider specialty, provider address, provider telephone number) for virtually every provider in the country. NPPES data is available publicly in a machine readable format at no cost."
  }
];

const PROTOTYPE_FAQS = [
  {
    q: "I searched and got no results — what's wrong?",
    a: "Your local database is likely empty or doesn't contain a match. Import data first by running `npm run import -- data/yourfile.csv` from the backend folder, then search again."
  },
  {
    q: "Why didn't the Authorized Official fields filter my search?",
    a: "Those only work if your imported data includes official_first_name and official_last_name fields."
  },
  {
    q: "Can I edit or delete a record from the search results?",
    a: "Yes — click any result to open its detail card, then use Edit record or Delete record."
  }
];

export default function HelpPage() {
  return (
    <div className="page-content">
      <h1 className="page-title">Help</h1>
      <div className="about-block">
        <p>The questions below are the real, published NPPES FAQ text from CMS:</p>
        {REAL_FAQS.map((f, i) => (
          <div key={"real-" + i} style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontWeight: 700, marginBottom: "0.3rem" }}>Q: {f.q}</p>
            <p style={{ margin: 0 }}>A: {f.a}</p>
          </div>
        ))}

        <h2 style={{ fontSize: "1.1rem", marginTop: "2rem", borderTop: "1px solid #d6d7d9", paddingTop: "1.5rem" }}>
          Questions about NPI
        </h2>
        {PROTOTYPE_FAQS.map((f, i) => (
          <div key={"proto-" + i} style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontWeight: 700, marginBottom: "0.3rem" }}>{f.q}</p>
            <p style={{ margin: 0 }}>{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}