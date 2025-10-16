import axios from "axios";

const API_KEY = process.env.WEATHER_API_KEY || "a540137ef0624555b57141528251610";
const TTL_MS = 5 * 60 * 1000; // 5 minutos
const cache = new Map();

function isExpired(ts) {
  return Date.now() - ts > TTL_MS;
}

function resolveQ(qParam) {
  return qParam;
}

// Busca e cacheia o dado base (inclui temp real e aparente)
async function fetchBase(q) {
  const { data } = await axios.get(
    `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${q}&lang=pt`
  );
  const base = {
    cidade_raw: data.location?.name || "",
    temperatura_real: Math.round(data.current.temp_c),
    temperatura_aparente: Math.round(data.current.feelslike_c),
    descricao: data.current.condition.text,
    icone: `https:${data.current.condition.icon}`,
    atualizado_em: data.current.last_updated,
    localtime: data.location?.localtime
  };
  cache.set(q, { data: base, ts: Date.now() });
  return base;
}

function buildResult(base, { metric = "real", displayName }) {
  const temperatura =
    metric === "feelslike" ? base.temperatura_aparente : base.temperatura_real;
  return {
    cidade: displayName || base.cidade_raw,
    temperatura,
    temperatura_real: base.temperatura_real,
    temperatura_aparente: base.temperatura_aparente,
    descricao: base.descricao,
    icone: base.icone,
    atualizado_em: base.atualizado_em,
    localtime: base.localtime
  };
}

export async function getClimaFor(qParam, { force = false, metric = "real", displayName } = {}) {
  const q = resolveQ(qParam);
  const item = cache.get(q);
  const base = force || !item || isExpired(item.ts) ? await fetchBase(q) : item.data;
  return buildResult(base, { metric, displayName });
}

export async function getIconBufferFor(qParam, { force = false } = {}) {
  const q = resolveQ(qParam);
  const item = cache.get(q);
  if (force || !item || isExpired(item.ts)) {
    await fetchBase(q);
  }
  const base = cache.get(q).data;
  const resp = await axios.get(base.icone, { responseType: "arraybuffer" });
  const mime = resp.headers["content-type"] || "image/png";
  return { buffer: resp.data, mime };
}