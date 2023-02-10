import { readFileSync, existsSync, readdirSync } from "fs";
import path from "path";

export default function handler(req, res) {
  console.log(
    "Ambulation",
    existsSync(path.join()),
    existsSync(path.join("data")),
    existsSync(path.join("data", "ambulation.json"))
  );
  console.log(
    "Process CWD",
    existsSync(path.join(process.cwd())),
    existsSync(path.join(process.cwd(), "data")),
    existsSync(path.join(process.cwd(), "data", "ambulation.json"))
  );

  console.log(
    "Relative",
    existsSync(path.join("..")),
    existsSync(path.join("..", "data")),
    existsSync(path.join("..", "data", "ambulation.json"))
  );

  console.log(
    "Process CWD .. ..",
    existsSync(path.join(process.cwd())),
    existsSync(path.join(process.cwd(), "..", "data")),
    existsSync(path.join(process.cwd(), "..", "..")),
    existsSync(path.join(process.cwd(), "..", "..", "data")),
    existsSync(path.join(process.cwd(), "..", "..", "data", "ambulation.json"))
  );

  readdirSync(path.join(process.cwd())).forEach(file => {
    console.log(file);
  });
  
  readdirSync(path.join()).forEach(file => {
    console.log(file);
  });

  readdirSync(path.join("..")).forEach(file => {
    console.log(file);
  });

  readdirSync(path.join("..", "..")).forEach(file => {
    console.log(file);
  });

  // const file = path.join(process.cwd(), "data", "ambulation.json");
  // const stringified = readFileSync(file, "utf8");

  res.setHeader("Content-Type", "application/json");
  // return res.end(stringified);
  const example =
    '{"data": [{"fk_resident_id": 1, "start_time": "2022-01-01T16:57:00", "end_time": "2022-01-01T17:09:00", "activity_type": "light"}, {"fk_resident_id": 1, "start_time": "2022-01-01T21:08:00", "end_time": "2022-01-01T21:53:00", "activity_type": "light"}]}';

  return res.end(example);
}

// import path from 'path';
// import { promises as fs } from 'fs';

// export default async function handler(req, res) {
//   //Find the absolute path of the json directory
//   const jsonDirectory = path.join('data');
//   //Read the json data file data.json
//   const fileContents = await fs.readFile(jsonDirectory + '/ambulation.json', 'utf8');
//   //Return the content of the data file in json format
//   res.status(200).json(fileContents);
// }
