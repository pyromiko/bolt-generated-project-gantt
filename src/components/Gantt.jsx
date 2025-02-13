import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { format, addDays, differenceInDays, startOfDay } from 'date-fns';
import Draggable from 'react-draggable';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import TaskEditModal from './TaskEditModal';

const Gantt = forwardRef(({ tasks, onEditTask, onDeleteTask }, ref) => {
  const [startDate, setStartDate] = useState(startOfDay(new Date()));
  const [endDate, setEndDate] = useState(addDays(startDate, 30));
  const [zoomLevel, setZoomLevel] = useState('month');
  const [taskBeingDragged, setTaskBeingDragged] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const ganttBodyRef = useRef(null);

  const zoomLevels = {
    day: 1,
    week: 7,
    month: 30,
  };

  const [columnWidth, setColumnWidth] = useState(zoomLevels[zoomLevel]);

  useEffect(() => {
    setColumnWidth(zoomLevels[zoomLevel]);
  }, [zoomLevel]);

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

  const calculatePosition = (taskStart) => {
    const diff = differenceInDays(taskStart, startDate);
    return (diff * (700 / columnWidth));
  };

  const calculateWidth = (taskStart, taskEnd) => {
    const diff = differenceInDays(taskEnd, taskStart);
    return (diff * (700 / columnWidth));
  };

  const handleTaskDrag = (e, data, task) => {
    setTaskBeingDragged(task);
  };

  const handleTaskStop = (e, data, task) => {
    if (!taskBeingDragged) return;

    const daysMoved = Math.round(data.x / (700 / columnWidth));
    const newStart = addDays(task.start, daysMoved);
    const newEnd = addDays(task.end, daysMoved);

    onEditTask({ ...task, start: newStart, end: newEnd });
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
    onEditTask(updatedTask);
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

  return (
    <div>
      <table className="table-auto w-full">
        <thead>
          <tr>{renderHeader()}</tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td className="border p-2 relative">
                <Draggable
                  axis="x"
                  bounds="parent"
                  onDrag={(e, data) => handleTaskDrag(e, data, task)}
                  onStop={(e, data) => handleTaskStop(e, data, task)}
                >
                  <div
                    className={`absolute h-6 rounded ${task.type === 'milestone' ? 'bg-green-500' : 'bg-blue-500'} text-white text-center`}
                    style={{
                      left: `${calculatePosition(task.start)}px`,
                      width: `${calculateWidth(task.start, task.end)}px`,
                    }}
                  >
                    {task.name} ({task.progress}%)
                    <div className="absolute top-1/2 right-2 transform -translate-y-1/2 space-x-1">
                      <PencilIcon className="h-4 w-4 cursor-pointer" onClick={() => handleEditClick(task)} />
                      <TrashIcon className="h-4 w-4 cursor-pointer" onClick={() => handleDeleteClick(task)} />
                    </div>
                  </div>
                </Draggable>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <TaskEditModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          task={selectedTask}
          onUpdate={handleTaskUpdate}
        />
      )}
    </div>
  );
});

export default Gantt;
