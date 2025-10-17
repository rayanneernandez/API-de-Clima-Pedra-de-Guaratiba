import { getClimaFor } from "./_clima.js";

const Q_GUARATIBA = "-22.9978,-43.6464";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

// função: handler
export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    setCors(res);
    return res.status(204).end();
  }
  const { temperatura } = await getClimaFor(Q_GUARATIBA, { metric: "feelslike" });
  setCors(res);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).send(`<span>${temperatura}°C</span> <img src="/guaratiba/icone.png" style="height:24px;vertical-align:middle;">`);
}