import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import DatePicker from 'tailwind-datepicker-react';

const TaskEditModal = ({ isOpen, onClose, task, onUpdate, tasks }) => {
  const [editedTask, setEditedTask] = useState({ ...task });
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    if (task) {
      setEditedTask({ ...task });
    }
  }, [task]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prevTask => ({ ...prevTask, [name]: value }));
  };

  const handleStartDateChange = (selectedDate) => {
    setEditedTask(prevTask => ({ ...prevTask, start: new Date(selectedDate) }));
  };

  const handleEndDateChange = (selectedDate) => {
    setEditedTask(prevTask => ({ ...prevTask, end: new Date(selectedDate) }));
  };

  const toggleStartDatePicker = () => {
    setShowStartDatePicker(!showStartDatePicker);
  };

  const toggleEndDatePicker = () => {
    setShowEndDatePicker(!showEndDatePicker);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(editedTask);
  };

  const options = {
    title: "Select date",
    autoHide: true,
    todayBtn: false,
    clearBtn: true,
    theme: {
      background: 'bg-gray-100 dark:bg-gray-700',
      todayBtn: '',
      clearBtn: '',
      disabledText: 'text-gray-500 dark:text-gray-400',
      input: 'bg-white dark:bg-gray-600 dark:text-white',
      inputIcon: '',
      selected: 'bg-blue-500 dark:bg-blue-500 text-white',
    },
    icons: {
      prev: () => <span>Prev</span>,
      next: () => <span>Next</span>
    },
    datepickerClassNames: 'top-12'
  }

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

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Start Date:</label>
            <div className="relative">
              <input
                type="text"
                value={editedTask.start ? format(editedTask.start, 'yyyy-MM-dd') : ''}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                readOnly
                onClick={toggleStartDatePicker}
              />
              {showStartDatePicker && (
                <DatePicker
                  options={options}
                  onChange={handleStartDateChange}
                  show={showStartDatePicker}
                  setShow={setShowStartDatePicker}
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">End Date:</label>
            <div className="relative">
              <input
                type="text"
                value={editedTask.end ? format(editedTask.end, 'yyyy-MM-dd') : ''}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                readOnly
                onClick={toggleEndDatePicker}
              />
              {showEndDatePicker && (
                <DatePicker
                  options={options}
                  onChange={handleEndDateChange}
                  show={showEndDatePicker}
                  setShow={setShowEndDatePicker}
                />
              )}
            </div>
          </div>

          <input
            type="number"
            name="progress"
            placeholder="Progress (0-100)"
            value={editedTask.progress || ''}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
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

          <input
            type="text"
            name="dependencies"
            placeholder="Dependencies (comma-separated task IDs)"
            value={editedTask.dependencies || ''}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />

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
