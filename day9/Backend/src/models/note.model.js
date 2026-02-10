const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
}, { timestamps: true });

const noteModel = mongoose.model('Note', noteSchema);

module.exports = noteModel;