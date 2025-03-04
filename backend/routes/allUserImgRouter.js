const express = require("express");
const { allUserImg } = require("../controllers/allUserImgControllers");
const allImgRouter = express.Router();

allImgRouter.get('/allimg', allUserImg);

module.exports = allImgRouter;