const express = require("express");
const { imgsUser, addImgs, deleteImages } = require("../controllers/myPhotosController");
const myPhotosRouter = express.Router();

myPhotosRouter.post('/imgs', imgsUser)
myPhotosRouter.post('/addImg', addImgs)
myPhotosRouter.post('/deleteImg', deleteImages)

module.exports = myPhotosRouter;