const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const bodyParser = require("body-parser");

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

const PORT = process.env.PORT || 5001;

const app = express();

const {v4} = require('uuid')
// Vercel integration
app.get('/api', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
});


app.use(cors());
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "1gb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  sslmode: "require",
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,
});

app.use(express.static(path.join(__dirname, "client", "build")));

app.post("/api/loadNotes", async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM notes");
    const rows = [];
    for (let row of results.rows) {
      rows.push(row);
    }
    res.send(rows);
  } catch (err) {
    console.log("LoadNotes errored");
    console.log("Error: ", err);
    res.send(false);
  }
});

app.post("/api/loadNote", async (req, res) => {
  try {
    const { note_id } = req.body;
    pool.query(
      "SELECT * FROM notes WHERE note_id=$1",
      [note_id],
      (error, results) => {
        if (error) {
          throw error;
        } else {
          const rows = [];
          for (let row of results.rows) {
            rows.push(row);
          }
          res.send(rows);
        }
      }
    );
  } catch (err) {
    console.log("LoadNote errored");
    console.log("Error: ", err);
    res.send(false);
  }
});

app.post("/api/saveNote", async (req, res) => {
  try {
    const {
      date,
      time,
      resident_first_name,
      resident_last_name,
      caregiver_name,
      body,
      priority,
      action_required,
    } = req.body;
    pool.query(
      "INSERT INTO notes (date, time, resident_first_name, resident_last_name, caregiver_name, body, priority, action_required) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        date,
        time,
        resident_first_name,
        resident_last_name,
        caregiver_name,
        body,
        priority,
        action_required,
      ],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(201).send("Note Saved");
      }
    );
  } catch (err) {
    console.log("saveNote: ", err);
    res.send(false);
  }
});

app.post("/api/saveAlert", async (req, res) => {
  // Note: passing is_alert is redundant since it is always true; parameter included for visibility in client code
  try {
    const {
      date,
      time,
      resident_first_name,
      resident_last_name,
      caregiver_name,
      body,
      priority,
      action_required,
      is_alert,
    } = req.body;
    pool.query(
      "INSERT INTO notes (date, time, resident_first_name, resident_last_name, caregiver_name, body, priority, action_required, is_alert) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      [
        date,
        time,
        resident_first_name,
        resident_last_name,
        caregiver_name,
        body,
        priority,
        action_required,
        is_alert,
      ],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(201).send("Note Saved");
      }
    );
  } catch (err) {
    console.log("saveNote: ", err);
    res.send(false);
  }
});

app.post("/api/getNoteByContent", async (req, res) => {
  try {
    const {
      date,
      time,
      resident_first_name,
      resident_last_name,
      caregiver_name,
      body,
      priority,
      action_required,
    } = req.body;
    pool.query(
      "SELECT * from notes WHERE date=$1 AND time=$2 AND resident_first_name=$3 AND resident_last_name=$4 AND caregiver_name=$5 AND body=$6 AND priority=$7 AND action_required=$8",
      [
        date,
        time,
        resident_first_name,
        resident_last_name,
        caregiver_name,
        body,
        priority,
        action_required,
      ],
      (error, results) => {
        if (error) {
          throw error;
        }
        const rows = [];
        for (let row of results.rows) {
          rows.push(row);
        }
        res.send(rows);
      }
    );
  } catch (err) {
    console.log("getNoteByContent: ", err);
    res.send(false);
  }
});

app.post("/api/updateNote", async (req, res) => {
  try {
    const {
      note_id,
      date,
      time,
      caregiver_name,
      body,
      priority,
      action_required,
    } = req.body;
    pool.query(
      "UPDATE notes set date=$2, time=$3, caregiver_name=$4, body=$5, priority=$6, action_required=$7 WHERE note_id=$1 ",
      [note_id, date, time, caregiver_name, body, priority, action_required],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(201).send("Note Updated");
      }
    );
  } catch (err) {
    console.log("updateNote: ", err);
    res.send(false);
  }
});

app.post("/api/resolveNote", async (req, res) => {
  try {
    const { note_id } = req.body;
    pool.query(
      "UPDATE notes set resolved=true, action_required=false WHERE note_id=$1",
      [note_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(201).send("Note Resolved");
      }
    );
  } catch (err) {
    console.log("resolveNote: ", err);
    res.send(false);
  }
});

app.post("/api/deleteNote", async (req, res) => {
  try {
    const { note_id } = req.body;
    pool.query(
      "DELETE FROM notes WHERE note_id=$1",
      [note_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(201).send("Note Deleted");
      }
    );
  } catch (err) {
    console.log("deleteNote: ", err);
    res.send(false);
  }
});

app.post("/api/saveBinaryADL", async (req, res) => {
  try {
    const { timestamp, fk_resident_id, adl_type, with_assistance } = req.body;
    pool.query(
      "INSERT INTO binary_adls (timestamp, fk_resident_id, adl_type, with_assistance) values ($1, $2, $3, $4)",
      [timestamp, fk_resident_id, adl_type, with_assistance],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(201).send("Binary ADL Saved");
      }
    );
  } catch (err) {
    console.log("addData: ", err);
    res.send(false);
  }
});

app.post("/api/saveVitals", async (req, res) => {
  try {
    const { timestamp, fk_resident_id, vital_type, value } = req.body;
    pool.query(
      "INSERT INTO vitals (timestamp, fk_resident_id, vital_type, value) values ($1, $2, $3, $4)",
      [timestamp, fk_resident_id, vital_type, value],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(201).send("Vitals Saved");
      }
    );
  } catch (err) {
    console.log("addData: ", err);
    res.send(false);
  }
});

app.post("/api/saveEating", async (req, res) => {
  try {
    const { start_time, end_time, fk_resident_id, value, with_assistance } =
      req.body;
    pool.query(
      "INSERT INTO eating (start_time, end_time, fk_resident_id, value, with_assistance) values ($1, $2, $3, $4, $5)",
      [start_time, end_time, fk_resident_id, value, with_assistance],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(201).send("Eating Saved");
      }
    );
  } catch (err) {
    console.log("addData: ", err);
    res.send(false);
  }
});

app.post("/api/saveFluids", async (req, res) => {
  try {
    const { timestamp, fk_resident_id, value } = req.body;
    pool.query(
      "INSERT INTO fluids (timestamp, fk_resident_id, value) values ($1, $2, $3)",
      [timestamp, fk_resident_id, value],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(201).send("Fluids Saved");
      }
    );
  } catch (err) {
    console.log("addData: ", err);
    res.send(false);
  }
});

app.post("/api/saveBloodPressure", async (req, res) => {
  try {
    const { timestamp, fk_resident_id, sys, dia } = req.body;
    pool.query(
      "INSERT INTO blood_pressure (timestamp, fk_resident_id, sys, dia) values ($1, $2, $3, $4)",
      [timestamp, fk_resident_id, sys, dia],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(201).send("Blood Pressure Saved");
      }
    );
  } catch (err) {
    console.log("addData: ", err);
    res.send(false);
  }
});

app.post("/api/saveAmbulation", async (req, res) => {
  try {
    const { start_time, end_time, fk_resident_id, value } = req.body;
    pool.query(
      "INSERT INTO ambulation (start_time, end_time, fk_resident_id, activity_type) values ($1, $2, $3, $4)",
      [start_time, end_time, fk_resident_id, value],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(201).send("Ambulation Saved");
      }
    );
  } catch (err) {
    console.log("addData: ", err);
    res.send(false);
  }
});

app.post("/api/saveTakingMedication", async (req, res) => {
  try {
    const { timestamp, fk_prescription_id } = req.body;
    pool.query(
      "INSERT INTO taking_medication (timestamp, fk_prescription_id) values ($1, $2)",
      [timestamp, fk_prescription_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(201).send("Taking Medication Saved");
      }
    );
  } catch (err) {
    console.log("addData: ", err);
    res.send(false);
  }
});

app.post("/api/saveTakingOTC", async (req, res) => {
  try {
    const { timestamp, fk_otc_id, fk_resident_id } = req.body;
    pool.query(
      "INSERT INTO taking_otc (timestamp, fk_otc_id, fk_resident_id) values ($1, $2, $3)",
      [timestamp, fk_otc_id, fk_resident_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(201).send("Taking OTC Saved");
      }
    );
  } catch (err) {
    console.log("addData: ", err);
    res.send(false);
  }
});

app.post("/api/loadPrescriptions", async (req, res) => {
  try {
    const { resident_id } = req.body;
    pool.query(
      "select * from prescriptions where fk_resident_id=$1",
      [resident_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        const rows = [];
        for (let row of results.rows) {
          rows.push(row);
        }
        res.send(rows);
      }
    );
  } catch (err) {
    console.log("loadPrescriptions: ", err);
    res.send(false);
  }
});

app.post("/api/loadOTC", async (req, res) => {
  try {
    const results = await pool.query("select * from otc_medication");
    const rows = [];
    for (let row of results.rows) {
      rows.push(row);
    }
    res.send(rows);
  } catch (err) {
    console.log("loadOTC: ", err);
    res.send(false);
  }
});

app.post("/api/loadTakingOTC", async (req, res) => {
  try {
    const { resident_id } = req.body;
    pool.query(
      "select * from taking_otc where fk_resident_id=$1",
      [resident_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        const rows = [];
        for (let row of results.rows) {
          rows.push(row);
        }
        res.send(rows);
      }
    );
  } catch (err) {
    console.log("loadTakingOTC: ", err);
    res.send(false);
  }
});

app.post("/api/loadTakingOTCJSON", async (req, res) => {
  res.send([]);
});

app.post("/api/loadTakingMedication", async (req, res) => {
  try {
    const { resident_id } = req.body;
    pool.query(
      "select fk_prescription_id, timestamp from taking_medication left join prescriptions on taking_medication.fk_prescription_id=prescriptions.prescription_id where fk_resident_id=$1",
      [resident_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        const rows = [];
        for (let row of results.rows) {
          rows.push(row);
        }
        res.send(rows);
      }
    );
  } catch (err) {
    console.log("loadTakingMedication: ", err);
    res.send(false);
  }
});

app.post("/api/loadTakingMedicationJSON", async (req, res) => {
  const { resident_id } = req.body;
  try {
    pool.query(
      "select * from prescriptions where fk_resident_id=$1",
      [resident_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        const rows = [];
        for (let row of results.rows) {
          rows.push(row);
        }
        const prescription_ids = rows.map((row) => row.prescription_id);
        const data = medicationJSON["data"];
        const filtered_data = data.filter((row) =>
          prescription_ids.includes(row["fk_prescription_id"])
        );
        res.send(filtered_data);
      }
    );
  } catch (err) {
    console.log("loadPrescriptions: ", err);
    res.send(false);
  }
});

app.post("/api/loadAmbulation", async (req, res) => {
  try {
    const { resident_id } = req.body;
    pool.query(
      "select * from ambulation where fk_resident_id=$1",
      [resident_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        const rows = [];
        for (let row of results.rows) {
          // console.log(row);
          rows.push(row);
        }
        res.send(rows);
      }
    );
  } catch (err) {
    console.log("loadAmbulation: ", err);
    res.send(false);
  }
});

app.post("/api/loadAmbulationJSON", async (req, res) => {
  const { resident_id } = req.body;
  const data = ambulationJSON["data"];
  const filtered_data = data.filter(
    (row) => row["fk_resident_id"] === parseInt(resident_id)
  );
  res.send(filtered_data);
});

app.post("/api/loadBathroom", async (req, res) => {
  try {
    const { resident_id } = req.body;
    pool.query(
      "select * from binary_adls where fk_resident_id=$1 and adl_type='bathroom'",
      [resident_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        const rows = [];
        for (let row of results.rows) {
          rows.push(row);
        }
        res.send(rows);
      }
    );
  } catch (err) {
    console.log("loadBathroom: ", err);
    res.send(false);
  }
});

app.post("/api/loadBathroomJSON", async (req, res) => {
  const { resident_id } = req.body;
  const data = bathroomJSON["data"];
  const filtered_data = data.filter(
    (row) => row["fk_resident_id"] === parseInt(resident_id)
  );
  res.send(filtered_data);
});

app.post("/api/loadBloodPressure", async (req, res) => {
  try {
    const { resident_id } = req.body;
    pool.query(
      "select * from blood_pressure where fk_resident_id=$1",
      [resident_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        const rows = [];
        for (let row of results.rows) {
          // console.log(row);
          rows.push(row);
        }
        res.send(rows);
      }
    );
  } catch (err) {
    console.log("loadBloodPressure: ", err);
    res.send(false);
  }
});

app.post("/api/loadBloodPressureJSON", async (req, res) => {
  const { resident_id } = req.body;
  const data = blood_pressure["data"];
  const filtered_data = data.filter(
    (row) => row["fk_resident_id"] === parseInt(resident_id)
  );
  res.send(filtered_data);
});

app.post("/api/loadDressing", async (req, res) => {
  try {
    const { resident_id } = req.body;
    pool.query(
      "select * from binary_adls where fk_resident_id=$1 and adl_type='dressing'",
      [resident_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        const rows = [];
        for (let row of results.rows) {
          // console.log(row);
          rows.push(row);
        }
        res.send(rows);
      }
    );
  } catch (err) {
    console.log("loadDressing: ", err);
    res.send(false);
  }
});

app.post("/api/loadDressingJSON", async (req, res) => {
  const { resident_id } = req.body;
  const data = dressingJSON["data"];
  const filtered_data = data.filter(
    (row) => row["fk_resident_id"] === parseInt(resident_id)
  );
  res.send(filtered_data);
});

app.post("/api/loadEating", async (req, res) => {
  try {
    const { resident_id } = req.body;
    pool.query(
      "select * from eating where fk_resident_id=$1",
      [resident_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        const rows = [];
        for (let row of results.rows) {
          // console.log(row);
          rows.push(row);
        }
        res.send(rows);
      }
    );
  } catch (err) {
    console.log("loadEating: ", err);
    res.send(false);
  }
});

app.post("/api/loadEatingJSON", async (req, res) => {
  const { resident_id } = req.body;
  const data = eatingJSON["data"];
  const filtered_data = data.filter(
    (row) => row["fk_resident_id"] === parseInt(resident_id)
  );
  res.send(filtered_data);
});

app.post("/api/loadFluids", async (req, res) => {
  try {
    const { resident_id } = req.body;
    pool.query(
      "select * from fluids where fk_resident_id=$1",
      [resident_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        const rows = [];
        for (let row of results.rows) {
          // console.log(row);
          rows.push(row);
        }
        res.send(rows);
      }
    );
  } catch (err) {
    console.log("loadFluids: ", err);
    res.send(false);
  }
});

app.post("/api/loadFluidsJSON", async (req, res) => {
  const { resident_id } = req.body;
  const data = fluidJSON["data"];
  const filtered_data = data.filter(
    (row) => row["fk_resident_id"] === parseInt(resident_id)
  );
  res.send(filtered_data);
});

app.post("/api/loadGlucose", async (req, res) => {
  try {
    const { resident_id } = req.body;
    pool.query(
      "select * from vitals where fk_resident_id=$1 and vital_type='glucose'",
      [resident_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        const rows = [];
        for (let row of results.rows) {
          // console.log(row);
          rows.push(row);
        }
        res.send(rows);
      }
    );
  } catch (err) {
    console.log("loadGlucose: ", err);
    res.send(false);
  }
});

app.post("/api/loadGlucoseJSON", async (req, res) => {
  const { resident_id } = req.body;
  const data = glucoseJSON["data"];
  const filtered_data = data.filter(
    (row) => row["fk_resident_id"] === parseInt(resident_id)
  );
  res.send(filtered_data);
});

app.post("/api/loadHeartRate", async (req, res) => {
  try {
    const { resident_id } = req.body;
    pool.query(
      "select * from vitals where fk_resident_id=$1 and vital_type='heart_rate'",
      [resident_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        const rows = [];
        for (let row of results.rows) {
          // console.log(row);
          rows.push(row);
        }
        res.send(rows);
      }
    );
  } catch (err) {
    console.log("loadHeartRate: ", err);
    res.send(false);
  }
});

app.post("/api/loadHeartRateJSON", async (req, res) => {
  const { resident_id } = req.body;
  const data = heart_rateJSON["data"];
  const filtered_data = data.filter(
    (row) => row["fk_resident_id"] === parseInt(resident_id)
  );
  res.send(filtered_data);
});

app.post("/api/loadShowering", async (req, res) => {
  try {
    const { resident_id } = req.body;
    pool.query(
      "select * from binary_adls where fk_resident_id=$1 and adl_type='showering'",
      [resident_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        const rows = [];
        for (let row of results.rows) {
          // console.log(row);
          rows.push(row);
        }
        res.send(rows);
      }
    );
  } catch (err) {
    console.log("loadShowering: ", err);
    res.send(false);
  }
});

app.post("/api/loadShoweringJSON", async (req, res) => {
  const { resident_id } = req.body;
  const data = showeringJSON["data"];
  const filtered_data = data.filter(
    (row) => row["fk_resident_id"] === parseInt(resident_id)
  );
  res.send(filtered_data);
});

app.post("/api/loadWeight", async (req, res) => {
  try {
    const { resident_id } = req.body;
    pool.query(
      "select * from vitals where fk_resident_id=$1 and vital_type='weight'",
      [resident_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        const rows = [];
        for (let row of results.rows) {
          // console.log(row);
          rows.push(row);
        }
        res.send(rows);
      }
    );
  } catch (err) {
    console.log("loadWeight: ", err);
    res.send(false);
  }
});

app.post("/api/loadWeightJSON", async (req, res) => {
  const { resident_id } = req.body;
  const data = weightJSON["data"];
  const filtered_data = data.filter(
    (row) => row["fk_resident_id"] === parseInt(resident_id)
  );
  res.send(filtered_data);
});

app.post("/api/loadAllMedicationData", async (req, res) => {
  try {
    const { resident_id } = req.body;
    pool.query(
      "select * from prescriptions where fk_resident_id=$1",
      [resident_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        const prescription = [];
        for (let row of results.rows) {
          prescription.push(row);
        }
        if (prescription.length === 0) {
          res.send({ prescription: [], medication: [] });
        } else {
          let medication_ids = "(";
          prescription.forEach(function (d) {
            medication_ids += d.prescription_id + ", ";
          });

          medication_ids = medication_ids.substring(
            0,
            medication_ids.length - 2
          );
          medication_ids += ")";

          pool.query(
            "select * from taking_medication where fk_prescription_id in " +
              medication_ids,
            (error, results) => {
              if (error) {
                throw error;
              }
              const medication = [];
              for (let row of results.rows) {
                medication.push(row);
              }
              res.send({ prescription, medication });
            }
          );
        }
      }
    );
  } catch (err) {
    console.log("loadAllMedicationData: ", err);
    res.send(false);
  }
});

app.post("/api/loadAllMedicationDataJSON", async (req, res) => {
  try {
    const { resident_id } = req.body;
    pool.query(
      "select * from prescriptions where fk_resident_id=$1",
      [resident_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        const prescription = [];
        for (let row of results.rows) {
          prescription.push(row);
        }
        if (prescription.length === 0) {
          res.send({ prescription: [], medication: [] });
        } else {
          const pres_ids = prescription.map((d) => d.prescription_id);
          const data = medicationJSON["data"];
          const medication = data.filter((row) =>
            pres_ids.includes(row["fk_prescription_id"])
          );
          res.send({ prescription, medication });
        }
      }
    );
  } catch (err) {
    console.log("loadAllMedicationDataJSON: ", err);
    res.send(false);
  }
});

app.post("/api/loadAllBinaryADLs", async (req, res) => {
  try {
    const { resident_id } = req.body;
    pool.query(
      "select * from binary_adls where fk_resident_id=$1",
      [resident_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        const rows = [];
        for (let row of results.rows) {
          // console.log(row);
          rows.push(row);
        }
        res.send(rows);
      }
    );
  } catch (err) {
    console.log("loadAllBinaryADLs: ", err);
    res.send(false);
  }
});

app.post("/api/loadAllVitals", async (req, res) => {
  try {
    const { resident_id } = req.body;
    pool.query(
      "select * from vitals where fk_resident_id=$1",
      [resident_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        const rows = [];
        for (let row of results.rows) {
          // console.log(row);
          rows.push(row);
        }
        res.send(rows);
      }
    );
  } catch (err) {
    console.log("loadAllVitals: ", err);
    res.send(false);
  }
});

app.post("/api/runQuery", async (req, res) => {
  try {
    const { query } = req.body;
    // console.log("Query:", query);
    pool.query(query, [], (error, results) => {
      if (error) {
        throw error;
      }
      res.send(true);
    });
  } catch (err) {
    console.log("Run Query: ", err);
    res.send(false);
  }
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

module.exports = app;
