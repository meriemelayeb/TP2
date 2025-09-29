// Elements 
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const totalCount = document.getElementById('totalCount');
const doneCount = document.getElementById('doneCount');
const clearAllBtn = document.getElementById('clearAllBtn');
const searchInput = document.getElementById('searchInput');

const STORAGE_KEY = 'tp2_tasks_v1';

let tasks = [];

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    tasks = raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Erreur en chargeant les tâches', e);
    tasks = [];
  }
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,7);
}


function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  const task = {
    id: uid(),
    text: trimmed,
    done: false,
    createdAt: new Date().toISOString()
  };
  tasks.unshift(task); // latest first
  saveTasks();
  renderTasks();
  taskInput.value = '';
  taskInput.focus();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function toggleDone(id) {
  const t = tasks.find(x => x.id === id);
  if (!t) return;
  t.done = !t.done;
  saveTasks();
  renderTasks();
}

function clearAll() {
  if (!confirm('Supprimer toutes les tâches ?')) return;
  tasks = [];
  saveTasks();
  renderTasks();
}

function getFilteredTasks() {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) return tasks;
  return tasks.filter(t => t.text.toLowerCase().includes(q));
}

function renderTasks() {
  const list = getFilteredTasks();
  taskList.innerHTML = '';

  if (list.length === 0) {
    const div = document.createElement('div');
    div.className = 'no-tasks';
    div.textContent = 'Aucune tâche trouvée.';
    taskList.appendChild(div);
  } else {
    for (const t of list) {
      const li = document.createElement('li');
      li.className = 'task-item';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = t.done;
      checkbox.title = t.done ? 'Marquer comme non terminée' : 'Marquer comme terminée';
      checkbox.addEventListener('change', () => toggleDone(t.id));

      const span = document.createElement('div');
      span.className = 'task-text' + (t.done ? ' done' : '');
      span.textContent = t.text;

      const meta = document.createElement('div');
      meta.style.fontSize = '0.75rem';
      meta.style.marginLeft = '8px';
      meta.style.color = '#6b7280';
      meta.textContent = new Date(t.createdAt).toLocaleString();

      const doneBtn = document.createElement('button');
      doneBtn.className = 'small-btn';
      doneBtn.textContent = t.done ? 'Annuler' : 'Terminer';
      doneBtn.addEventListener('click', () => toggleDone(t.id));

      const delBtn = document.createElement('button');
      delBtn.className = 'small-btn danger';
      delBtn.textContent = 'Supprimer';
      delBtn.addEventListener('click', () => {
        if (confirm('Supprimer cette tâche ?')) deleteTask(t.id);
      });

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(meta);
      li.appendChild(doneBtn);
      li.appendChild(delBtn);

      taskList.appendChild(li);
    }
  }

  updateCounters();
}

function updateCounters() {
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  totalCount.textContent = `Total: ${total}`;
  doneCount.textContent = `Terminées: ${done}`;
}

addBtn.addEventListener('click', () => addTask(taskInput.value));
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask(taskInput.value);
});

searchInput.addEventListener('input', () => renderTasks());

clearAllBtn.addEventListener('click', clearAll);

// init
(function init() {
  console.log('ToDo app initialisation...');
  loadTasks();
  renderTasks();
})();
