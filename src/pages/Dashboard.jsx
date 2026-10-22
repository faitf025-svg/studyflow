

import { Link } from 'react-router-dom';

function Dashboard({ tasks = [] }) {
  const completed = tasks.filter(
    (task) => task.completed
  ).length;

  const pending = tasks.length - completed;

  return (
    <section>
      <h1>My Dashboard</h1>
      <p>Welcome back! Let's organize your study time.</p>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p className="stat-number">{tasks.length}</p>
        </div>

        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-number">{completed}</p>
        </div>

        <div className="stat-card">
          <h3>Pending</h3>
          <p className="stat-number">{pending}</p>
        </div>
      </div>

      <div className="content-card">
        <h2>Ready to study?</h2>
        <p>Add your assignments and keep track of your deadlines.</p>

        <Link to="/add-task" className="primary-button">
          Add a New Task
        </Link>

        <Link to="/my-tasks" className="secondary-button">
          View My Tasks
        </Link>
      </div>

      <div className="content-card">
        <h2>Recent Tasks</h2>

        {tasks.length === 0 ? (
          <p>No tasks yet. Add your first study task!</p>
        ) : (
          tasks.slice(-3).reverse().map((task) => (
            <div className="task-row" key={task.id}>
              <span>{task.title}</span>
              <span className={task.completed ? 'status-done' : 'status-pending'}>
                {task.completed ? 'Completed' : 'Pending'}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Dashboard;