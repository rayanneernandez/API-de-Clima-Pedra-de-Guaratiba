import axios from "axios";

const API_KEY = process.env.WEATHER_API_KEY || "a540137ef0624555b57141528251610";
const TTL_MS = 5 * 60 * 1000; // 5 minutos
let cacheClima = null;
let ultimaAtualizacao = 0;

async function atualizarClima() {
  const latitude = -22.9978;
  const longitude = -43.6464;

  const { data } = await axios.get(
    `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}&lang=pt`
  );

  const iconUrl = `https:${data.current.condition.icon}`;
  let iconeBase64 = null;
  try {
    const imgResp = await axios.get(iconUrl, { responseType: "arraybuffer" });
    const mime = imgResp.headers["content-type"] || "image/png";
    iconeBase64 = `data:${mime};base64,${Buffer.from(imgResp.data).toString("base64")}`;
  } catch {
    // se falhar base64, seguimos só com URL
  }

  cacheClima = {
    cidade: "Pedra De Guaratiba",
    temperatura: Math.round(data.current.temp_c),
    descricao: data.current.condition.text,
    icone: iconUrl,
    icone_base64: iconeBase64
  };
  ultimaAtualizacao = Date.now();
}

export async function getClima() {
  if (!cacheClima || Date.now() - ultimaAtualizacao > TTL_MS) {
    await atualizarClima();
  }
  return cacheClima;
}

export async function getIconBuffer() {
  const clima = await getClima();
  const resp = await axios.get(clima.icone, { responseType: "arraybuffer" });
  const mime = resp.headers["content-type"] || "image/png";
  return { buffer: resp.data, mime };
}

export const ttlMs = TTL_MS;