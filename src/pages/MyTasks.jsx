

function MyTasks({ tasks = [], onToggle, onDelete }) {
  return (
    <section>
      <h1>My Tasks</h1>
      <p>Manage your assignments and study activities.</p>

      {tasks.length === 0 ? (
        <div className="content-card">
          <p>You haven't added any tasks yet.</p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <div className="content-card task-item" key={task.id}>
              <div className="task-details">
                <h3 className={task.completed ? 'completed-title' : ''}>
                  {task.title}
                </h3>

                <p>Subject: {task.subject || 'Not specified'}</p>
                <p>Due: {task.dueDate || 'No due date'}</p>
                <p>Priority: {task.priority}</p>

                <p className={task.completed ? 'status-done' : 'status-pending'}>
                  {task.completed ? '✓ Completed' : 'Pending'}
                </p>
              </div>

              <div className="task-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => onToggle(task.id)}
                  aria-pressed={task.completed}
                >
                  {task.completed ? 'Undo' : 'Mark Complete'}
                </button>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => onDelete(task.id)}
                  aria-label={`Delete ${task.title}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyTasks;