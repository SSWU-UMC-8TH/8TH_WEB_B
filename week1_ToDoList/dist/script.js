"use strict";
const todoInput = document.getElementById('ToDo_input');
const todoform = document.getElementById('ToDo_form');
const todolist = document.getElementById('ToDo_list');
const donelist = document.getElementById('done_list');
let todos = [];
let doneTasks = [];
const renderTasks = () => {
    todolist.innerHTML = '';
    donelist.innerHTML = '';
    todos.forEach((todo) => {
        const li = createTodoElement(todo, false);
        todolist.appendChild(li);
    });
    doneTasks.forEach((todo) => {
        const li = createTodoElement(todo, true);
        donelist.appendChild(li);
    });
};
const getTodoText = () => {
    return todoInput.value.trim();
};
const addTodo = (text) => {
    todos.push({ id: Date.now(), text });
    todoInput.value = '';
    renderTasks();
};
const compleTodo = (todo) => {
    todos = todos.filter((t) => t.id !== todo.id);
    doneTasks.push(todo);
    renderTasks();
};
const deleteTodo = (todo) => {
    doneTasks = doneTasks.filter((t) => t.id !== todo.id);
    renderTasks();
};
const createTodoElement = (todo, isDone) => {
    const li = document.createElement('li');
    li.classList.add('ToDoList_container_list');
    li.textContent = todo.text;
    const button = document.createElement('button');
    button.classList.add('ToDoList_continer_list_button');
    if (isDone) {
        button.textContent = '삭제';
        button.style.backgroundColor = 'rgb(218, 4, 4)';
    }
    else {
        button.textContent = '완료';
        button.style.backgroundColor = 'rgb(30, 162, 30)';
    }
    button.addEventListener('click', () => {
        if (isDone) {
            deleteTodo(todo);
        }
        else {
            compleTodo(todo);
        }
    });
    li.appendChild(button);
    return li;
};
todoform.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = getTodoText();
    if (text) {
        addTodo(text);
    }
});
renderTasks();
