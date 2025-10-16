import { getClimaFor } from "./_clima.js";

const Q_GUARATIBA = "-22.9978,-43.6464";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    setCors(res);
    return res.status(204).end();
  }
  const force = req.query.nocache === "1" || req.query.force === "1";
  const data = await getClimaFor(Q_GUARATIBA, { force });
  setCors(res);
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json(data);
}