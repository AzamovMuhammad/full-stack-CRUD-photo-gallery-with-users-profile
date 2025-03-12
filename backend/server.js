const express = require("express");
const app = express();
const cors = require("cors");
const enterRouter = require("./routes/userRoutes");
const myPhotosRouter = require("./routes/myPhotosRoutes");
const allImgRouter = require("./routes/allUserImgRouter");
const likesRouter = require("./routes/likesRouter");
const myFavRouter = require("./routes/myFavRouter");

// middlewere
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"))

// log_in and sign_up pages
app.use("/user", enterRouter)

// userning profile 
app.use('/profile', myPhotosRouter)

// barcha userlar rasmlari
app.use('/allUser', allImgRouter)

// Postdagi like-lar sonini olish
app.use('/userLike', likesRouter)

// barcha sahifa uchun qo'shimchalarmmo
app.use('/fav', myFavRouter)

const port = 4180;
app.listen(port, () => {
  console.log(`Server ${port}-portda ishga tushdi.`);
});
