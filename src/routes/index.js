const { Router } = require("express");
const userRouters = require("./users.routes");
const notesRouters = require("./notes.routes");
const tagsRouters = require("./tags.routes");
const sessionRouter = require("./session.routes");

const routes = Router();

routes.use("/users", userRouters);
routes.use("/notes", notesRouters);
routes.use('/tags', tagsRouters)
routes.use('/session', sessionRouter)
module.exports = routes;
