import { getIconBufferFor } from "./_clima.js";

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
  const { buffer, mime } = await getIconBufferFor(Q_GUARATIBA, { force });
  setCors(res);
  res.setHeader("Content-Type", mime);
  res.setHeader("Content-Length", Buffer.isBuffer(buffer) ? buffer.length : Buffer.byteLength(buffer));
  res.setHeader("Content-Disposition", 'inline; filename="icone-guaratiba.png"');
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=60");
  res.status(200).send(buffer);
}