import { readFileSync, existsSync, readdirSync } from "fs";
import path from "path";

export default function handler(req, res) {

  console.log("----Process cwd")
  readdirSync(path.join(process.cwd())).forEach((file) => {
    console.log(file);
  });
  console.log("\n\n");

  console.log("----blank")
  readdirSync(path.join()).forEach((file) => {
    console.log(file);
  });
  console.log("\n\n");

  console.log("----Caregiver management")
  readdirSync(path.join("caregiver-management")).forEach((file) => {
    console.log(file);
  });
  console.log("\n\n");

  console.log("----Caregiver management data")
  readdirSync(path.join("caregiver-management", "data")).forEach((file) => {
    console.log(file);
  });
  console.log("\n\n");

  // const file = path.join(process.cwd(), "data", "ambulation.json");
  // const stringified = readFileSync(file, "utf8");

  // const fileContents = await fs.readFile(jsonDirectory + '/data.json', 'utf8');

  const stringified =
    '{"data": [{"fk_resident_id": 1, "start_time": "2022-01-01T16:57:00", "end_time": "2022-01-01T17:09:00", "activity_type": "light"}, {"fk_resident_id": 1, "start_time": "2022-01-01T21:08:00", "end_time": "2022-01-01T21:53:00", "activity_type": "light"}]}';

  const data = JSON.parse(stringified)["data"];
  const filtered_data = data.filter(
    (row) => row["fk_resident_id"] === parseInt(resident_id)
  );

  res.setHeader("Content-Type", "application/json");
  return res.end(filtered_data);
}