

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddTask({ onAdd }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [titleError, setTitleError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      setTitleError('Please enter a task title.');
      return;
    }

    setTitleError('');
    onAdd({
      title: title.trim(),
      subject: subject.trim(),
      dueDate,
      priority
    });

    navigate('/my-tasks');
  }

  return (
    <section>
      <h1>Add a New Task</h1>
      <p>Enter the details of your assignment or study activity.</p>

      <form className="content-card task-form" onSubmit={handleSubmit}>
        <label htmlFor="title">Task Name</label>
        <input
          id="title"
          type="text"
          placeholder="e.g. Complete JavaScript assignment"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (titleError) setTitleError('');
          }}
          aria-invalid={Boolean(titleError)}
          aria-describedby={titleError ? 'title-error' : undefined}
          required
        />
        {titleError && (
          <p className="form-error" id="title-error" role="alert">
            {titleError}
          </p>
        )}

        <label htmlFor="subject">Subject (optional)</label>
        <input
          id="subject"
          type="text"
          placeholder="e.g. Web Development"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
        />

        <label htmlFor="dueDate">Due Date (optional)</label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
        />

        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <button type="submit" className="primary-button">
          Add Task
        </button>
      </form>
    </section>
  );
}

export default AddTask;