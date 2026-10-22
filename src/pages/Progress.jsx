

function Progress({ tasks = [] }) {
  const completed = tasks.filter(
    (task) => task.completed
  ).length;

  const total = tasks.length;
  const pending = total - completed;

  const percentage = total === 0
    ? 0
    : Math.round((completed / total) * 100);

  return (
    <section>
      <h1>My Progress</h1>
      <p>See how far you've come with your study goals.</p>

      <div className="stats-grid progress-stats">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p className="stat-number">{total}</p>
        </div>

        <div className="stat-card">
          <h3>Completed Tasks</h3>
          <p className="stat-number">{completed}</p>
        </div>

        <div className="stat-card">
          <h3>Pending Tasks</h3>
          <p className="stat-number">{pending}</p>
        </div>

        <div className="stat-card">
          <h3>Completion</h3>
          <p className="stat-number">{percentage}%</p>
        </div>
      </div>

      <div className="content-card">
        <h2>Completion Rate</h2>

        <div
          className="progress-track"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Task completion rate"
        >
          <div
            className="progress-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p>{completed} out of {total} tasks completed.</p>

        {total === 0
          ? <p>Add your first task to begin tracking progress!</p>
          : percentage === 100
            ? <p>Excellent work! You've completed every task.</p>
            : <p>Keep going. Every completed task counts!</p>
        }
      </div>
    </section>
  );
}

export default Progress;