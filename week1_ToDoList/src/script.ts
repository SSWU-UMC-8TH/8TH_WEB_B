//HTML 요소 선택
const todoInput = document.getElementById('ToDo_input') as HTMLInputElement;
const todoform = document.getElementById('ToDo_form') as HTMLFormElement;
const todolist= document.getElementById('ToDo_list') as HTMLUListElement;
const donelist= document.getElementById('done_list') as HTMLUListElement;

//할 일이 어떻게 생긴애인지 Type을 정의
type Todo= {
    id: number;
    text: string;
};

let todos:Todo[] = [];
let doneTasks:Todo[] = [];

//할 일 목록 렌더링 하는 함수를 정의의
const renderTasks=():void => {
    todolist.innerHTML='';
    donelist.innerHTML='';

    todos.forEach((todo): void => {
        const li = createTodoElement(todo, false);
        todolist.appendChild(li);
    });
    doneTasks.forEach((todo): void => {
        const li = createTodoElement(todo, true);
        donelist.appendChild(li);
    });

};

//할 일 텍스트 입력 처리 필수. (공백 살려줌)
const getTodoText=(): string => {
    return todoInput.value.trim();
};

//할 일 추가 처리 필수
const addTodo=(text: string) : void => {
    todos.push({id: Date.now(), text});
    todoInput.value='';
    renderTasks();
};

//할 일 상태 변경(완료로 이용)
const compleTodo = (todo:Todo) : void => {
    todos = todos.filter((t): boolean => t.id !== todo.id);
    doneTasks.push(todo);
    renderTasks();
};

//완료된 할 일 삭제 함수
const deleteTodo = (todo: Todo): void => {
    doneTasks = doneTasks.filter((t): boolean => t.id !== todo.id);
    renderTasks();
};
//할 일 아이템 생성 함수 (완료 여부에 따라 버튼 텍스트나 색상 설정)
const createTodoElement = (todo: Todo, isDone: boolean): HTMLLIElement => {
    const li = document.createElement('li');
    li.classList.add('ToDoList_container_list');
    li.textContent=todo.text;

    const button = document.createElement('button');
    button.classList.add('ToDoList_continer_list_button');
    if (isDone) {
        button.textContent='삭제';
        button.style.backgroundColor = 'rgb(218, 4, 4)';
    } else {
        button.textContent = '완료';
        button.style.backgroundColor = 'rgb(30, 162, 30)';
    }

    button.addEventListener('click', ():void => {
        if (isDone) {
            deleteTodo(todo);
        } else {
            compleTodo(todo);
        }
    });

    li.appendChild(button);
    return li;
}

//폼 제출 이벤트 리스너
todoform.addEventListener('submit', (event: Event):void =>{
    event.preventDefault();
    const text = getTodoText();
    if (text) {
        addTodo(text);
    }
});
renderTasks();