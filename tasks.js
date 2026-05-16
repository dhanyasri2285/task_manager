/**
 * tasks.js — Task data model and business logic
 */

const PRIORITY_ORDER = { high: 3, medium: 2, low: 1 };

let tasks = [];

/** Initialize tasks from storage or sample data */
function initTasks() {
  if (isFirstVisit()) {
    tasks = getSampleTasks();
    saveTasks(tasks);
    markInitialized();
  } else {
    tasks = loadTasks();
  }
  return tasks;
}

/** Get current tasks array */
function getTasks() {
  return tasks;
}

/** Add a new task */
function addTask({ name, deadline, priority }) {
  const task = {
    id: crypto.randomUUID(),
    name: name.trim(),
    deadline,
    priority,
    completed: false,
    createdAt: Date.now(),
  };
  tasks.unshift(task);
  saveTasks(tasks);
  return task;
}

/** Update an existing task */
function updateTask(id, updates) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;

  tasks[index] = { ...tasks[index], ...updates };
  if (updates.name) {
    tasks[index].name = updates.name.trim();
  }
  saveTasks(tasks);
  return tasks[index];
}

/** Toggle completed status */
function toggleComplete(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return null;
  task.completed = !task.completed;
  saveTasks(tasks);
  return task;
}

/** Remove task by id */
function deleteTask(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  saveTasks(tasks);
  return true;
}

/** Filter tasks by status */
function filterByStatus(list, filter) {
  if (filter === "completed") return list.filter((t) => t.completed);
  if (filter === "pending") return list.filter((t) => !t.completed);
  return list;
}

/** Search tasks by keyword */
function searchTasks(list, query) {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.priority.toLowerCase().includes(q)
  );
}

/** Sort tasks by date or priority */
function sortTasks(list, sortBy) {
  const sorted = [...list];

  switch (sortBy) {
    case "date-asc":
      return sorted.sort((a, b) => a.deadline.localeCompare(b.deadline));
    case "date-desc":
      return sorted.sort((a, b) => b.deadline.localeCompare(a.deadline));
    case "priority-desc":
      return sorted.sort(
        (a, b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]
      );
    case "priority-asc":
      return sorted.sort(
        (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      );
    default:
      return sorted;
  }
}

/** Compute task statistics */
function getStats(list) {
  const total = list.length;
  const completed = list.filter((t) => t.completed).length;
  return {
    total,
    completed,
    pending: total - completed,
  };
}

/** Format date for display */
function formatDate(dateStr) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
