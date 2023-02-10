import { readFileSync, readFile } from "fs";
import path from "path";

export default function handler(req, res) {
  const { resident_id } = req.body;
  console.log("Resident ID:", resident_id);
  const file = path.join(
    process.cwd(),
    "caregiver-management",
    "data",
    "ambulation.json"
  );
  const stringified = readFileSync(file, "utf8");
  // const stringified = await readFile(file, "utf8");
  // console.log("Got:", stringified);

  //const stringified =
  //  '{"data": [{"fk_resident_id": 1, "start_time": "2022-01-01T16:57:00", "end_time": "2022-01-01T17:09:00", "activity_type": "light"}, {"fk_resident_id": 1, "start_time": "2022-01-01T21:08:00", "end_time": "2022-01-01T21:53:00", "activity_type": "light"}]}';

  const data = JSON.parse(stringified)["data"];
  // console.log("Data:", data);
  console.log("Got data");
  const filtered_data = data.filter(
    (row) => row["fk_resident_id"] === parseInt(resident_id)
  );

  res.setHeader("Content-Type", "application/json");
  res.send(filtered_data);
  // return res.end(filtered_data);
}
