const { Router } = require("express");
const tags_controller = require("../controllers/tags_controller");

const tagsRouters = Router();

const tagsController = new tags_controller();

tagsRouters.get("/:user_id", tagsController.listTags);

module.exports = tagsRouters;
