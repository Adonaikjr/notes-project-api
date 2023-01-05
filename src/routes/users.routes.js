const { Router, response } = require("express");
const user_controller = require("../controllers/user_controller");

const userRouters = Router();

const userController = new user_controller();

userRouters.post("/", userController.createUser);
userRouters.put("/:id", userController.UpdateUser);

module.exports = userRouters;
