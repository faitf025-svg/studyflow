import { useEffect, useState } from "react";
import { Link, Navigate, NavLink, Route, Routes, useLocation } from "react-router-dom";
import AddTask from "./pages/AddTask.jsx";
import Calendar from "./pages/Calendar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MyTasks from "./pages/MyTasks.jsx";
import Progress from "./pages/Progress.jsx";

const TASKS_STORAGE_KEY = "studyflow-tasks";

const navigationLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/add-task", label: "Add Task" },
  { to: "/my-tasks", label: "My Tasks" },
  { to: "/calendar", label: "Calendar" },
  { to: "/progress", label: "Progress" },
];

function isStoredTask(task) {
  return (
    typeof task === "object" &&
    task !== null &&
    (typeof task.id === "string" || typeof task.id === "number") &&
    typeof task.title === "string" &&
    (typeof task.subject === "string" || task.subject === undefined) &&
    (typeof task.dueDate === "string" || task.dueDate === undefined) &&
    ["Low", "Medium", "High"].includes(task.priority) &&
    typeof task.completed === "boolean"
  );
}



function loadSavedTasks() {
  try {
    const savedTasks = window.localStorage.getItem(TASKS_STORAGE_KEY);

    if (savedTasks === null) {
      return { tasks: [], error: "" };
    }

    const parsedTasks = JSON.parse(savedTasks);

    if (!Array.isArray(parsedTasks) || !parsedTasks.every(isStoredTask)) {
      throw new Error("Saved task data has an unexpected format.");
    }

    return {
      tasks: parsedTasks.map((task) => ({
        ...task,
        subject: task.subject || "",
        dueDate: task.dueDate || "",
      })),
      error: "",
    };
  } catch (error) {
    console.error("Unable to load saved StudyFlow tasks.", error);
    return {
      tasks: [],
      error: "Saved tasks could not be loaded. Check your browser storage before continuing.",
    };
  }
}

function WelcomePage() {
  return (
    <main className="welcome-page">
      <section className="welcome-card">
        <Link className="logo welcome-logo" to="/" aria-label="StudyFlow home">
          <span aria-hidden="true">✦</span>
          StudyFlow
        </Link>
        <h1>Welcome to StudyFlow!</h1>
        <p className="tagline">Your personal study planner.</p>
        <p>
          Organize your schoolwork, manage deadlines, and keep track of your
          study progress in one simple place.
        </p>
        <Link className="primary-button" to="/dashboard">
          Get Started
        </Link>
      </section>
    </main>
  );
}

function App() {
  const [initialTasks] = useState(loadSavedTasks);
  const [tasks, setTasks] = useState(initialTasks.tasks);
  const [storageError, setStorageError] = useState(initialTasks.error);
  const location = useLocation();
  const isWelcomePage = location.pathname === "/";

  useEffect(() => {
    if (storageError) {
      return;
    }

    try {
      window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Unable to save StudyFlow tasks.", error);
      setStorageError("Your changes could not be saved to browser storage.");
    }
  }, [tasks, storageError]);

  function addTask(taskDetails) {
    const newTask = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      ...taskDetails,
      completed: false,
    };

    setTasks((currentTasks) => [...currentTasks, newTask]);
  }

  function toggleTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function deleteTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId)
    );
  }

  if (isWelcomePage) {
    return <WelcomePage />;
  }

  return (
    <div className="app-layout">
      <header className="navbar">
        <Link className="logo" to="/dashboard" aria-label="StudyFlow dashboard">
          <span aria-hidden="true">✦</span>
          StudyFlow
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          {navigationLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="page-content">
        {storageError && (
          <p className="storage-error" role="alert">
            {storageError}
          </p>
        )}
        <Routes>
          <Route path="/dashboard" element={<Dashboard tasks={tasks} />} />
          <Route
            path="/add-task"
            element={<AddTask onAdd={addTask} />}
          />
          <Route
            path="/my-tasks"
            element={
              <MyTasks
                tasks={tasks}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            }
          />
          <Route path="/calendar" element={<Calendar tasks={tasks} />} />
          <Route path="/progress" element={<Progress tasks={tasks} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
