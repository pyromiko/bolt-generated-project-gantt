import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { format, addDays, differenceInDays, startOfDay } from 'date-fns';
import Draggable from 'react-draggable';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import TaskEditModal from './TaskEditModal';
import { ArrowRightIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

const Gantt = forwardRef(({ tasks, onEditTask, onDeleteTask }, ref) => {
  const [startDate, setStartDate] = useState(startOfDay(new Date()));
  const [endDate, setEndDate] = useState(addDays(startDate, 30));
  const [zoomLevel, setZoomLevel] = useState('month');
  const [taskBeingDragged, setTaskBeingDragged] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});
  const ganttBodyRef = useRef(null);
  const [dependencies, setDependencies] = useState([]);

  const zoomLevels = {
    day: 1,
    week: 7,
    month: 30,
  };

  const [columnWidth, setColumnWidth] = useState(zoomLevels[zoomLevel]);

  useEffect(() => {
    setColumnWidth(zoomLevels[zoomLevel]);
  }, [zoomLevel]);

  useEffect(() => {
    // Update start and end dates based on tasks
    if (tasks.length > 0) {
      const taskStartDates = tasks.map(task => task.start);
      const taskEndDates = tasks.map(task => task.end);

      const minDate = new Date(Math.min(...taskStartDates));
      const maxDate = new Date(Math.max(...taskEndDates));

      setStartDate(startOfDay(minDate));
      setEndDate(addDays(maxDate, 1)); // Extend the end date by one day
    } else {
      // Reset to default if no tasks
      setStartDate(startOfDay(new Date()));
      setEndDate(addDays(startOfDay(new Date()), 30));
    }
  }, [tasks]);

  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      if (zoomLevel === 'month') return;
      setZoomLevel(zoomLevel === 'day' ? 'week' : 'month');
    },
    zoomOut: () => {
      if (zoomLevel === 'day') return;
      setZoomLevel(zoomLevel === 'month' ? 'week' : 'day');
    },
  }));

  const chartWidth = 1200; // Increased chart width

  const calculatePosition = (taskStart) => {
    const diff = differenceInDays(taskStart, startDate);
    return (diff * (chartWidth / columnWidth));
  };

  const calculateWidth = (taskStart, taskEnd) => {
    const diff = differenceInDays(taskEnd, taskStart);
    return (diff * (chartWidth / columnWidth));
  };

  const handleTaskDrag = (e, data, task) => {
    setTaskBeingDragged(task);
  };

  const handleTaskStop = (e, data, task) => {
    if (!taskBeingDragged) return;

    const daysMoved = Math.round(data.x / (chartWidth / columnWidth));
    const newStart = addDays(task.start, daysMoved);
    const newEnd = addDays(task.end, daysMoved);

    // Validate dependencies before updating
    if (validateDependencies(task, newStart, newEnd)) {
      onEditTask({ ...task, start: newStart, end: newEnd });
    } else {
      alert('This move violates task dependencies.');
    }
    setTaskBeingDragged(null);
  };

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (task) => {
    onDeleteTask(task.id);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleTaskUpdate = (updatedTask) => {
    // Validate dependencies before updating
    if (validateDependencies(updatedTask, updatedTask.start, updatedTask.end)) {
      onEditTask(updatedTask);
    } else {
      alert('This update violates task dependencies.');
    }
    setIsModalOpen(false);
  };

  const renderHeader = () => {
    const header = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      header.push(
        <th key={currentDate} className="border text-center py-2 w-24">
          {format(currentDate, 'dd/MM/yyyy')}
        </th>
      );
      currentDate = addDays(currentDate, 1);
    }
    return header;
  };

  const getTaskDependencies = (task) => {
    // Assuming each task has a 'dependencies' field which is an array of task IDs
    return task.dependencies || [];
  };

  const validateDependencies = (task, newStart, newEnd) => {
    const dependencies = getTaskDependencies(task);
    for (const dependencyId of dependencies) {
      const dependency = tasks.find(t => t.id === dependencyId);
      if (dependency && newStart < dependency.end) {
        return false; // Task cannot start before its dependency ends
      }
    }
    return true;
  };

  const updateTaskDates = (task) => {
    // Implement automatic update of dates based on dependencies
    // This is a placeholder, actual implementation will depend on the specific logic
    return task;
  };

  const toggleGroup = (taskId) => {
    setExpandedGroups(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const isGroupExpanded = (taskId) => {
    return expandedGroups[taskId] || false;
  };

  const renderTaskRow = (task, level = 0) => {
    if (!task) {
      return null;
    }

    const isGroup = task.children && task.children.length > 0;
    const marginLeft = level * 20;

    console.log("Rendering Task:", task); // ADDED LOGGING

    const taskWidth = calculateWidth(task.start, task.end);
    const taskPosition = calculatePosition(task.start);

    // Calculate the width of the completed portion of the task
    const completedWidth = (taskWidth * task.progress) / 100;

    return (
      <React.Fragment key={task.id}>
        <tr key={task.id}>
          <td className="border p-2 relative">
            <div style={{ marginLeft: `${marginLeft}px` }}>
              {isGroup && (
                <button onClick={() => toggleGroup(task.id)} className="mr-2">
                  {isGroupExpanded(task.id) ? (
                    <ChevronUpIcon className="h-5 w-5 inline-block" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 inline-block" />
                  )}
                </button>
              )}
              <Draggable
                axis="x"
                bounds="parent"
                onDrag={(e, data) => handleTaskDrag(e, data, task)}
                onStop={(e, data) => handleTaskStop(e, data, task)}
              >
                <div
                  className={`absolute h-6 rounded ${task.type === 'milestone' ? 'bg-green-500' : 'bg-blue-500'} text-white text-center`}
                  style={{
                    left: `${taskPosition}px`,
                    width: `${taskWidth}px`,
                  }}
                >
                  <div
                    className="absolute h-full left-0 top-0 bg-green-300 rounded"
                    style={{
                      width: `${completedWidth}px`,
                      zIndex: 1, // Ensure it's behind the text
                    }}
                  ></div>
                  <span style={{ zIndex: 2, position: 'relative' }}>{task.name} (ID: {task.id}) ({task.progress}%)</span>
                  <div className="absolute top-1/2 right-2 transform -translate-y-1/2 space-x-1">
                    <PencilIcon className="h-4 w-4 cursor-pointer" onClick={() => handleEditClick(task)} />
                    <TrashIcon className="h-4 w-4 cursor-pointer" onClick={() => handleDeleteClick(task)} />
                  </div>
                </div>
              </Draggable>
            </div>
          </td>
        </tr>
        {isGroup && isGroupExpanded(task.id) && task.children.map(child => {
          const childTask = tasks.find(t => t.id === child);
          if (childTask) {
            return renderTaskRow(childTask, level + 1);
          }
          return null;
        })}
      </React.Fragment>
    );
  };

  const renderDependencies = () => {
    const arrows = [];

    tasks.forEach(task => {
      const dependencies = getTaskDependencies(task);
      dependencies.forEach(dependencyId => {
        const dependency = tasks.find(t => t.id === dependencyId);
        if (dependency) {
          const startX = calculatePosition(dependency.end) + calculateWidth(dependency.start, dependency.end);
          const startY = ganttBodyRef?.current?.offsetTop + (tasks.indexOf(dependency) * 30) + 15; // Approximate center of the dependency task

          const endX = calculatePosition(task.start);
          const endY = ganttBodyRef?.current?.offsetTop + (tasks.indexOf(task) * 30) + 15; // Approximate center of the current task

          arrows.push(
            <line
              key={`${task.id}-${dependencyId}`}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="black"
              strokeWidth="2"
            />
          );
        }
      });
    });

    return (
      <svg width={chartWidth} height="500" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
        {arrows}
      </svg>
    );
  };

  // Modified renderTasks to render all tasks
  const renderTasks = () => {
    return tasks.map(task => renderTaskRow(task));
  };


  return (
    <div style={{ position: 'relative' }}>
      <table className="table-auto w-full" style={{ height: '500px' }}>
        <thead>
          <tr>{renderHeader()}</tr>
        </thead>
        <tbody ref={ganttBodyRef}>
          {renderTasks()}
        </tbody>
      </table>
      {renderDependencies()}

      {isModalOpen && (
        <TaskEditModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          task={selectedTask}
          onUpdate={handleTaskUpdate}
          tasks={tasks}
        />
      )}
    </div>
  );
});

export default Gantt;
