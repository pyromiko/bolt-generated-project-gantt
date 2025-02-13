import React from 'react';
import DatePicker from 'tailwind-datepicker-react';
import { format } from 'date-fns';

const TaskForm = ({ onAddTask, newTask, onTaskChange, onDateChange, tasks }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTask(newTask);
  };

  const handleStartDateChange = (selectedDate) => {
    onDateChange('start', new Date(selectedDate));
  };

  const handleEndDateChange = (selectedDate) => {
    onDateChange('end', new Date(selectedDate));
  };

  const [showStartDatePicker, setShowStartDatePicker] = React.useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = React.useState(false);

  const toggleStartDatePicker = () => {
    setShowStartDatePicker(!showStartDatePicker);
  };

  const toggleEndDatePicker = () => {
    setShowEndDatePicker(!showEndDatePicker);
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
        <div className="relative">
          <input
            type="text"
            value={newTask.start ? format(newTask.start, 'yyyy-MM-dd') : ''}
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
            value={newTask.end ? format(newTask.end, 'yyyy-MM-dd') : ''}
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
