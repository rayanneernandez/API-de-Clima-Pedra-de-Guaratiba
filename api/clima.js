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
  try {
    const clima = await getClima();
    setCors(res);
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(clima);
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
}