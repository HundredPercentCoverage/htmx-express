import { Todo } from "@prisma/client";

interface Props {
  todo: Todo;
}

const TodoEditForm = ({ todo }: Props) => {
  return (
    <form hx-put={`/todos/${todo.id}`} hx-target="this" hx-swap="outerHTML">
      <div>
        <label>Name</label>
        <input type="text" name="title" id="todo-title" value={todo.title} />
      </div>
      <button type="submit">Submit</button>
      <button hx-get={`/todos/${todo.id}`}>Cancel</button>
    </form>
  );
};

export default TodoEditForm;
