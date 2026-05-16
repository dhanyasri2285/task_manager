# Task Manager

A simple, modern task manager built with HTML, CSS, and JavaScript. No build tools or backend required — open it directly in your browser.

## Features

- Add, edit, and delete tasks with name, due date, and priority
- Mark tasks complete with strikethrough styling
- Filter by All, Pending, or Completed
- Search tasks by keyword
- Sort by date or priority
- Task statistics (total, pending, completed)
- Light and dark mode (saved in localStorage)
- Sample tasks on first visit
- Responsive layout for desktop, tablet, and mobile
- Smooth animations and toast notifications

## Project Structure

```
task-man/
├── index.html          # Main HTML page
├── css/
│   └── styles.css      # All styles and themes
├── js/
│   ├── storage.js      # localStorage helpers
│   ├── tasks.js        # Task data and logic
│   ├── ui.js           # DOM rendering and toasts
│   └── app.js          # App initialization and events
└── README.md           # This file
```

## How to Run Locally

### Option 1: Open directly (simplest)

1. Navigate to the project folder.
2. Double-click `index.html` to open it in your default browser.

### Option 2: Use a local server (recommended)

Using **VS Code Live Server**:

1. Install the "Live Server" extension in VS Code.
2. Right-click `index.html` and choose **Open with Live Server**.

Using **Python** (if installed):

```bash
cd "path/to/task-man"
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

Using **Node.js** (if installed):

```bash
npx serve .
```

## File Overview

| File | Purpose |
|------|---------|
| `storage.js` | Saves/loads tasks and theme from localStorage |
| `tasks.js` | CRUD operations, filtering, sorting, stats |
| `ui.js` | Renders task cards, toasts, theme, loader |
| `app.js` | Connects everything and handles user events |

## Customization Tips

- **Colors**: Edit CSS variables in `:root` and `[data-theme="dark"]` in `css/styles.css`.
- **Sample tasks**: Change `getSampleTasks()` in `js/storage.js`.
- **Default sort**: Change the `selected` option in the sort dropdown in `index.html`.

## Browser Support

Works in all modern browsers (Chrome, Firefox, Edge, Safari) that support localStorage and the `<dialog>` element.

## License

Free to use and modify for learning and personal projects.
