// 1. HTML 요소 선택
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoForm = document.getElementById('todo-form') as HTMLFormElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const doneList = document.getElementById('done-list') as HTMLUListElement;

// 2. 할 일 Type 정의
type Todo = {
    id: number;
    text: string;
};
let todos: Todo[] = [];
let doneTasks: Todo[] = [];

// 3. 할 일 목록 렌더링 함수
const renderTasks = (): void => {
    todoList.innerHTML = '';
    doneList.innerHTML = '';

    todos.forEach((todo): void => {
        const li = createTodoElement(todo, false);
        todoList.appendChild(li);
    });

    doneTasks.forEach((todo): void => {
        const li = createTodoElement(todo, true);
        doneList.appendChild(li); // ✅ todoList가 아니라 doneList에 추가!
    });
};

// 4. 할 일 추가 처리 함수
const addTodo = (text: string): void => {
    todos.push({ id: Date.now(), text });
    todoInput.value = '';
    renderTasks();
};

// 5. 할 일 완료 처리 함수 (완료된 리스트로 이동)
const completeTodo = (todo: Todo): void => {
    console.log("완료된 할 일:", todo); // 디버깅용
    todos = todos.filter((t): boolean => t.id !== todo.id);
    doneTasks.push(todo);
    renderTasks();
};

// 6. 완료된 할 일 삭제 함수
const deleteTodo = (todo: Todo): void => {
    doneTasks = doneTasks.filter((t): boolean => t.id !== todo.id);
    renderTasks();
};

// 7. 할 일 아이템 생성 함수
const createTodoElement = (todo: Todo, isDone: boolean): HTMLLIElement => {
    const li = document.createElement('li');
    li.classList.add('render-container_item');
    li.textContent = todo.text;

    const button = document.createElement('button');
    button.classList.add('render-container_item-button');

    if (isDone) {
        button.textContent = '삭제';
        button.style.backgroundColor = '#dc3545';
    } else {
        button.textContent = '완료';
        button.style.backgroundColor = '#28a745';
    }

    button.addEventListener('click', (): void => {
        if (isDone) {
            deleteTodo(todo);
        } else {
            completeTodo(todo);
        }
    });

    li.appendChild(button);
    return li;
};

// 8. 폼 제출 이벤트 리스너
todoForm.addEventListener('submit', (event: Event): void => {
    event.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
        addTodo(text);
    }
});

// 초기 렌더링
renderTasks();
