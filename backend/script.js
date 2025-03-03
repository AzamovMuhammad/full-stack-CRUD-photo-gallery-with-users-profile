const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./config/db");
const { allUserImg } = require("./controllers/allUserImgControllers");
const { signup, login } = require("./controllers/userController");
const { myFavImg, clikedLikeByUsers } = require("./controllers/myFavControllers");
const { likesCount, likeCond } = require("./controllers/likesController");
const {
  addImgs,
  deleteImages,
  imgsUser,
} = require("./controllers/myPhotosController");

app.use(cors());
app.use(express.json());

app.post("/signup", signup);

app.post("/login", login);

app.post("/imgs", imgsUser);

app.post("/addImg", addImgs);

app.post("/deleteImg", deleteImages);

app.get("/allimg", allUserImg);

// Postdagi like-lar sonini olish
app.post("/likes", likesCount);

app.post("/like", likeCond);

app.post("/myFavourites", myFavImg);

app.post("/clickedLikes", clikedLikeByUsers);

const port = 4180;
app.listen(port, () => {
  console.log(`Server ${port}-portda ishga tushdi.`);
});
