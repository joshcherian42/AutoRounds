import { readFileSync } from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { resident_id } = req.body;
  const file = path.join(
    process.cwd(),
    "caregiver-management",
    "data",
    "medication.json"
  );
  const stringified = readFileSync(file, "utf8");
  const data = JSON.parse(stringified)["data"];
  const filtered_data = data.filter(
    (row) => row["fk_resident_id"] === parseInt(resident_id)
  );
  // res.setHeader("Content-Type", "application/json");
  res.send(filtered_data);
}
