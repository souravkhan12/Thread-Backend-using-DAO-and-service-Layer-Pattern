import express from "express";
const app = express();

const PORT = Number(process.env.PORT) || 8000;

app.get("/", (req, res) => {
  res.json({ message: "server is up and runing" });
});

app.listen(PORT, () => console.log("server started"));
