const { Router, response } = require("express");
const user_controller = require("../controllers/user_controller");
const middleAuth = require("../middlewares/middleAuth");

const userRouters = Router();

const userController = new user_controller();

userRouters.post("/", userController.createUser);
userRouters.put("/", middleAuth, userController.UpdateUser);

module.exports = userRouters;
