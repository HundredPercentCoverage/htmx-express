import { Todo } from "@prisma/client";
import TodoItem from "./TodoItem";

interface Props {
  todos: Todo[];
}

const TodoList = ({ todos }: Props) => {
  return (
    <ul className="todo-list" id="todo-list">
      {todos.map((todo) => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
    </ul>
  );
};
export default TodoList;
