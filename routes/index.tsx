import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import ejs, { name, render } from "ejs";
import { renderToStaticMarkup } from "react-dom/server";
import TestComponent from "../views/components/TestComponent";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req, res) => {
  console.log("/ user", req.user);

  if (!req.isAuthenticated()) {
    return res.redirect("/auth/login");
  }

  const todos = await prisma.todo.findMany({
    where: { authorId: req.user.id },
  });
  res.render("index", { title: "Home", message: "ToDo", todos });
});

router.get("/todos/:id", async (req, res) => {
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

router.get("/todos/:id/edit", async (req, res) => {
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

router.post("/todos", async (req, res) => {
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

router.put("/todos/:id", async (req, res) => {
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

router.delete("/todos/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(304).send("Unauthorised");
  }
  await prisma.todo.delete({ where: { id: Number(req.params.id) } });
  res.send("");
});

router.get("/test", (req, res) => {
  const markup = renderToStaticMarkup(<TestComponent name="hello" />);
  res.send(markup);
});

export default router;
