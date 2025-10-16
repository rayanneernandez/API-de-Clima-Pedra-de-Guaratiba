// Express app setup (bootstrap do server.js)
import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const API_KEY = process.env.WEATHER_API_KEY || "a540137ef0624555b57141528251610";
const TTL_MS = 5 * 60 * 1000; // 5 minutos
let ultimaAtualizacao = 0;

// Cache para o clima
let cacheClima = null;

// Função para buscar clima
async function atualizarClima() {
  try {
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
    } catch (e) {
      console.warn("Não foi possível obter o ícone:", e.message);
    }

    cacheClima = {
      cidade: "Pedra De Guaratiba",
      temperatura: Math.round(data.current.temp_c),
      descricao: data.current.condition.text,
      icone: iconUrl,
      icone_base64: iconeBase64
    };
    ultimaAtualizacao = Date.now();
    console.log("✅ Clima atualizado:", cacheClima);
  } catch (error) {
    if (error.response) {
      console.error("Erro da API:", error.response.data);
    } else {
      console.error("Erro:", error.message);
    }
  }
}

// Atualiza ao iniciar
atualizarClima();

// Atualiza a cada hora
// Atualiza a cada 5 minutos (antes era 60 minutos)
setInterval(atualizarClima, 5 * 60 * 1000);

// Rota /clima retorna o cache (atualiza se estiver fora do TTL)
app.get("/clima", async (req, res) => {
  if (!cacheClima || (Date.now() - ultimaAtualizacao > TTL_MS)) {
    await atualizarClima();
  }
  res.json(cacheClima);
});

// Rota HTML para texto com imagem embutida (usa PNG via /icone)
app.get("/clima/html", (req, res) => {
  if (!cacheClima) return res.status(503).send("Clima ainda não carregado");
  const { temperatura } = cacheClima;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<span>${temperatura}°C</span> <img src="/icone" style="height:24px;vertical-align:middle;">`);
});
// Rota de imagem (proxy do ícone atual)
app.get("/icone", async (req, res) => {
  try {
    if (!cacheClima || !cacheClima.icone) return res.status(503).send("Ícone não disponível");
    const resp = await axios.get(cacheClima.icone, { responseType: "arraybuffer" });
    const mime = resp.headers["content-type"] || "image/png";
    res.setHeader("Content-Type", mime);
    res.setHeader("Cache-Control", "no-store");
    res.send(resp.data);
  } catch (e) {
    console.error("Falha ao carregar ícone:", e.message);
    res.status(500).send("Falha ao carregar ícone");
  }
});
// CORS liberado para o editor carregar imagem e JSON
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
