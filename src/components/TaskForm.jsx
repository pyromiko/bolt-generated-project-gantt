import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const TaskForm = ({ onAddTask, newTask, onTaskChange, onDateChange, tasks }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [nameError, setNameError] = useState('');
  const [progressError, setProgressError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newTask.name.trim()) {
      setNameError('Task name cannot be empty');
      return;
    }

    if (newTask.progress < 0 || newTask.progress > 100) {
      setProgressError('Progress must be between 0 and 100');
      return;
    }

    setNameError('');
    setProgressError('');
    onAddTask(newTask);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    onDateChange('start', date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    onDateChange('end', date);
  };

  const handleProgressChange = (e) => {
    let value = e.target.value;

    // Replace comma with dot for consistent float parsing
    value = value.replace(',', '.');

    // Parse the value as a float
    let parsedValue = parseFloat(value);

    // Ensure the parsed value is within the range of 0 to 100
    if (isNaN(parsedValue)) {
      parsedValue = 0; // Default to 0 if parsing fails
    } else {
      parsedValue = Math.max(0, Math.min(100, parsedValue));
    }

    // Update the state with the corrected value
    onTaskChange({ target: { name: 'progress', value: parsedValue } });
  };

  const handleDependencyChange = (selectedOptions) => {
    const dependencyNames = Array.from(selectedOptions).map(option => option.value);
    onTaskChange({ target: { name: 'dependencies', value: dependencyNames } });
  };


  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        name="name"
        placeholder="Task Name"
        value={newTask.name}
        onChange={onTaskChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      {nameError && <p className="text-red-500 text-xs italic">{nameError}</p>}

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Start Date:</label>
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          dateFormat="dd/MM/yyyy"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">End Date:</label>
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          dateFormat="dd/MM/yyyy"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <input
        type="text"
        name="progress"
        placeholder="Progress (0-100)"
        value={newTask.progress}
        onChange={handleProgressChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      {progressError && <p className="text-red-500 text-xs italic">{progressError}</p>}
      <select
        name="type"
        value={newTask.type}
        onChange={onTaskChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      >
        <option value="task">Task</option>
        <option value="milestone">Milestone</option>
      </select>

      <select
        name="parent"
        value={newTask.parent || ''}
        onChange={onTaskChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      >
        <option value="">No Parent</option>
        {Array.isArray(tasks) && tasks.map(task => (
          <option key={task.id} value={task.id}>{task.name}</option>
        ))}
      </select>

      <select
        name="dependencies"
        multiple
        onChange={(e) => handleDependencyChange(e.target.selectedOptions)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      >
        {Array.isArray(tasks) && tasks.map(task => (
          <option key={task.id} value={task.name}>{task.name}</option>
        ))}
      </select>


      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
