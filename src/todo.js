let todos = JSON.parse(localStorage.getItem('todos')) || [];

function updateLocalStorage() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function addTodo(decription) {
  const newTodo = { decription, completed: false, index: todos.length + 1 };
  todos.push(newTodo);
  updateLocalStorage();
  return newTodo;
}

function removeTodo(id) {
  id -= 1;
  todos = todos
    .filter((todo, ind) => id !== ind)
    .map((todo, ind) => ({
      ...todo,
      index: ind + 1,
    }));

  updateLocalStorage();
}

function updateTodo(index, text) {
  todos[index - 1].decription = text;
  updateLocalStorage();
}

function updateTodoStatus(index) {
  index -= 1;
  todos[index].completed = !todos[index].completed;
  updateLocalStorage();
}

function getTodos() {
  return todos;
}

function clearCompletedTodos() {
  todos = todos
    .filter((todo) => !todo.completed)
    .map((todo, index) => ({
      ...todo,
      index: index + 1,
    }));

  updateLocalStorage();
}

function clearTodos() {
  todos = [];
  updateLocalStorage();
}

function getActiveTodosCount() {
  const count = todos.reduce((acc, todo) => {
    if (!todo.completed) acc += 1;
    return acc;
  }, 0);

  return count > 0 ? count : '';
}

export {
  addTodo,
  removeTodo,
  updateTodo,
  updateTodoStatus,
  getTodos,
  clearCompletedTodos,
  clearTodos,
  getActiveTodosCount,
};
