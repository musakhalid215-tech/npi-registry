import React from "react";

export default function NppesPage() {
  return (
    <div className="page-content">
      <div className="gov-banner">
        <span>🇺🇸 An official website of the United States government</span>
        <span className="gov-banner-link">Here's how you know</span>
      </div>

      <h1 className="page-title">NPPES</h1>

      <div className="two-col">
        <div className="colin">
        <div className="col">
          <h2 style={{ fontSize: "1.3rem" }}>Registered User Sign In</h2>
          <p>Log in to view/update your National Provider Identifier (NPI) record.</p>

          <div className="field" style={{ maxWidth: "360px" }}>
            <label>User ID</label>
            <input disabled placeholder="I&A User ID, used to access NPPES & PECOS" />
          </div>
          <div className="field" style={{ maxWidth: "360px", marginTop: "0.75rem" }}>
            <label>Password</label>
            <input disabled type="password" />
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem", fontSize: "0.9rem" }}>
            <input type="checkbox" disabled />
            I agree to the <a href="#">Terms and Conditions</a>
          </label>

          <button className="primary-t" disabled style={{ marginTop: "1rem", opacity: 0.6, cursor: "not-allowed" }}>
            SIGN IN
          </button>
          <p style={{ marginTop: "0.75rem" }}><a href="#">FORGOT USER ID or PASSWORD?</a></p>
          <p style={{ fontSize: "0.85rem", color: "#323a45" }}>
            *If your User ID is associated with a large number of providers, you could experience a small delay
            while the application retrieves all NPPES profile related information.
          </p>
        </div>
            </div>
        <div className="col">
          <h2 style={{ fontSize: "1.3rem" }}>Create or Manage an Account</h2>
          <p>You need an Identity &amp; Access Management System (I&amp;A) account to log into NPPES.</p>
          <p>
            <strong>Individual Providers or Users Working on Behalf of a Provider or Organization</strong>
          </p>
          <p>
            If you don't have an I&amp;A account, or you need to update your existing I&amp;A account, then
            select the "CREATE or MANAGE AN ACCOUNT" button below to go to I&amp;A.
          </p>
          <p>
            After successfully creating your I&amp;A account, return to NPPES and use your I&amp;A User ID and
            Password to log in. This is where you can create and maintain NPI data that you are associated with.
          </p>
          <button className="primary" disabled style={{ opacity: 0.6, cursor: "not-allowed" }}>
            CREATE or MANAGE AN ACCOUNT
          </button>
        </div>
      </div>

      <div className="notice-box" style={{ marginTop: "2rem" }}>
        <strong>Announcements</strong>
        <p>NPPES, I&amp;A and NPI registry will be down on 07/18/2026 (Saturday) from 1:00 PM to 6:30 PM ET due to scheduled maintenance.</p>
        <p>
          <strong>Attention:</strong> The NPI Enumerator Mailing Address has been updated. Send all paper
          applications to CMS NPI Enumerator Services, Mail Stop Do-01-51, 7500 Security Blvd., Baltimore, MD, 21244.
        </p>
      </div>

      <div className="three-col" style={{ marginTop: "2rem" }}>
        <div>
          <h3 style={{ fontSize: "1rem" }}>ABOUT</h3>
          <p style={{ fontSize: "0.9rem" }}>
            The Administrative Simplification provisions of the Health Insurance Portability and Accountability
            Act of 1996 (HIPAA) mandated the adoption of standard unique identifiers for health care providers
            and health plans.
          </p>
          <p style={{ fontSize: "0.9rem" }}>
            The purpose of these provisions is to improve the efficiency and effectiveness of the electronic
            transmission of health information. The Centers for Medicare &amp; Medicaid Services (CMS) has
            developed the National Plan and Provider Enumeration System (NPPES) to assign these unique identifiers.
          </p>
        </div>
        <div>
          <h3 style={{ fontSize: "1rem" }}>RESOURCES</h3>
          <ul style={{ fontSize: "0.9rem", paddingLeft: "1.1rem" }}>
            <li><a href="#">NPI Application / Update Form - [PDF File]</a></li>
            <li><a href="#">Privacy Information</a></li>
            <li><a href="#">Frequently Asked Questions</a></li>
            <li><a href="#">NPI Final Rule - [PDF File]</a></li>
            <li><a href="#">Contact Information</a></li>
            <li><a href="#">CMS NPI Pages</a></li>
          </ul>
        </div>
        <div>
          <h3 style={{ fontSize: "1rem" }}>CMS &amp; HHS WEBSITES</h3>
          <ul style={{ fontSize: "0.9rem", paddingLeft: "1.1rem" }}>
            <li><a href="https://www.medicare.gov" target="_blank" rel="noreferrer">Medicare.gov</a></li>
            <li><a href="https://www.medicaid.gov" target="_blank" rel="noreferrer">Medicaid.gov</a></li>
            <li><a href="https://www.insurekidsnow.gov" target="_blank" rel="noreferrer">insureKidsNow.gov</a></li>
            <li><a href="https://www.healthcare.gov" target="_blank" rel="noreferrer">HealthCare.gov</a></li>
            <li><a href="https://www.hhs.gov/open" target="_blank" rel="noreferrer">HHS.gov/Open</a></li>
          </ul>
        </div>
      </div>

      <div className="about-block" style={{ borderTop: "1px solid #d6d7d9", marginTop: "2rem", paddingTop: "1rem", fontSize: "0.85rem" }}>
        <p>
          A federal government website managed and paid for by the U.S. Centers for Medicare &amp; Medicaid
          Services. 7500 Security Boulevard, Baltimore, MD 21244
        </p>
        <p style={{ color: "#323a45" }}>
          Everything above (aside from the note you're reading now) is the real, public-domain text and layout
          from the actual NPPES login page. This is a static copy inside your local prototype — Sign In and
          Create Account are not functional here, and no data is sent anywhere.
        </p>
      </div>
    </div>
  );
}