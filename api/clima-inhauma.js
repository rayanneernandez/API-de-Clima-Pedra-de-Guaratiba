import { getClimaFor } from "./_clima.js";

const Q_INHAUMA = "-22.8775778,-43.2858502";

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
  const metric = req.query.metric || "feelslike"; //sensação térmica
  const data = await getClimaFor(Q_INHAUMA, { force, metric, displayName: "Inhaúma, Rio de Janeiro" });
  setCors(res);
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json(data);
}