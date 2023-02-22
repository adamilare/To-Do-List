import './style.css';
import {
  addTodo,
  getTodos,
  updateTodo,
  getActiveTodosCount,
  removeTodo,
  clearTodos,
  clearCompletedTodos,
  updateTodoStatus,
} from './todo.js';

let todoListDiv;

function editing(e) {
  e.classList.toggle('fa-ellipsis-vertical');
  e.classList.toggle('fa-trash-can');

  if (e.classList.contains('fa-trash-can')) {
    e.addEventListener('click', () => {
      const parent = e.parentElement;
      const index = parseInt(parent.getAttribute('data-index'), 10);

      removeTodo(index);
      createTodos(); // eslint-disable-line no-use-before-define
    });
  }
}

function addListners(item) {
  const textarea = item.querySelector('textarea');
  const checkbox = item.querySelector("input[type='checkbox']");

  textarea.addEventListener('focus', (e) => {
    editing(e.target.parentElement.querySelector('i'));
  });

  textarea.addEventListener('blur', (e) => {
    editing(e.target.parentElement.querySelector('i'));
  });

  textarea.addEventListener('input', () => {
    textarea.rows = Math.ceil(textarea.scrollHeight / 20);
    updateTodo(
      textarea.parentElement.getAttribute('data-index'),
      textarea.value,
    );
  });

  checkbox.addEventListener('change', (e) => {
    if (e.target.checked) item.classList.add('completed');
    else item.classList.remove('completed');

    updateTodoStatus(item.getAttribute('data-index'));
  });
}

const createTodo = (todo) => {
  const newTodo = document.createElement('li');
  newTodo.classList.add('todo');
  newTodo.setAttribute('data-index', todo.index);
  newTodo.innerHTML = `<input type="checkbox"><textarea class="todo-description" rows="1">${todo.decription}</textarea><i class="todo-menu fa fa-ellipsis-vertical"></i>`;
  addListners(newTodo); // (newTodo.querySelector("textarea"));
  return newTodo;
};

function createTodos() {
  const todoListDiv = document.querySelector('.todos');
  todoListDiv.innerHTML = '';
  getTodos().forEach((todo) => {
    todoListDiv.appendChild(createTodo(todo));
  });
  const countElem = document.getElementById('active-count');
  countElem.innerHTML = getActiveTodosCount();
  if (getActiveTodosCount() <= 0) {
    countElem.hidden = true;
  }
}

const makeTodos = () => {
  const todoWrapper = document.getElementById('todo-main');
  const todoHeader = document.querySelector('.todo-header');
  const todoInput = document.createElement('div');
  todoListDiv = document.createElement('ul');
  const todoClear = document.createElement('div');

  const spanCount = document.createElement('span');
  spanCount.id = 'active-count';
  spanCount.innerHTML = getActiveTodosCount();
  todoHeader.appendChild(spanCount);
  if (getActiveTodosCount() <= 0) {
    todoHeader.querySelector('#active-count').hidden = true;
  }

  todoInput.classList.add('todo-input');
  todoInput.innerHTML = '<input id="add-todo" type="text" placeholder="Add to your list..."><i class="fa fa-arrow-turn-down"></i>';
  todoWrapper.appendChild(todoInput);

  todoListDiv.classList.add('todos');
  todoWrapper.appendChild(todoListDiv);
  createTodos();

  todoClear.classList.add('todo-clear');
  todoClear.innerHTML = '<span>Clear completed</span>';
  todoWrapper.appendChild(todoClear);
};

makeTodos();

document.querySelector('.todo-clear').addEventListener('click', () => {
  clearCompletedTodos();
  createTodos();
});

document.getElementById('clear-all').addEventListener('click', () => {
  clearTodos();
  createTodos();
});

document.getElementById('add-todo').addEventListener('input', (e) => {
  e.target.addEventListener('keydown', (event) => {
    if (event.keyCode === 13 && event.target.value !== '') {
      addTodo(event.target.value);
      event.target.value = '';
      createTodos();
    }
  });
});
