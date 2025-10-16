import { getClima } from "./_clima.js";

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
  const { temperatura } = await getClima();
  setCors(res);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  // Em Vercel, /icone aponta para esta função serverless
  res.status(200).send(`<span>${temperatura}°C</span> <img src="/icone" style="height:24px;vertical-align:middle;">`);
}