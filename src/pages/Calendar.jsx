

function Calendar({ tasks = [] }) {
  const upcomingTasks = [...tasks]
    .filter((task) => !task.completed && task.dueDate)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  function formatDate(dueDate) {
    return new Date(`${dueDate}T00:00:00`).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return (
    <section>
      <h1>Calendar & Deadlines</h1>
      <p>Keep an eye on your upcoming assignments.</p>

      <div className="content-card">
        <h2>Upcoming Deadlines</h2>

        {upcomingTasks.length === 0 ? (
          <p>
            No upcoming deadlines. Tasks without a due date will not appear
            here.
          </p>
        ) : (
          upcomingTasks.map((task) => (
            <div className="task-row" key={task.id}>
              <div>
                <h3>{task.title}</h3>
                <p>{task.subject || 'Subject not specified'}</p>
              </div>

              <div className="deadline-date">
                <strong>{formatDate(task.dueDate)}</strong>
                <p>{task.priority} priority</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Calendar;