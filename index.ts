import "dotenv/config";
import express from "express";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import ejs from "ejs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import authRouter from "./routes/auth";
import passport from "passport";

const prisma = new PrismaClient();
const app = express();

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

app.use("/auth", authRouter);

app.set("views", "./views");
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  console.log("/ user", req.user);

  if (!req.isAuthenticated()) {
    return res.redirect("/auth/login");
  }

  const todos = await prisma.todo.findMany({
    where: { authorId: req.user.id },
  });
  res.render("index", { title: "Home", message: "ToDo", todos });
});

app.get("/todos/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(304).send("Unauthorised");
  }

  const todo = await prisma.todo.findUnique({
    where: { id: Number(req.params.id), authorId: req.user.id },
  });

  if (!todo) {
    return res.status(500).json({ message: "Error - no such item" });
  }

  const markup = await ejs.renderFile("./views/partials/todoitem.ejs", {
    todo,
  });
  res.send(markup);
});

app.get("/todos/:id/edit", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(304).send("Unauthorised");
  }

  const todo = await prisma.todo.findUnique({
    where: { id: Number(req.params.id), authorId: req.user.id },
  });

  if (!todo) {
    return res.status(500).json({ message: "Error - no such item" });
  }

  const markup = await ejs.renderFile("./views/partials/todoedit.ejs", {
    todo,
  });
  res.send(markup);
});

app.post("/todos", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(304).send("Unauthorised");
  }

  const todo = await prisma.todo.create({
    data: { title: "New todo", authorId: req.user.id },
  });

  const markup = await ejs.renderFile("./views/partials/todoitem.ejs", {
    todo,
  });
  res.send(markup);
});

app.put("/todos/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(304).send("Unauthorised");
  }
  // Check body with zod
  const { title } = req.body;

  const todo = await prisma.todo.update({
    where: { id: Number(req.params.id) },
    data: { title },
  });

  const markup = await ejs.renderFile("./views/partials/todoitem.ejs", {
    todo,
  });
  res.send(markup);
});

app.delete("/todos/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(304).send("Unauthorised");
  }
  await prisma.todo.delete({ where: { id: Number(req.params.id) } });
  res.send("");
});

app.listen(3000, () => {
  console.log(`App listening on port 3000`);
});
