import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TaskEditModal = ({ isOpen, onClose, task, onUpdate, tasks }) => {
  const [editedTask, setEditedTask] = useState({ ...task });
  const [startDate, setStartDate] = useState(task ? new Date(task.start) : new Date());
  const [endDate, setEndDate] = useState(task ? new Date(task.end) : new Date());
  const [nameError, setNameError] = useState('');
  const [progressError, setProgressError] = useState('');

  useEffect(() => {
    if (task) {
      setEditedTask({ ...task });
      setStartDate(new Date(task.start));
      setEndDate(new Date(task.end));
    }
  }, [task]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prevTask => ({ ...prevTask, [name]: value }));
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setEditedTask(prevTask => ({ ...prevTask, start: date }));
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setEditedTask(prevTask => ({ ...prevTask, end: date }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!editedTask.name.trim()) {
      setNameError('Task name cannot be empty');
      return;
    }

    if (editedTask.progress < 0 || editedTask.progress > 100) {
      setProgressError('Progress must be between 0 and 100');
      return;
    }

    setNameError('');
    setProgressError('');
    onUpdate(editedTask);
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
    setEditedTask(prevTask => ({ ...prevTask, progress: parsedValue }));
  };

  const handleDependencyChange = (selectedOptions) => {
    const dependencyNames = Array.from(selectedOptions).map(option => option.value);
    setEditedTask(prevTask => ({ ...prevTask, dependencies: dependencyNames }));
  };


  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-semibold mb-4">Edit Task</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            name="name"
            placeholder="Task Name"
            value={editedTask.name || ''}
            onChange={handleChange}
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
            value={editedTask.progress || ''}
            onChange={handleProgressChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {progressError && <p className="text-red-500 text-xs italic">{progressError}</p>}
          <select
            name="type"
            value={editedTask.type || 'task'}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="task">Task</option>
            <option value="milestone">Milestone</option>
          </select>

          <select
            name="parent"
            value={editedTask.parent || ''}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">No Parent</option>
            {tasks && Array.isArray(tasks) && tasks.map(task => (
              <option key={task.id} value={task.id}>{task.name} (ID: {task.id})</option>
            ))}
          </select>

          <select
            name="dependencies"
            multiple
            value={editedTask.dependencies || []}
            onChange={(e) => handleDependencyChange(e.target.selectedOptions)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            {Array.isArray(tasks) && tasks.map(task => (
              <option key={task.id} value={task.name}>{task.name}</option>
            ))}
          </select>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskEditModal;
