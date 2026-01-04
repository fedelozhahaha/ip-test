const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ⚠️ WEBHOOK (rotalo después)
const DISCORD_WEBHOOK =
  "https://discordapp.com/api/webhooks/1457199874100432970/2MP1g97e4ngqalHL7L6GsFtkV2RAvFk2JAkHkspnzizKmQ7HKr8b77msdiGxE4YTIzTf";

// Servir HTML desde /public
app.use(express.static(path.join(__dirname, "public")));

// Ruta /ip
app.get("/ip", async (req, res) => {
  const raw =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";

  // Separar todas las IPs
  const ips = raw.split(",").map(ip => ip.trim());

  // Mensaje para Discord
  const message = `
📡 **Nueva visita**
🌍 **IPs detectadas**
${ips.map(ip => `• ${ip}`).join("\n")}
🕒 ${new Date().toLocaleString()}
`;

  // Enviar a Discord
  try {
    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message })
    });
  } catch (err) {
    console.error("Error enviando webhook:", err);
  }

  // Respuesta al frontend
  res.json({ ips });
});

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
