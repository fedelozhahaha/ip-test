const express = require("express");
const https = require("https");
const app = express();

app.get("/ip", (req, res) => {
  https.get("https://api.ipify.org?format=json", response => {
    let data = "";
    response.on("data", chunk => data += chunk);
    response.on("end", () => {
      res.json(JSON.parse(data));
    });
  });
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
