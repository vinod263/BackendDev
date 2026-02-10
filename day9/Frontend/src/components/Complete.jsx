import React from 'react'

const Complete = ({ tasks, onDragStart, onDragOver, onDrop, onDelete }) => {
  return (
    <div 
      className="complete-window"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <h2>✅ Completed</h2>
      <div className="tasks-list">
        {tasks.length === 0 ? (
          <p className="empty-state">Drag completed tasks here</p>
        ) : (
          tasks.map((task) => (
            <div 
              key={task.id} 
              className="task-card completed"
              draggable
              onDragStart={(e) => onDragStart(e, task, 'complete')}
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

export default Complete