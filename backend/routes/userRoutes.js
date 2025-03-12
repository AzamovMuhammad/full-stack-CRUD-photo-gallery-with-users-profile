const express = require("express");
const { login, signup, getInfo } = require("../controllers/userController");
const enterRouter = express.Router();

enterRouter.post('/login', login);
enterRouter.post('/signup', signup);
enterRouter.get('/' , getInfo)

module.exports = enterRouter;