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

const createTodo = (todo) => {
  const newTodo = document.createElement('li');
  newTodo.classList.add('todo');
  newTodo.setAttribute('data-index', todo.index);
  newTodo.innerHTML = `<input type="checkbox"><textarea class="todo-description" rows="1">${todo.decription}</textarea><i class="todo-menu fa fa-ellipsis-vertical"></i>`;
  return newTodo;
};

// initial render
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
  getTodos().forEach((todo) => {
    todoListDiv.appendChild(createTodo(todo));
  });
  todoWrapper.appendChild(todoListDiv);

  todoClear.classList.add('todo-clear');
  todoClear.innerHTML = '<span>Clear completed</span>';
  todoWrapper.appendChild(todoClear);
};

makeTodos();

const activeCountSpan = document.getElementById('active-count');

function updateCount() {
  const activeCount = getActiveTodosCount();

  if (activeCount <= 0) {
    activeCountSpan.hidden = true;
  } else {
    activeCountSpan.hidden = false;
    activeCountSpan.innerHTML = activeCount;
  }
}

function editing(e) {
  e.classList.toggle('fa-ellipsis-vertical');
  e.classList.toggle('fa-trash-can');

  if (e.classList.contains('fa-trash-can')) {
    e.addEventListener('click', () => {
      const parent = e.parentElement;
      const index = parseInt(parent.getAttribute('data-index'), 10);

      removeTodo(index);
      parent.remove();
      updateCount();
    });
  }
}

const refreshListeners = () => {
  document.querySelectorAll('textarea').forEach((item) => {
    item.addEventListener('focus', (e) => {
      editing(e.target.parentElement.querySelector('i'));
    });

    item.addEventListener('blur', (e) => {
      editing(e.target.parentElement.querySelector('i'));
    });

    item.addEventListener('input', (e) => {
      const textarea = e.target;
      textarea.rows = Math.ceil(textarea.scrollHeight / 20);
      updateTodo(
        textarea.parentElement.getAttribute('data-index'),
        textarea.value,
      );
    });
  });

  document.querySelectorAll('input[type="checkbox"]').forEach((item) => {
    item.addEventListener('change', (e) => {
      const parent = e.target.parentElement;
      if (e.target.checked) {
        parent.classList.add('completed');
      } else {
        parent.classList.remove('completed');
      }

      updateTodoStatus(parent.getAttribute('data-index'));
      updateCount();
    });
  });
};

refreshListeners();

const addNewTodo = (text) => {
  todoListDiv.appendChild(createTodo(addTodo(text)));
  updateCount();
  refreshListeners();
};

document.querySelector('.todo-clear').addEventListener('click', () => {
  clearCompletedTodos();
  document.querySelectorAll('.completed').forEach((item) => {
    item.remove();
  });
});

document.getElementById('clear-all').addEventListener('click', () => {
  clearTodos();
  document.querySelectorAll('.todo').forEach((item) => {
    item.remove();
  });
  updateCount();
});

document.getElementById('add-todo').addEventListener('input', (e) => {
  e.target.addEventListener('keydown', (event) => {
    if (event.keyCode === 13 && event.target.value !== '') {
      addNewTodo(event.target.value);
      event.target.value = '';
    }
  });
});
