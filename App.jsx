import { useEffect, useState } from "react";
import "./App.css";

const initialTasks = [
  {
    id: 1,
    title: "Complete React project",
    category: "Work",
    priority: "High",
    completed: false,
  },
  {
    id: 2,
    title: "Practice JavaScript",
    category: "Study",
    priority: "Medium",
    completed: true,
  },
  {
    id: 3,
    title: "Update my resume",
    category: "Personal",
    priority: "High",
    completed: false,
  },
];

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem("focusflow-tasks");
      return savedTasks !== null
        ? JSON.parse(savedTasks)
        : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  const [input, setInput] = useState("");
  const [category, setCategory] = useState("Personal");
  const [priority, setPriority] = useState("Medium");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  
const [categoryFilter, setCategoryFilter] = useState("All");
const [sortBy, setSortBy] = useState("newest");

  const [focusMinutes, setFocusMinutes] = useState(25);
const [secondsLeft, setSecondsLeft] = useState(25 * 60);
const [timerRunning, setTimerRunning] = useState(false);
const [focusSessions, setFocusSessions] = useState(0);
const [dueDate, setDueDate] = useState("");
const [deadlineFilter, setDeadlineFilter] = useState("All");

useEffect(() => {
  if (!timerRunning) return;

  const timerId = setInterval(() => {
    setSecondsLeft((previous) => {
      if (previous <= 1) {
        clearInterval(timerId);
        setTimerRunning(false);
        setFocusSessions((count) => count + 1);
        alert("Focus session complete! Time for a short break.");
        return 0;
      }

      return previous - 1;
    });
  }, 1000);

  return () => clearInterval(timerId);
}, [timerRunning]);

function resetTimer() {
  setTimerRunning(false);
  setSecondsLeft(focusMinutes * 60);
}

function changeFocusDuration(value) {
  const minutes = Number(value);
  setFocusMinutes(minutes);
  setSecondsLeft(minutes * 60);
  setTimerRunning(false);
}

const timerDisplay = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;

const today = new Date().toLocaleDateString("en-CA");

  const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem("focusflow-theme") === "dark";
});

useEffect(() => {
  localStorage.setItem(
    "focusflow-theme",
    darkMode ? "dark" : "light"
  );
}, [darkMode]);

  useEffect(() => {
    localStorage.setItem("focusflow-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;

  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  // Add a new task
  function addTask(e) {
    e.preventDefault();

    const title = input.trim();

    if (!title) {
      alert("Please enter a task first!");
      return;
    }

    const newTask = {
  id: Date.now(),
  title: title,
  category: category,
  priority: priority,
  dueDate: dueDate,
  completed: false,

    };

    setTasks((previousTasks) => [newTask, ...previousTasks]);
    setInput("");
    setDueDate("");
    setFilter("All");
    setSearch("");
  }

  // Mark task as completed or active
  function toggleTask(id) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  // Delete a task
  function deleteTask(id) {
    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== id)
    );
  }

  // Edit a task
  function editTask(task) {
    const updatedTitle = window.prompt(
      "Enter the updated task:",
      task.title
    );

    if (updatedTitle === null || !updatedTitle.trim()) {
      return;
    }

    setTasks((previousTasks) =>
      previousTasks.map((item) =>
        item.id === task.id
          ? { ...item, title: updatedTitle.trim() }
          : item
      )
    );
  }

  // Filter and search tasks
  const visibleTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "All" ||
      (filter === "Active" && !task.completed) ||
      (filter === "Completed" && task.completed);

    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase().trim());

    return matchesFilter && matchesSearch;
  });

  return (
    <main className={darkMode ? "app-shell dark-mode" : "app-shell"}>
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">✦</span>
          <span>focusflow</span>
        </div>

        <p className="nav-label">WORKSPACE</p>

        <button
          type="button"
          className="nav-item selected"
          onClick={() => {
            setFilter("All");
            setSearch("");
          }}
        >
          ▦ &nbsp; My Tasks
        </button>

        <div className="sidebar-note">
          <span className="note-icon">✧</span>
          <h3>Small steps, big results.</h3>
          <p>Stay focused. Make today count.</p>
        </div>

        <div className="profile">
          <div className="avatar">A</div>
          <div>
            <strong>My Workspace</strong>
            <small>Personal planner</small>
          </div>
        </div>
      </aside>

      <section className="main-content">
        <header className="topbar">
          <span>
            Workspace / <strong>My Tasks</strong>
          </span>
          <span className="today-label"><button
  type="button"
  className="theme-toggle"
  onClick={() => setDarkMode((previous) => !previous)}
>
  {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
</button>✧ Your productivity space</span>
        </header>

        <div className="page-heading">
          <div>
            <p className="eyebrow">YOUR PERSONAL DASHBOARD</p>
            <h1>
              Good things take <span>focus.</span>
            </h1>
            <p className="subtitle">
              Organize your day, one task at a time.
            </p>
          </div>

          <div className="date-card">
            <span>✦</span>
            <div>
              <strong>
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </strong>
              <small>Make it count</small>
            </div>
          </div>
        </div>
        <section className="focus-card">
  <div className="focus-info">
    <span className="focus-eyebrow">DEEP WORK MODE</span>
    <h2>Time to focus. 🎯</h2>
    <p>One task at a time. Make every minute count.</p>
    <div className="focus-session-count">
      ✦ {focusSessions} focus sessions completed this visit
    </div>
  </div>

  <div className="focus-controls">
    <div className="timer-display">{timerDisplay}</div>

    <select
      value={focusMinutes}
      disabled={timerRunning}
      onChange={(e) => changeFocusDuration(e.target.value)}
      aria-label="Focus duration"
    >
      <option value={5}>5 minutes</option>
      <option value={15}>15 minutes</option>
      <option value={25}>25 minutes</option>
      <option value={45}>45 minutes</option>
    </select>

    <div className="timer-buttons">
      <button
        type="button"
        onClick={() => {
          if (secondsLeft === 0) resetTimer();
          setTimerRunning((running) => !running);
        }}
      >
        {timerRunning ? "Ⅱ Pause" : secondsLeft === 0 ? "↻ Restart" : "▶ Start focus"}
      </button>

      <button type="button" onClick={resetTimer}>
        Reset
      </button>
    </div>
  </div>
</section>

        <section className="stats-grid">
          <article className="stat-card">
            <span className="stat-icon purple">▤</span>
            <p>Total tasks</p>
            <h2>{tasks.length}</h2>
            <small>Everything on your list</small>
          </article>

          <article className="stat-card">
            <span className="stat-icon orange">◷</span>
            <p>In progress</p>
            <h2>{pending}</h2>
            <small>One step at a time</small>
          </article>

          <article className="stat-card">
            <span className="stat-icon green">✓</span>
            <p>Completed</p>
            <h2>{completed}</h2>
            <small>Look how far you've come</small>
          </article>
        </section>

        <section className="progress-card">
          <div className="progress-heading">
            <div>
              <h3>Daily progress</h3>
              <p>Every completed task is a win.</p>
            </div>
            <strong>{progress}%</strong>
          </div>

          <div
            className="progress-track"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div style={{ width: `${progress}%` }} />
          </div>
        </section>

        <section className="tasks-panel">
          <div className="tasks-heading">
            <div>
              <h2>
                My tasks <span>{tasks.length}</span>
              </h2>
              <p>Keep your priorities in sight.</p>
            </div>
          </div>

          <form className="task-form" onSubmit={addTask}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What would you like to get done?"
              aria-label="Task title"
              autoComplete="off"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Task category"
            >
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="Study">Study</option>
            </select>
            <input
  type="date"
  value={dueDate}
  min={new Date().toLocaleDateString("en-CA")}
  onChange={(e) => setDueDate(e.target.value)}
  aria-label="Task due date"
/>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              aria-label="Task priority"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <button className="add-button" type="submit">
              + Add task
            </button>
          </form>

          <div className="task-toolbar">
            <div className="filter-tabs">
              {["All", "Active", "Completed"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={
                    filter === item ? "filter active" : "filter"
                  }
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <input
              className="search-input"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="⌕ Search tasks..."
              aria-label="Search tasks"
            />
          </div>

          <div className="task-list">
            {visibleTasks.length > 0 ? (
              visibleTasks.map((task) => (
                <article
                  className={
                    task.completed
                      ? "task-row is-complete"
                      : "task-row"
                  }
                  key={task.id}
                >
                  <button
                    type="button"
                    className="check-button"
                    onClick={() => toggleTask(task.id)}
                    aria-label={
                      task.completed
                        ? "Mark task as active"
                        : "Complete task"
                    }
                  >
                    {task.completed ? "✓" : ""}
                  </button>

                  <div className="task-info">
                    <strong>{task.title}</strong>
                    <span>{task.category}</span>

{task.dueDate && (
  <span className={
    !task.completed && task.dueDate < today
      ? "deadline overdue"
      : task.dueDate === today && !task.completed
        ? "deadline due-today"
        : "deadline"
  }>
    {task.dueDate < today && !task.completed
      ? "⚠ Overdue: "
      : task.dueDate === today
        ? "Today: "
        : "Due: "}
    {new Date(`${task.dueDate}T12:00:00`).toLocaleDateString("en-IN")}
  </span>
)}
                  </div>

                  <span
                    className={`priority priority-${task.priority.toLowerCase()}`}
                  >
                    {task.priority}
                  </span>

                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => editTask(task)}
                    aria-label="Edit task"
                    title="Edit task"
                  >
                    ✎
                  </button>

                  <button
                    type="button"
                    className="icon-button delete"
                    onClick={() => deleteTask(task.id)}
                    aria-label="Delete task"
                    title="Delete task"
                  >
                    ×
                  </button>
                </article>
              ))
            ) : (
              <div className="empty-state">
                <span>✧</span>
                <h3>No tasks found</h3>
                <p>Add a task or try another filter.</p>
              </div>
            )}
          </div>

          <footer className="tasks-footer">
            {pending} remaining <span>•</span> {completed} completed
          </footer>
        </section>

        <p className="footer-note">
          Made for a more focused day <span>✦</span>
        </p>
      </section>
    </main>
  );
}

export default App;