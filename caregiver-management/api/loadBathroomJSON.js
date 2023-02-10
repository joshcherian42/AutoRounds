import { readFileSync } from 'fs';
import path from 'path';

export default function handler(req, res) {
  const file = path.join('..', 'data', 'bathroom.json');
  const stringified = readFileSync(file, 'utf8');

  res.setHeader('Content-Type', 'application/json');
  return res.end(stringified);
}
