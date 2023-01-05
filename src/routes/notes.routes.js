const { Router } = require("express");
const notes_controller = require("../controllers/notes_controller");

const notesRouters = Router();

const notesController = new notes_controller();
const middleAuth = require("../middlewares/middleAuth");

notesRouters.use(middleAuth)

notesRouters.post("/", notesController.createNote);
notesRouters.get("/:id", notesController.detailsNote);
notesRouters.delete("/:id", notesController.deleteNote);
notesRouters.get("/", notesController.listNotes);

module.exports = notesRouters;
