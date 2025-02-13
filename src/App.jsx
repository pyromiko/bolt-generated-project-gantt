import React, { useState, useRef, useEffect } from 'react';
import Gantt from './components/Gantt';
import TaskForm from './components/TaskForm';
import { format, addDays } from 'date-fns';

const initialTasks = [
  { id: 1, name: 'Task 1', start: new Date(), end: addDays(new Date(), 5), progress: 20, type: 'task', dependencies: [], parent: null },
  { id: 2, name: 'Milestone 1', start: addDays(new Date(), 2), end: addDays(new Date(), 2), progress: 100, type: 'milestone', dependencies: [], parent: null },
  { id: 3, name: 'Task 2', start: addDays(new Date(), 7), end: addDays(new Date(), 12), progress: 50, type: 'task', dependencies: [], parent: null },
];

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState({ name: '', start: new Date(), end: addDays(new Date(), 1), progress: 0, type: 'task', dependencies: [], parent: null });
  const ganttRef = useRef(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleAddTask = (task) => {
    const dependenciesString = task.dependencies;
    const dependenciesArray = typeof dependenciesString === 'string' && dependenciesString.length > 0
      ? dependenciesString.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
      : [];
    setTasks([...tasks, { ...task, id: Date.now(), dependencies: dependenciesArray }]);
    setNewTask({ name: '', start: new Date(), end: addDays(new Date(), 1), progress: 0, type: 'task', dependencies: [], parent: null });
  };

  const handleEditTask = (updatedTask) => {
    const dependenciesString = typeof updatedTask.dependencies === 'string' ? updatedTask.dependencies : '';
    const dependenciesArray = dependenciesString
      ? dependenciesString.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
      : [];

    // Update the tasks state with the modified task
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === updatedTask.id ? { ...updatedTask, dependencies: dependenciesArray } : task
      )
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prevTask => ({ ...prevTask, [name]: value }));
  };

  const handleDateChange = (name, date) => {
    setNewTask(prevTask => ({ ...prevTask, [name]: date }));
  };

  const handleZoomIn = () => {
    ganttRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    ganttRef.current.zoomOut();
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(tasks);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'gantt_project.json';
    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTasks = JSON.parse(e.target.result);
        if (Array.isArray(importedTasks)) {
          setTasks(importedTasks);
        } else {
          alert('Invalid file format. Please import a JSON file containing an array of tasks.');
        }
      } catch (error) {
        alert('Error parsing JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAll = () => {
    setShowConfirmation(true);
  };

  const confirmClearAll = () => {
    setTasks([]);
    setShowConfirmation(false);
  };

  const cancelClearAll = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="container mx-auto p-4" style={{ width: '1366px' }}>
      <h1 className="text-2xl font-bold mb-4">Gantt Project - BOLT.DIY</h1>

      <div className="mb-4">
        <TaskForm
          onAddTask={handleAddTask}
          newTask={newTask}
          onTaskChange={handleTaskChange}
          onDateChange={handleDateChange}
          tasks={tasks}
        />
      </div>

      <div className="mb-4 flex space-x-2">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleZoomIn}>Zoom In</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleZoomOut}>Zoom Out</button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleExport}>Export to JSON</button>
        <input type="file" accept=".json" onChange={handleImport} />
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={handleClearAll}>Clear All</button>
      </div>

      <div className="overflow-x-auto">
        <Gantt ref={ganttRef} tasks={tasks} onEditTask={handleEditTask} onDeleteTask={handleDeleteTask} />
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-semibold mb-4">Confirmation</h3>
            <p>Are you sure you want to clear all tasks?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={confirmClearAll}
              >
                Yes, Clear All
              </button>
              <button
                className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={cancelClearAll}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
