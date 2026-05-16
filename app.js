/**
 * app.js — Main application entry point
 * Wires together storage, tasks, and UI modules
 */

// App state for filters and search
const state = {
  filter: "all",
  search: "",
  sort: "date-asc",
  pendingDeleteId: null,
};

/** Get tasks after applying search, filter, and sort */
function getDisplayTasks() {
  let list = getTasks();
  list = searchTasks(list, state.search);
  list = filterByStatus(list, state.filter);
  list = sortTasks(list, state.sort);
  return list;
}

/** Refresh the entire UI */
function refresh() {
  const allTasks = getTasks();
  const displayTasks = getDisplayTasks();
  renderStats(allTasks);
  renderTaskList(displayTasks);
}

/** Handle form submit (add or update task) */
function handleFormSubmit(e) {
  e.preventDefault();

  const name = els.taskName.value.trim();
  const deadline = els.taskDeadline.value;
  const priority = els.taskPriority.value;

  if (!name) {
    showValidationError();
    return;
  }

  if (!deadline) {
    showToast("Please select a due date.", "error");
    return;
  }

  const editId = els.taskForm.dataset.editId;

  if (editId) {
    updateTask(editId, { name, deadline, priority });
    showToast("Task updated successfully!");
    resetForm();
  } else {
    addTask({ name, deadline, priority });
    showToast("Task added successfully!");
    els.taskForm.reset();
    els.taskDeadline.value = els.taskDeadline.min;
    els.taskPriority.value = "medium";
  }

  refresh();
}

/** Delegate clicks on the task list */
function handleTaskListClick(e) {
  const card = e.target.closest(".task-card");
  if (!card) return;

  const id = card.dataset.id;

  if (e.target.classList.contains("task-card__check")) {
    toggleComplete(id);
    refresh();
    return;
  }

  if (e.target.closest(".btn-edit")) {
    const task = getTasks().find((t) => t.id === id);
    if (task) setEditMode(task);
    return;
  }

  if (e.target.closest(".btn-delete")) {
    state.pendingDeleteId = id;
    els.deleteModal.showModal();
  }
}

/** Confirm task deletion */
function handleDeleteConfirm() {
  const id = state.pendingDeleteId;
  if (!id) return;

  animateRemove(id, () => {
    deleteTask(id);
    state.pendingDeleteId = null;
    els.deleteModal.close();
    refresh();
    showToast("Task deleted.", "success");
  });
}

/** Toggle light/dark theme */
function handleThemeToggle() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "light" ? "dark" : "light";
  applyTheme(next);
  setTheme(next);
}

/** Initialize all event listeners */
function bindEvents() {
  els.taskForm.addEventListener("submit", handleFormSubmit);
  els.taskList.addEventListener("click", handleTaskListClick);

  els.searchInput.addEventListener("input", (e) => {
    state.search = e.target.value;
    refresh();
  });

  els.sortSelect.addEventListener("change", (e) => {
    state.sort = e.target.value;
    refresh();
  });

  els.filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.filter = btn.dataset.filter;
      setActiveFilter(state.filter);
      refresh();
    });
  });

  els.themeToggle.addEventListener("click", handleThemeToggle);

  document.getElementById("delete-confirm").addEventListener("click", handleDeleteConfirm);
  document.getElementById("delete-cancel").addEventListener("click", () => {
    state.pendingDeleteId = null;
    els.deleteModal.close();
  });

  // Close modal on backdrop click (Escape is built into dialog)
  els.deleteModal.addEventListener("click", (e) => {
    if (e.target === els.deleteModal) {
      state.pendingDeleteId = null;
      els.deleteModal.close();
    }
  });

  // Remove error styling when user types
  els.taskName.addEventListener("input", () => {
    els.taskName.classList.remove("input--error");
  });
}

/** Bootstrap the application */
function init() {
  initUI();
  initTasks();

  const savedTheme = getTheme();
  applyTheme(savedTheme);

  bindEvents();
  refresh();

  // Brief loading animation for polish
  setTimeout(hideLoader, 600);
}

// Start when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
