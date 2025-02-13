import React, { useState, useRef, useEffect } from 'react';
import Gantt from './components/Gantt';
import TaskForm from './components/TaskForm';
import { format, addDays } from 'date-fns';

const initialTasks = [
  { id: 1, name: 'Task 1', start: new Date(), end: addDays(new Date(), 5), progress: 20, type: 'task' },
  { id: 2, name: 'Milestone 1', start: addDays(new Date(), 2), end: addDays(new Date(), 2), progress: 100, type: 'milestone' },
  { id: 3, name: 'Task 2', start: addDays(new Date(), 7), end: addDays(new Date(), 12), progress: 50, type: 'task' },
];

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState({ name: '', start: new Date(), end: addDays(new Date(), 1), progress: 0, type: 'task' });
  const ganttRef = useRef(null);

  const handleAddTask = (task) => {
    setTasks([...tasks, { ...task, id: Date.now() }]);
  };

  const handleEditTask = (updatedTask) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gantt Project - BOLT.DIY</h1>

      <div className="mb-4">
        <TaskForm
          onAddTask={handleAddTask}
          newTask={newTask}
          onTaskChange={handleTaskChange}
          onDateChange={handleDateChange}
        />
      </div>

      <div className="mb-4 flex space-x-2">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleZoomIn}>Zoom In</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleZoomOut}>Zoom Out</button>
         <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleExport}>Export to JSON</button>
        <input type="file" accept=".json" onChange={handleImport} />
      </div>

      <div className="overflow-x-auto">
        <Gantt ref={ganttRef} tasks={tasks} onEditTask={handleEditTask} onDeleteTask={handleDeleteTask} />
      </div>
    </div>
  );
}

export default App;
