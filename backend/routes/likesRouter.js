const express = require("express");
const { likesCount, likeCond } = require("../controllers/likesController");
const likesRouter = express.Router();

likesRouter.post('/likes', likesCount)
likesRouter.post('/like', likeCond)

module.exports = likesRouter
