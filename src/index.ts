import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());

  // create gql server
  const gqlServer = new ApolloServer({
    typeDefs: `
      type Query {
        hello:String
        say(name:String):String
      }
    `,
    resolvers: {
      Query: {
        hello: () => "Hello World",
        say: (_, { name }: { name: String }) => `Hello ${name}`,
      },
    },
  });

  await gqlServer.start();

  app.use("/graphql", expressMiddleware(gqlServer));

  app.get("/", (req, res) => {
    res.json({ message: "server is up and runing" });
  });

  app.listen(PORT, () => console.log("server started"));
}

init();
