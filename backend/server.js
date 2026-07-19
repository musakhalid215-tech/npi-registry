const express = require("express");
const cors = require("cors");

const providerRoutes = require("./routes/providers");
const metaRoutes = require("./routes/meta");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "NPI Registry Prototype API",
    endpoints: [
      "GET  /api/providers?name=&city=&state=&postal_code=&taxonomy_description=&entity_type=&status=&limit=&offset=",
      "GET  /api/providers/:npi",
      "GET  /api/providers/validate/:npi",
      "POST /api/providers",
      "PUT  /api/providers/:npi",
      "DELETE /api/providers/:npi",
      "GET  /api/meta/states",
      "GET  /api/meta/taxonomies",
      "GET  /api/meta/stats"
    ]
  });
});

app.use("/api/providers", providerRoutes);
app.use("/api/meta", metaRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found" }));

app.listen(PORT, () => {
  console.log(`NPI Registry API running at http://localhost:${PORT}`);
});
