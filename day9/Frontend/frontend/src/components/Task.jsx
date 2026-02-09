import React from 'react'

const Task = ({ tasks, onDragStart, onDragOver, onDrop, onDelete }) => {
  return (
    <div 
      className="task-window" 
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <h2>📝 To Do</h2>
      <div className="tasks-list">
        {tasks.length === 0 ? (
          <p className="empty-state">Drag tasks here or create new ones</p>
        ) : (
          tasks.map((task) => (
            <div 
              key={task.id} 
              className="task-card"
              draggable
              onDragStart={(e) => onDragStart(e, task, 'task')}
            >
              <div className="task-content">
                <h3>{task.title}</h3>
                <span className="task-time">{task.createdAt}</span>
              </div>
              <button 
                className="delete-btn"
                onClick={() => onDelete(task.id)}
                title="Delete task"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Task