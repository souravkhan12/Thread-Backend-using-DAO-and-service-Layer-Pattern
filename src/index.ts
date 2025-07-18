import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";

const app = express();

const PORT = Number(process.env.PORT) || 8000;

app.get("/", (req, res) => {
  res.json({ message: "server is up and runing" });
});

app.listen(PORT, () => console.log("server started"));
