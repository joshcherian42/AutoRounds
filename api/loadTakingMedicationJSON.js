import { readFileSync } from "fs";
import path from "path";

export default function handler(req, res) {
  const { prescription_ids } = req.body;
  const file = path.join(process.cwd(), "data", "medication.json");
  const stringified = readFileSync(file, "utf8");
  const data = JSON.parse(stringified)["data"]; // data is filtered by website
  const filtered_data = data.filter((row) =>
    prescription_ids.includes(row["fk_prescription_id"])
  );
  // res.setHeader("Content-Type", "application/json");
  res.send(filtered_data);
}
