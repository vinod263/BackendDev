const express = require('express');
const noteModel = require('./models/note.model');
const cors = require('cors');
const app = express();

// Allow requests from your React app's origin
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your actual React app URL (Vite default)
    credentials: true // If you need to send cookies
};

app.use(express.json());
app.use(cors(corsOptions)); // Enable CORS for all routes

app.post('/api/notes',async (req, res) => {
    const {title,description} = req.body;
    const note = await noteModel.create({title,description});
    res.status(201).json({
        message:'note is created successfully',
        note
    });
});

app.get('/api/notes', async (req, res) => {
    const notes = await noteModel.find()
    res.status(200).json({
        message: "Notes fetched successfully.",
        notes
    })
});

/**
 * - DELETE /api/notes/:id
 * - Delete note with the id from req.params
 */
app.delete('/api/notes/:id', async (req, res) => {
    const id = req.params.id

    await noteModel.findByIdAndDelete(id)
    res.status(200).json({
        message: "Note deleted successfully."
    })
})

/**
 * -patch /api/notes/:id
 * - update note with the id from req.params
 * - req.body ={description}
 * 
 */
app.patch('/api/notes/:id', async (req, res) => {
    const id = req.params.id
    const {title} = req.body
    const updatedNote = await noteModel.findByIdAndUpdate(id, {title}, {new: true})
    res.status(200).json({
        message: "Note updated successfully.",
        updatedNote
    })
})

module.exports = app;
