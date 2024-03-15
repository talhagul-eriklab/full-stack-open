const notesRouter = require("express").Router();
const Note = require("../models/note");
const User = require("../models/user");

// notesRouter.get("/", (request, response) => {
//   Note.find({}).then((notes) => {
//     response.json(notes);
//   });
// });

notesRouter.get("/", async (request, response) => {
  const notes = await Note.find({}).populate("user", { username: 1, name: 1 });
  response.json(notes);
});

notesRouter.get("/:id", async (request, response, next) => {
  const id = Number(request.params.id);

  try {
    const note = await Note.findOne({ id: id });
    if (note) {
      response.json(note);
    } else {
      response.status(404).json({ error: "Note bulunamadı" });
    }
  } catch (error) {
    next(error);
  }
});

notesRouter.post("/", async (request, response, next) => {
  const body = request.body;
  console.log(body);
  const user = await User.findOne({ id: body.id });

  if (!body) {
    return response.status(400).json({ error: "Veri eksik" });
  }

  try {
    const count = await Note.countDocuments();
    const note = new Note({
      id: count + 1,
      content: body.content,
      important: body.important || false,
      user: user.id,
    });

    const savedNote = await note.save();
    user.notes = user.notes.concat(savedNote._id);
    await user.save();
    response.json(savedNote);
  } catch (error) {
    next(error);
  }
});

notesRouter.put("/:id", async (request, response, next) => {
  const id = request.params.id;
  const body = request.body;

  const user = await User.findById(body.userId);

  if (!body) {
    return response.status(400).json({ error: "Veri eksik" });
  }

  try {
    const updatedNote = await Note.findOneAndUpdate(
      { id: id },
      { content: body.content, important: body.important, user: user.id },
      { new: true }
    );

    if (!updatedNote) {
      return response.status(404).json({ error: "Note bulunamadı" });
    }

    response.json(updatedNote);
  } catch (error) {
    next(error);
  }
});

notesRouter.delete("/:id", async (request, response, next) => {
  const id = Number(request.params.id);

  try {
    const note = await Note.findOneAndDelete({ id: id });
    if (note) {
      `${response.json(note)} silindi`;
    } else {
      console.error("Kişi aranırken bir hata oluştu:", error);
      response.status(500).json({ error: "Kişi aranırken bir hata oluştu" });
    }
  } catch (error) {
    next(error);
  }
  response.status(204).end();
});

module.exports = notesRouter;
