/**
 * storage.js — LocalStorage helpers for tasks and theme
 */

const StorageKeys = {
  TASKS: "taskManager_tasks",
  THEME: "taskManager_theme",
  INITIALIZED: "taskManager_initialized",
};

/** Read JSON from localStorage safely */
function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/** Save JSON to localStorage */
function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/** Get saved theme preference */
function getTheme() {
  return localStorage.getItem(StorageKeys.THEME) || "light";
}

/** Persist theme choice */
function setTheme(theme) {
  localStorage.setItem(StorageKeys.THEME, theme);
}

/** Load all tasks from storage */
function loadTasks() {
  return loadJSON(StorageKeys.TASKS, []);
}

/** Save tasks array */
function saveTasks(tasks) {
  saveJSON(StorageKeys.TASKS, tasks);
}

/** Check if app has been opened before */
function isFirstVisit() {
  return !localStorage.getItem(StorageKeys.INITIALIZED);
}

/** Mark first visit complete */
function markInitialized() {
  localStorage.setItem(StorageKeys.INITIALIZED, "true");
}

/** Sample tasks shown on first launch */
function getSampleTasks() {
  const today = new Date();
  const addDays = (days) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
  };

  return [
    {
      id: crypto.randomUUID(),
      name: "Plan your week ahead",
      deadline: addDays(2),
      priority: "high",
      completed: false,
      createdAt: Date.now(),
    },
    {
      id: crypto.randomUUID(),
      name: "Review project notes",
      deadline: addDays(5),
      priority: "medium",
      completed: false,
      createdAt: Date.now() - 1000,
    },
    {
      id: crypto.randomUUID(),
      name: "Organize workspace",
      deadline: addDays(1),
      priority: "low",
      completed: true,
      createdAt: Date.now() - 2000,
    },
  ];
}
