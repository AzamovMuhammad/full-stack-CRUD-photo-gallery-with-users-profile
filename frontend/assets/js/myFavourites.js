const userData = JSON.parse(localStorage.getItem("user"));
console.log(userData);

const userTitle = document.querySelector(".userTitle");
const myFavCards = document.querySelector(".myFavouritesCards");

// user ismini navbarda ko'rsatish
function userInfo() {
  userTitle.innerHTML = `
        <span>${userData[0].firstname}</span> <span>${userData[0].lastname}</span>
    `;
    showAllFavourites()
}

function showAllFavourites() {
  axios.post(`http://localhost:4180/myFavourites`, {
    user_id: userData[0].id,
  })
  .then((res) => {
    const result = res.data
    console.log(result);
    myFavCards.innerHTML += " "
    result.map((favImg) => {
      myFavCards.innerHTML += `
      <div class="f-card">
        <div class="header">
          <div class="co-name">${favImg.firstname} ${favImg.lastname}</div>
        </div>
        <div class="reference">
          <img class="reference-thumb" src="${favImg.imageurl}" />
        </div>
        <div class="social">
          <div class="social-content"></div>
          <div class="social-buttons">
            <span  onclick="clickAllLikeButton(${favImg.image_id})">
              <i id="like_${favImg.image_id}" class="fa fa-thumbs-up"></i> 
              <span id="likeSpan_${favImg.image_id}" class='likeSpan'>Like</span>
            </span>
            <span><i class="fa fa-comment"></i>Comment</span>
            <span><i class="fa fa-share"></i>Share</span>
          </div>
        </div>
      </div>
      `
    })
  })
}

async function getAllLikeCount(imageId) {
  try {
    const response = await axios.post(`http://localhost:4180/likes`, {
      images_id: imageId,
    });

    const likeCount = response.data.like_count || 0;

    // ID bo‘yicha to‘g‘ri elementlarni olish
    const likeSpan = document.getElementById(`likeSpan_${imageId}`);
    const likeIcon = document.getElementById(`like_${imageId}`);

    if (likeSpan) {
      likeSpan.innerHTML = likeCount;
    }
  } catch (error) {
    console.error("Error fetching like count:", error);
  }
}

function clickAllLikeButton(imageId) {
  axios
    .post("http://localhost:4180/like", {
      user_id: userData[0].id,
      images_id: imageId,
    })
    .then((res) => {
      getAllLikeCount(imageId);
    })
    .catch((error) => {
      console.error("Error liking image:", error);
    });
}


function myImages() {
  window.location.href = "/pages/profile.html";
}
function allImagesShow() {
  window.location.href = "/pages/all_Images.html";
}

userInfo();
