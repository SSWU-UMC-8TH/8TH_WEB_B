import { FormEvent } from 'react';

interface TodoFormProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const TodoForm = ({ input, setInput, handleSubmit }: TodoFormProps) => {
  return (
    <form onSubmit={handleSubmit} className="todo-container__form">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        type="text"
        className="todo-container__input"
        placeholder="할 일 입력"
        required
      />
      <button type="submit" className="todo-container__button">
        할일 추가
      </button>
    </form>
  );
};

export default TodoForm;