const { Router } = require("express");
const tags_controller = require("../controllers/tags_controller");
const middleAuth = require("../middlewares/middleAuth");
const tagsRouters = Router();

const tagsController = new tags_controller();

tagsRouters.get("/", middleAuth, tagsController.listTags);

module.exports = tagsRouters;
