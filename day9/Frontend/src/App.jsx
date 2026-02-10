import React, { useState, useEffect } from 'react'
import Nav from './components/Nav'
import Task from './components/Task'
import Inprogress from './components/Inprogress'
import Complete from './components/Complete'
import axios from 'axios';

const App = () => {
  const [tasks, setTasks] = useState([])
  const [inProgress, setInProgress] = useState([])
  const [completed, setCompleted] = useState([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
 
  function fetchNotes() {
      axios.get('http://localhost:3000/api/notes')
      .then(res => {
        const fetchedTasks = res.data.notes.map(note => ({
          id: note._id,
          title: note.title,
          createdAt: new Date(note.createdAt).toLocaleString()
        }))
        setTasks(fetchedTasks)
      })
      .catch(error => {
        console.error('Error fetching tasks:', error)
      })
  }
  useEffect(() => {
    fetchNotes()
  }, [])

  const addTask = (title) => {
    if (!title.trim()) return

    axios.post('http://localhost:3000/api/notes', { title })
      .then(res => {
        const note = res.data.note
        const newTask = {
          id: note._id,
          title: note.title,
          createdAt: new Date(note.createdAt).toLocaleString()
        }
        setTasks(prev => [...prev, newTask])
        setNewTaskTitle('')
      })
      .catch(err => console.error('Error adding task:', err))
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