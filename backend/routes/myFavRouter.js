const express = require("express");
const { myFavImg, clikedLikeByUsers } = require("../controllers/myFavControllers");
const myFavRouter = express.Router();

myFavRouter.post("/myFavourites", myFavImg)
myFavRouter.post("/clickedLikes", clikedLikeByUsers)

module.exports = myFavRouter;