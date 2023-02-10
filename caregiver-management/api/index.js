const express = require("express");
// const path = require("path");
// const dotenv = require("dotenv");
// dotenv.config();
// const cors = require("cors");
// const bodyParser = require("body-parser");

const ambulationJSON = require("./data/ambulation.json");
const bathroomJSON = require("./data/bathroom.json");
const blood_pressure = require("./data/blood_pressure.json");
const dressingJSON = require("./data/dressing.json");
const eatingJSON = require("./data/eating.json");
const fluidJSON = require("./data/fluid.json");
const glucoseJSON = require("./data/glucose.json");
const heart_rateJSON = require("./data/heart_rate.json");
const medicationJSON = require("./data/medication.json");
const showeringJSON = require("./data/showering.json");
const weightJSON = require("./data/weight.json");

// const PORT = process.env.PORT || 5001;
const PORT = 5001;

const app = express();

// const {v4} = require('uuid')
// Vercel integration
// app.get('/api', (req, res) => {
//   res.setHeader('Content-Type', 'text/html');
//   res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
// });

// app.use(cors());
// // app.use(bodyParser.json());
// app.use(bodyParser.json({ limit: "1gb" }));
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );

app.use(express.static(path.join(__dirname, "build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

app.post("/api/loadTakingOTCJSON", async (req, res) => {
  res.send([]);
});

app.post("/api/loadAmbulationJSON", async (req, res) => {
  const { resident_id } = req.body;
  const data = ambulationJSON["data"];
  const filtered_data = data.filter(
    (row) => row["fk_resident_id"] === parseInt(resident_id)
  );
  res.send(filtered_data);
});

app.post("/api/loadBathroomJSON", async (req, res) => {
  const { resident_id } = req.body;
  const data = bathroomJSON["data"];
  const filtered_data = data.filter(
    (row) => row["fk_resident_id"] === parseInt(resident_id)
  );
  res.send(filtered_data);
});

app.post("/api/loadBloodPressureJSON", async (req, res) => {
  const { resident_id } = req.body;
  const data = blood_pressure["data"];
  const filtered_data = data.filter(
    (row) => row["fk_resident_id"] === parseInt(resident_id)
  );
  res.send(filtered_data);
});

app.post("/api/loadDressingJSON", async (req, res) => {
  const { resident_id } = req.body;
  const data = dressingJSON["data"];
  const filtered_data = data.filter(
    (row) => row["fk_resident_id"] === parseInt(resident_id)
  );
  res.send(filtered_data);
});

app.post("/api/loadEatingJSON", async (req, res) => {
  const { resident_id } = req.body;
  const data = eatingJSON["data"];
  const filtered_data = data.filter(
    (row) => row["fk_resident_id"] === parseInt(resident_id)
  );
  res.send(filtered_data);
});

app.post("/api/loadFluidsJSON", async (req, res) => {
  const { resident_id } = req.body;
  const data = fluidJSON["data"];
  const filtered_data = data.filter(
    (row) => row["fk_resident_id"] === parseInt(resident_id)
  );
  res.send(filtered_data);
});

app.post("/api/loadGlucoseJSON", async (req, res) => {
  const { resident_id } = req.body;
  const data = glucoseJSON["data"];
  const filtered_data = data.filter(
    (row) => row["fk_resident_id"] === parseInt(resident_id)
  );
  res.send(filtered_data);
});

app.post("/api/loadHeartRateJSON", async (req, res) => {
  const { resident_id } = req.body;
  const data = heart_rateJSON["data"];
  const filtered_data = data.filter(
    (row) => row["fk_resident_id"] === parseInt(resident_id)
  );
  res.send(filtered_data);
});

app.post("/api/loadShoweringJSON", async (req, res) => {
  const { resident_id } = req.body;
  const data = showeringJSON["data"];
  const filtered_data = data.filter(
    (row) => row["fk_resident_id"] === parseInt(resident_id)
  );
  res.send(filtered_data);
});

app.post("/api/loadWeightJSON", async (req, res) => {
  const { resident_id } = req.body;
  const data = weightJSON["data"];
  const filtered_data = data.filter(
    (row) => row["fk_resident_id"] === parseInt(resident_id)
  );
  res.send(filtered_data);
});

module.exports = app;