import { readFileSync } from 'fs';
import path from 'path';

export default function handler(req, res) {
  console.log("Ambulation", process.cwd());
  const file = path.join(process.cwd(), 'data', 'ambulation.json');
  console.log(file);
  console.log(path.join(".."))
  const stringified = readFileSync(file, 'utf8');

  res.setHeader('Content-Type', 'application/json');
  return res.end(stringified);
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
