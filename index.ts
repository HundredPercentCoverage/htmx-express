import express, { Response } from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import { v4 as uuidv4 } from "uuid";
import path from "path";

type ToDo = {
  name: string,
  id: string,
};

interface HomeResponse extends Omit<Response, 'render'> {
  render: (view: string, options?: { title: string, message: string, todos: ToDo[] }) => void;
};

let todos: ToDo[] = [
  {
    id: uuidv4(),
    name: "First",
  },
  {
    id: uuidv4(),
    name: "Second"
  },
  {
    id: uuidv4(),
    name: "Third",
  },
];

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', './views');
app.set('view engine', 'ejs');

app.get("/", (_, res: HomeResponse) => {
  res.render('index', { title: 'Home', message: 'ToDo', todos });
});

app.get("/todos/:id", async (req, res) => {
  const todo = todos.find(el => el.id === req.params.id);

  if (!todo) {
    return res.status(500).json({ message: "Error - no such item"});
  }

  const markup = await ejs.renderFile("./views/partials/todoitem.ejs", { todo });
  res.send(markup);
});

app.get("/todos/:id/edit", async (req, res) => {
  const todo = todos.find(el => el.id === req.params.id);

  if (!todo) {
    return res.status(500).json({ message: "Error - no such item"});
  }

  const markup = await ejs.renderFile("./views/partials/todoedit.ejs", { todo });
  res.send(markup);
});

app.post("/todos", async (_, res) => {
  todos.push({ id: uuidv4(), name: "Fourth" });

  const markup = await ejs.renderFile('./views/partials/todos.ejs', { todos });
  res.send(markup);
});

app.put("/todos/:id", async (req, res) => {
  // Check body with zod
  const { name } = req.body;
  const idx = todos.findIndex(todo => todo.id === req.params.id);

  if (idx < 0) {
    return res.status(500).json({ message: "Error - no such item"});
  }

  const updatedTodo: ToDo = { id: todos[idx].id, name };
  todos.splice(idx, 1, updatedTodo);

  const markup = await ejs.renderFile("./views/partials/todoitem.ejs", { todo: updatedTodo });
  res.send(markup);
});

app.delete("/todos/:id", async (req, res) => {
  todos = todos.filter(todo => todo.id !== req.params.id);
  res.send('');
});

app.listen(3000, () => {
  console.log(`App listening on port 3000`);
});
