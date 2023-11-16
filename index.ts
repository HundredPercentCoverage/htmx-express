import "dotenv/config";
import express from "express";
import ejs from "ejs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', './views');
app.set('view engine', 'ejs');

app.get("/", async(_, res) => {
  const todos = await prisma.todo.findMany();
  res.render('index', { title: 'Home', message: 'ToDo', todos });
});

app.get("/todos/:id", async (req, res) => {
  const todo = await prisma.todo.findUnique({ where: { id: Number(req.params.id) }});

  if (!todo) {
    return res.status(500).json({ message: "Error - no such item"});
  }

  const markup = await ejs.renderFile("./views/partials/todoitem.ejs", { todo });
  res.send(markup);
});

app.get("/todos/:id/edit", async (req, res) => {
  const todo = await prisma.todo.findUnique({ where: { id: Number(req.params.id) }});

  if (!todo) {
    return res.status(500).json({ message: "Error - no such item"});
  }

  const markup = await ejs.renderFile("./views/partials/todoedit.ejs", { todo });
  res.send(markup);
});

app.post("/todos", async (_, res) => {
  const todo = await prisma.todo.create({ data: { title: "New todo" }});

  const markup = await ejs.renderFile("./views/partials/todoitem.ejs", { todo });
  res.send(markup);
});

app.put("/todos/:id", async (req, res) => {
  // Check body with zod
  const { title } = req.body;

  const todo = await prisma.todo.update({ where: { id: Number(req.params.id) }, data: { title } });

  const markup = await ejs.renderFile("./views/partials/todoitem.ejs", { todo });
  res.send(markup);
});

app.delete("/todos/:id", async (req, res) => {
  await prisma.todo.delete({ where: { id: Number(req.params.id) } });
  res.send('');
});

app.listen(3000, () => {
  console.log(`App listening on port 3000`);
});
