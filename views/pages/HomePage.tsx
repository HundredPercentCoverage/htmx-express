import { Todo } from "@prisma/client";
import RootLayout from "./layout";
import TodoList from "../components/TodoList";

interface Props {
  todos: Todo[];
}

const HomePage = ({ todos }: Props) => {
  return (
    <RootLayout title="Home">
      <main className="container">
        <h1>My Todo List</h1>
        <p>Todos:</p>
        <TodoList todos={todos} />
        <button hx-post="/todos" hx-target="#todo-list" hx-swap="beforeend">
          Add Todo
        </button>
      </main>
    </RootLayout>
  );
};

export default HomePage;
