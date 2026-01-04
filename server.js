const express = require("express");
const path = require("path");
const app = express();

// Puerto dinámico para Render, fallback a 3000 local
const PORT = process.env.PORT || 3000;

// Servir todos los archivos de la carpeta public
app.use(express.static(path.join(__dirname, "public")));

// Ruta /ip para devolver la IP del visitante
app.get("/ip", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  res.json({ ip });
});

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
