const userData = JSON.parse(localStorage.getItem("user"));
console.log(userData);

const userTitle = document.querySelector(".userTitle");
const AllCards = document.querySelector(".AllCards");

// user ismini navbarda ko'rsatish
function userInfo() {
  userTitle.innerHTML = `
        <span>${userData[0].firstname}</span> <span>${userData[0].lastname}</span>
    `;
  showAllImages();
}

function showAllImages() {
  axios.get(`http://localhost:4180/allimg`).then((res) => {
    const usersInfo = res.data.user;
    console.log(usersInfo);
    AllCards.innerHTML = " ";
    usersInfo.map((info) => {
      AllCards.innerHTML += `
        <div class="f-card">
          <div class="header">
            <div class="co-name">${info.firstname} ${info.lastname}</div>
          </div>
          <div class="reference">
            <img class="reference-thumb" src="${info.imageurl}" />
          </div>
          <div class="social">
            <div class="social-content"></div>
            <div class="social-buttons">
              <span  onclick="clickAllLikeButton(${info.image_id})">
                <i id="like_${info.image_id}" class="fa fa-thumbs-up"></i> 
                <span id="likeSpan_${info.image_id}" class='likeSpan'>Like</span>
              </span>
              <span><i class="fa fa-comment"></i>Comment</span>
              <span><i class="fa fa-share"></i>Share</span>
            </div>
          </div>
        </div>
        `;
    });
    usersInfo.forEach((info) => {
      getAllLikeCount(info.image_id);
      // console.log(info.image_id);
    });
  });
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
function myFavouritesPage() {
  window.location.href = "/pages/myFavourites.html";
}

userInfo();
