import express from "express";

import type { NextFunction, Request, Response } from "express";
import { ExpressAuth, getSession } from "@auth/express";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import Google from "@auth/core/providers/google";
import type { Adapter } from "@auth/core/adapters";

export const prisma = new PrismaClient();

const adapter: Adapter = {
  ...PrismaAdapter(prisma),
};

export const authConfig = {
  adapter,
  providers: [
    Google({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    }),
  ],
};

const expressAuth = ExpressAuth(authConfig);

async function authSession(req: Request, res: Response, next: NextFunction) {
  res.locals.session = await getSession(req, authConfig);
  next();
}

const app = express();

app.use(express.json());

// If app is served through a proxy, trust the proxy to allow HTTPS protocol to be detected
app.use("trust proxy");
app.use(authSession);

app.use("/auth/*", expressAuth);

app.get("/", (_, res) =>
  res.status(200).send({ error: false, data: "Server Started Successfully" })
);

export default app;
