import React, { useState } from 'react'

const Nav = ({ onAddTask, newTaskTitle, setNewTaskTitle }) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    onAddTask(newTaskTitle)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  return (
    <nav>
      <h1>📋 Task Manager</h1>
      <div className="nav-input-container">
        <input
          type="text"
          placeholder="Enter task title..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          className="nav-input"
        />
        <button onClick={handleSubmit} className="nav-add-btn">Add Task</button>
      </div>
    </nav>
  )
}

export default Nav