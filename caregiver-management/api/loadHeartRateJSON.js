import { readFileSync } from 'fs';

const file = require("../data/heart_rate.json");

export default function handler(req, res) {
  const stringified = readFileSync(file, 'utf8');

  res.setHeader('Content-Type', 'application/json');
  return res.end(stringified);
}