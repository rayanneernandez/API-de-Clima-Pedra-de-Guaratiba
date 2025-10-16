import axios from "axios";

const API_KEY = process.env.WEATHER_API_KEY || "a540137ef0624555b57141528251610";
const TTL_MS = 5 * 60 * 1000; // 5 minutos

// Cache por 'q' (lat,lon)
const cache = new Map();

function isExpired(ts) {
  return Date.now() - ts > TTL_MS;
}

export async function getClimaFor(q) {
  const item = cache.get(q);
  if (!item || isExpired(item.ts)) {
    const { data } = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${q}&lang=pt`
    );
    const iconUrl = `https:${data.current.condition.icon}`;
    const clima = {
      cidade: data.location?.name || "",
      temperatura: Math.round(data.current.temp_c),
      descricao: data.current.condition.text,
      icone: iconUrl
    };
    cache.set(q, { data: clima, ts: Date.now() });
    return clima;
  }
  return item.data;
}

export async function getIconBufferFor(q) {
  const clima = await getClimaFor(q);
  const resp = await axios.get(clima.icone, { responseType: "arraybuffer" });
  const mime = resp.headers["content-type"] || "image/png";
  const buffer = Buffer.from(resp.data);
  return { buffer, mime };
}