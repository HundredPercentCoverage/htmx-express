import { Todo } from "@prisma/client";

interface Props {
  todo: Todo;
}

const TodoItem = ({ todo }: Props) => {
  return (
    <li hx-target="this" hx-swap="outerHTML">
      <p>{todo.title}</p>
      <button hx-get="<%= `/todos/${todo.id}/edit` %>">Edit</button>
      <button hx-delete="<%= `/todos/${todo.id}` %>">Delete</button>
    </li>
  );
};

export default TodoItem;
