import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/static', express.static(path.join(__dirname, 'public')));

// Home page for example.spec.ts
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
  <head>
    <title>My Test Site</title>
    <meta charset="utf-8" />
  </head>
  <body>
    <h1>Welcome</h1>
    <p>Home page served by src1 app.</p>
  </body>
</html>`);
});

// Minimal TodoMVC-like app to satisfy tests in demo-todo-app.spec.ts
// Uses localStorage key 'react-todos' with same schema as demo site
app.get('/todomvc', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>TodoMVC</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    .new-todo { width: 400px; padding: 10px; font-size: 16px; }
    .todo-list { list-style: none; padding: 0; width: 500px; }
    .todo-list li { display: flex; align-items: center; gap: 8px; padding: 6px 0; }
    .todo-list li.completed label { text-decoration: line-through; color: #777; }
  .todo-list li.editing label { display: none; }
  .todo-list li.editing .toggle { display: none; }
    .todo-list li.editing .edit { display: block; }
    .edit { display: none; width: 400px; padding: 6px; }
    .filters a { margin-right: 10px; }
    .filters .selected { font-weight: bold; }
    [data-testid="todo-count"] { margin-top: 10px; display: inline-block; }
    .toggle { cursor: pointer; }
    .clear-completed { display: none; }
    .clear-completed.show { display: inline-block; }
  </style>
</head>
<body>
  <section class="todoapp">
    <header class="header">
  <input class="new-todo" data-testid="new-todo" placeholder="What needs to be done?" autofocus />
    </header>
    <section class="main">
      <input id="toggle-all" class="toggle-all" type="checkbox" aria-label="Mark all as complete">
      <ul class="todo-list" data-testid="todo-item-container"></ul>
    </section>
    <footer class="footer">
      <span data-testid="todo-count">0 items left</span>
      <ul class="filters">
        <li><a href="#/" data-filter="all">All</a></li>
        <li><a href="#/active" data-filter="active">Active</a></li>
        <li><a href="#/completed" data-filter="completed">Completed</a></li>
      </ul>
      <button class="clear-completed">Clear completed</button>
    </footer>
  </section>
  <script>
  const STORAGE_KEY = 'react-todos';
  let cancelEdit = false;
    // Ensure storage key exists so JSON.parse(localStorage['react-todos']) is valid
    document.addEventListener('DOMContentLoaded', () => {
      if (localStorage.getItem(STORAGE_KEY) == null || localStorage.getItem(STORAGE_KEY) === 'undefined') {
      localStorage.setItem(STORAGE_KEY, '[]');
    }
    function loadTodos() {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
    }
    function saveTodos(todos) { localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)); }

    let todos = loadTodos();

  const newTodoInput = document.querySelector('.new-todo');
  // Ensure focus so getByPlaceholder is immediately locatable/interactable
  queueMicrotask(() => newTodoInput && newTodoInput.focus());
    const list = document.querySelector('.todo-list');
    const countEl = document.querySelector('[data-testid="todo-count"]');
    const clearBtn = document.querySelector('.clear-completed');
    const toggleAll = document.getElementById('toggle-all');

    function render() {
      const route = location.hash.replace('#/', '') || 'all';
      const filtered = todos.filter(t => route === 'all' || (route === 'active' && !t.completed) || (route === 'completed' && t.completed));
      list.innerHTML = '';
      filtered.forEach((t, idx) => {
        const li = document.createElement('li');
        li.dataset.testid = 'todo-item';
        li.setAttribute('data-testid', 'todo-item');
        if (t.completed) li.classList.add('completed');

        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.className = 'toggle';
        cb.checked = t.completed;
        cb.addEventListener('change', () => { t.completed = cb.checked; saveTodos(todos); render(); });
        li.appendChild(cb);

        const label = document.createElement('label');
        label.setAttribute('data-testid', 'todo-title');
        label.textContent = t.title;
        li.appendChild(label);

        const destroy = document.createElement('button');
        destroy.className = 'destroy';
        li.appendChild(destroy);

        li.addEventListener('dblclick', () => {
          li.classList.add('editing');
          editInput.style.display = 'block';
          editInput.focus();
          editInput.select();
        });

        const editInput = document.createElement('input');
        editInput.className = 'edit';
        editInput.setAttribute('aria-label', 'Edit');
        editInput.value = t.title;
        editInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            const val = editInput.value.trim();
            if (val === '') {
              const idxInAll = todos.indexOf(t);
              todos.splice(idxInAll, 1);
            } else {
              t.title = val.trim();
            }
            saveTodos(todos);
            render();
          } else if (e.key === 'Escape') {
            cancelEdit = true;
            render();
          }
        });
        editInput.addEventListener('blur', () => {
          if (cancelEdit) { cancelEdit = false; return; }
          if (!li.classList.contains('editing')) return;
          const val = editInput.value.trim();
          if (val !== '') { t.title = val; }
          saveTodos(todos);
          render();
        });
        li.appendChild(editInput);

        list.appendChild(li);
      });
  const remaining = todos.filter(t => !t.completed).length;
  countEl.textContent = remaining + ' items left';

  // update toggle-all checked state
  toggleAll.checked = todos.length > 0 && todos.every(t => t.completed);

      const anyCompleted = todos.some(t => t.completed);
      clearBtn.classList.toggle('show', anyCompleted);

      // update selected filter link
      document.querySelectorAll('.filters a').forEach(a => a.classList.remove('selected'));
      const map = { all: 0, active: 1, completed: 2 };
      const links = document.querySelectorAll('.filters a');
      links[map[route]].classList.add('selected');
    }

      newTodoInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = newTodoInput.value.trim();
        if (val) {
          todos.push({ title: val, completed: false });
          saveTodos(todos);
          newTodoInput.value = '';
          render();
        }
      }
    });

    clearBtn.addEventListener('click', () => {
      todos = todos.filter(t => !t.completed);
      saveTodos(todos);
      render();
    });

    toggleAll.addEventListener('change', () => {
      const checked = toggleAll.checked;
      todos.forEach(t => t.completed = checked);
      saveTodos(todos);
      render();
    });

      window.addEventListener('hashchange', render);
      render();
    });
  </script>
</body>
</html>`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('src1 app listening on port ' + port);
});
