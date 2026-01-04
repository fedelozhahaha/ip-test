const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Webhook de Discord (usa variable de entorno en producción)
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

// Servir HTML desde /public
app.use(express.static(path.join(__dirname, "public")));

// Ruta /ip
app.get("/ip", async (req, res) => {
  const raw = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";

  // Separar todas las IPs
  const ips = raw.split(",").map(ip => ip.trim());

  // Responder al frontend primero
  res.json({ ips });

  // Construir mensaje para Discord con Hyperion.IP
  const message = ips
    .map((ip, index) => `Hyperion.IP ${index + 1}: ${ip}`)
    .join("\n");

  // Enviar a Discord
  try {
    if (DISCORD_WEBHOOK) {
      await fetch(DISCORD_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message })
      });
    } else {
      console.log("No webhook URL set in environment variable.");
    }
  } catch (err) {
    console.error("Error sending webhook:", err);
  }
});

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
