/**
 * ui.js — DOM rendering, toasts, and visual updates
 */

// SVG icons reused across task cards
const Icons = {
  calendar: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`,
  delete: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`,
};

// DOM references (set in initUI)
let els = {};

/** Cache DOM elements */
function initUI() {
  els = {
    taskList: document.getElementById("task-list"),
    emptyState: document.getElementById("empty-state"),
    statTotal: document.getElementById("stat-total"),
    statPending: document.getElementById("stat-pending"),
    statCompleted: document.getElementById("stat-completed"),
    toastContainer: document.getElementById("toast-container"),
    deleteModal: document.getElementById("delete-modal"),
    taskForm: document.getElementById("task-form"),
    taskName: document.getElementById("task-name"),
    taskDeadline: document.getElementById("task-deadline"),
    taskPriority: document.getElementById("task-priority"),
    submitBtnText: document.getElementById("submit-btn-text"),
    searchInput: document.getElementById("search-input"),
    sortSelect: document.getElementById("sort-select"),
    filterBtns: document.querySelectorAll(".filter__btn"),
    themeToggle: document.getElementById("theme-toggle"),
    year: document.getElementById("year"),
    loader: document.getElementById("loader"),
  };

  els.year.textContent = new Date().getFullYear();

  // Default deadline to today
  els.taskDeadline.min = new Date().toISOString().split("T")[0];
  els.taskDeadline.value = els.taskDeadline.min;
}

/** Apply saved theme to document */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
  els.themeToggle?.setAttribute("aria-label", label);
  els.themeToggle?.setAttribute("title", label);
}

/** Show toast notification */
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.setAttribute("role", "alert");
  toast.textContent = message;
  els.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("toast--out");
    toast.addEventListener("animationend", () => toast.remove());
  }, 2800);
}

/** Update statistics display (uses full task list, not filtered) */
function renderStats(allTasks) {
  const stats = getStats(allTasks);
  els.statTotal.textContent = stats.total;
  els.statPending.textContent = stats.pending;
  els.statCompleted.textContent = stats.completed;
}

/** Build HTML for a single task card */
function createTaskCardHTML(task) {
  const completedClass = task.completed ? "task-card--completed" : "";
  return `
    <li class="task-card ${completedClass}" data-id="${task.id}" role="listitem">
      <input
        type="checkbox"
        class="task-card__check"
        ${task.completed ? "checked" : ""}
        aria-label="Mark task as ${task.completed ? "pending" : "completed"}"
      >
      <div class="task-card__body">
        <p class="task-card__name">${escapeHTML(task.name)}</p>
        <div class="task-card__meta">
          <span class="task-card__date">${Icons.calendar} ${formatDate(task.deadline)}</span>
          <span class="badge badge--${task.priority}">${task.priority}</span>
        </div>
      </div>
      <div class="task-card__actions">
        <button type="button" class="btn btn--sm btn-edit" aria-label="Edit task" title="Edit">
          ${Icons.edit}
        </button>
        <button type="button" class="btn btn--sm btn--danger-hover btn-delete" aria-label="Delete task" title="Delete">
          ${Icons.delete}
        </button>
      </div>
    </li>
  `;
}

/** Escape HTML to prevent XSS */
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/** Render the full task list */
function renderTaskList(displayTasks) {
  els.taskList.innerHTML = displayTasks.map(createTaskCardHTML).join("");
  els.emptyState.hidden = displayTasks.length > 0;
}

/** Animate task removal then callback */
function animateRemove(taskId, callback) {
  const card = els.taskList.querySelector(`[data-id="${taskId}"]`);
  if (!card) {
    callback();
    return;
  }
  card.classList.add("task-card--removing");
  card.addEventListener("animationend", callback, { once: true });
}

/** Set form to edit mode */
function setEditMode(task) {
  els.taskName.value = task.name;
  els.taskDeadline.value = task.deadline;
  els.taskPriority.value = task.priority;
  els.submitBtnText.textContent = "Save Changes";
  els.taskForm.dataset.editId = task.id;
  els.taskName.focus();
}

/** Reset form to add mode */
function resetForm() {
  els.taskForm.reset();
  els.taskDeadline.value = els.taskDeadline.min;
  els.taskPriority.value = "medium";
  els.submitBtnText.textContent = "Add Task";
  delete els.taskForm.dataset.editId;
  els.taskName.classList.remove("input--error");
}

/** Highlight invalid input */
function showValidationError() {
  els.taskName.classList.add("input--error");
  els.taskName.focus();
  showToast("Please enter a task name.", "error");
}

/** Update active filter button styles */
function setActiveFilter(filter) {
  els.filterBtns.forEach((btn) => {
    btn.classList.toggle("filter__btn--active", btn.dataset.filter === filter);
  });
}

/** Hide loader and reveal app */
function hideLoader() {
  document.body.classList.add("app-ready");
}
