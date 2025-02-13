import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const TaskForm = ({ onAddTask, newTask, onTaskChange, onDateChange, tasks }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleSubmit = (e) => {
    e.preventDefault();
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
        type="number"
        name="progress"
        placeholder="Progress (0-100)"
        value={newTask.progress}
        onChange={onTaskChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
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

      <input
        type="text"
        name="dependencies"
        placeholder="Dependencies (comma-separated task IDs)"
        value={newTask.dependencies || ''}
        onChange={onTaskChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />

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
