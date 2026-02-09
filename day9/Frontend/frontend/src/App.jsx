import React, { useState, useEffect } from 'react'
import Nav from './components/Nav'
import Task from './components/Task'
import Inprogress from './components/Inprogress'
import Complete from './components/Complete'

const App = () => {
  const [tasks, setTasks] = useState([])
  const [inProgress, setInProgress] = useState([])
  const [completed, setCompleted] = useState([])
  const [newTaskTitle, setNewTaskTitle] = useState('')

  // Load from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('kanban_tasks')
    const savedInProgress = localStorage.getItem('kanban_inprogress')
    const savedCompleted = localStorage.getItem('kanban_completed')

    if (savedTasks) setTasks(JSON.parse(savedTasks))
    if (savedInProgress) setInProgress(JSON.parse(savedInProgress))
    if (savedCompleted) setCompleted(JSON.parse(savedCompleted))
  }, [])

  // Save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('kanban_tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('kanban_inprogress', JSON.stringify(inProgress))
  }, [inProgress])

  useEffect(() => {
    localStorage.setItem('kanban_completed', JSON.stringify(completed))
  }, [completed])

  const addTask = (title) => {
    if (title.trim()) {
      const newTask = {
        id: Date.now(),
        title: title,
        createdAt: new Date().toLocaleString()
      }
      setTasks([...tasks, newTask])
      setNewTaskTitle('')
    }
  }

  const deleteTask = (id, column) => {
    switch(column) {
      case 'task':
        setTasks(tasks.filter(t => t.id !== id))
        break
      case 'inprogress':
        setInProgress(inProgress.filter(t => t.id !== id))
        break
      case 'complete':
        setCompleted(completed.filter(t => t.id !== id))
        break
      default:
        break
    }
  }

  const handleDragStart = (e, task, column) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('task', JSON.stringify(task))
    e.dataTransfer.setData('source', column)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, targetColumn) => {
    e.preventDefault()
    const task = JSON.parse(e.dataTransfer.getData('task'))
    const sourceColumn = e.dataTransfer.getData('source')

    if (sourceColumn === targetColumn) return

    // Remove from source
    switch(sourceColumn) {
      case 'task':
        setTasks(tasks.filter(t => t.id !== task.id))
        break
      case 'inprogress':
        setInProgress(inProgress.filter(t => t.id !== task.id))
        break
      case 'complete':
        setCompleted(completed.filter(t => t.id !== task.id))
        break
      default:
        break
    }

    // Add to target
    switch(targetColumn) {
      case 'task':
        setTasks([...tasks, task])
        break
      case 'inprogress':
        setInProgress([...inProgress, task])
        break
      case 'complete':
        setCompleted([...completed, task])
        break
      default:
        break
    }
  }

  return (
    <div className="app-wrapper">
      <Nav onAddTask={addTask} newTaskTitle={newTaskTitle} setNewTaskTitle={setNewTaskTitle} />
      <div className="main-container">
        <div className="kanban-board">
          <Task 
            tasks={tasks} 
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'task')}
            onDelete={(id) => deleteTask(id, 'task')}
          />
          <Inprogress 
            tasks={inProgress}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'inprogress')}
            onDelete={(id) => deleteTask(id, 'inprogress')}
          />
          <Complete 
            tasks={completed}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'complete')}
            onDelete={(id) => deleteTask(id, 'complete')}
          />
        </div>
      </div>
    </div>
  )
}

export default App