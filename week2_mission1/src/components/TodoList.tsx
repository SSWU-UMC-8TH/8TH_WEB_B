import { TTodo } from "../types/todo";

interface TodoListProps {
    title: string;
    todos?: TTodo[];
    buttonLabel: string;
    buttonColor: string;
    onClick: (todo:TTodo) => void;
}

export const TodoList = ({title, todos, buttonLabel, buttonColor, onClick}: TodoListProps) => {
  return (
    <div className="render-container__section">
        <h2 className="render-container__title">{title}</h2>
        <ul id="todo-list" className="render-container__list">
            {todos?.map((todo): any =>(
                <li key={todo.id} className="render-container_item">
                    <span className="render-container__item">{todo.text}
                    <button onClick={(): void => onClick(todo)} style={{backgroundColor: buttonColor }} className="render-container__item-button">{buttonLabel}</button>
                    </span>
                </li>
            ))}
        </ul>
    </div>
  )
}
