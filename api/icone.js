import { getIconBuffer } from "./_clima.js";

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
    const { buffer, mime } = await getIconBuffer();
    setCors(res);
    res.setHeader("Content-Type", mime);
    // Cache na CDN por 5 min; revalida em background
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=60");
    res.status(200).send(buffer);
  } catch (e) {
    res.status(500).send("Falha ao carregar ícone");
  }
}