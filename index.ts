import "dotenv/config";
import express from "express";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import path from "path";
import { PrismaClient } from "@prisma/client";
import authRouter from "./routes/auth";
import indexRouter from "./routes/index";
import passport from "passport";
import livereload from "livereload";
import connectLivereload from "connect-livereload";

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
const prisma = new PrismaClient();
const app = express();

app.use(connectLivereload({ port: 35729 }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
    secret: process.env.COOKIE_SECRET as string,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
app.use(passport.authenticate("session"));
app.set("views", "./views");
app.set("view engine", "ejs");

app.use("/auth", authRouter);
app.use("/", indexRouter);

app.listen(3000, () => {
  console.log(`App listening on port 3000`);
});
