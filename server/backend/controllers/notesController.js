const Note = require("../models/Note");

exports.getNotes = async (req, res) => {
  const notes = await Note.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json(notes);
};

exports.createNote = async (req, res) => {
  const note = await Note.create({ userId: req.userId, content: req.body.content });
  res.json(note);
};

exports.deleteNote = async (req, res) => {
  await Note.deleteOne({ _id: req.params.id, userId: req.userId });
  res.json({ message: "Note deleted" });
};
