const express = require("express");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 3000;

// Servir archivos estáticos (index.html, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Ruta /ip para devolver la IP
app.get("/ip", (req, res) => {
  // Obtener IP del visitante
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  res.json({ ip });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
