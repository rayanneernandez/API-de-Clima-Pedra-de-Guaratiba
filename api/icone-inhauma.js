import { getIconBufferFor } from "./_clima.js";

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
  const { buffer, mime } = await getIconBufferFor(Q_INHAUMA);
  setCors(res);
  res.setHeader("Content-Type", mime);
  res.setHeader("Content-Length", Buffer.isBuffer(buffer) ? buffer.length : Buffer.byteLength(buffer));
  res.setHeader("Content-Disposition", 'inline; filename="icone-inhauma.png"');
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=60");
  res.status(200).send(buffer);
}