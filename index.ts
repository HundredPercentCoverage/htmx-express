import express, { Response } from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import { v4 as uuidv4 } from "uuid";

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

app.set('views', './views');
app.set('view engine', 'ejs');

app.get("/", (req, res: HomeResponse) => {
  console.log("GET received");

  res.render('index', { title: 'Home', message: 'Potato', todos });
});

app.post("/todos", async (req, res) => {
  todos.push({ id: uuidv4(), name: "Fourth" });
  const markup = await ejs.renderFile('./views/partials/todos.ejs', { todos });
  res.send(markup);
});

app.delete("/todos/:id", async (req, res) => {
  todos = todos.filter(todo => todo.id !== req.params.id);
  const markup = await ejs.renderFile('./views/partials/todos.ejs', { todos });
  res.send(markup);
});

app.listen(3000, () => {
  console.log(`App listening on port 3000`);
});
