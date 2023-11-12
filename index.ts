import express, { Response } from "express";
import bodyParser from "body-parser";
import ejs from 'ejs';

type ToDo = {
  name: string,
  id: number,
};

interface HomeResponse extends Omit<Response, 'render'> {
  render: (view: string, options?: { title: string, message: string, todos: ToDo[] }) => void;
};


const todos: ToDo[] = [
  {
    id: 1,
    name: "First",
  },
  {
    id: 2,
    name: "Second"
  },
  {
    id: 3,
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
  todos.push({ id: 4, name: "Fourth" });
  const markup = await ejs.renderFile('./views/partials/todos.ejs', { todos });
  res.send(markup);
});

app.listen(3000, () => {
  console.log(`App listening on port 3000`);
});
