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
  const { temperatura } = await getClimaFor(Q_INHAUMA);
  setCors(res);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).send(`<span>${temperatura}°C</span> <img src="/inhauma/icone.png" style="height:24px;vertical-align:middle;">`);
}