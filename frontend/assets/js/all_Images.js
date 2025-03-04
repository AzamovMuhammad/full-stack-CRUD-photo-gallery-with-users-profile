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
  axios.get(`http://localhost:4180/allUser/allimg`).then((res) => {
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
              <div class="likeDiv"  >
                <i onclick="clickAllLikeButton(${info.image_id})" id="like_${info.image_id}" class="fa fa-thumbs-up"></i> 
                <span onclick="openImgModal(${info.image_id})" id="likeSpan_${info.image_id}" class='likeSpan'>Like</span>
              </div>
              <span><i class="fa fa-comment"></i>Comment</span>
              <span><i class="fa fa-share"></i>Share</span>
              <div class="box">
                <div class="modal-container" id="m2-o" style="--m-background: hsla(0, 0%, 0%, .4);">
                  <div class="modal">
                    <h1 class="modal__title">Users who clicked like</h1>
                    <div class="modal__text_div">
                     
                    </div>
                    <a href="#m2-c" onclick="closeImgModal()" class="link-2"></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        `;
    });
    usersInfo.forEach((info) => {
      getAllLikeCount(info.image_id);
    });
  });
}


function openImgModal(id) {
  const modal__text_div = document.querySelector('.modal__text_div')
  const modal_container = document.querySelector('.modal-container')
  modal_container.style.display = 'flex'
  axios.post(`http://localhost:4180/fav/clickedLikes`, {
    image_id:id
  })
  .then((res) => {
    const result = res.data;
    modal__text_div.innerHTML = ''
    result.map((user) => {
      modal__text_div.innerHTML += `
      <p class="modal__text">${user.firstname} ${user.lastname}</p>
      `
    })
  })
}
function closeImgModal() {
  const modal_container = document.querySelector('.modal-container')
  modal_container.style.display = 'none'
}

async function getAllLikeCount(imageId) {
  try {
    const response = await axios.post(`http://localhost:4180/userLike/likes`, {
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
    .post("http://localhost:4180/userLike/like", {
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
if (!userData) {
  logOut();
}
function logOut() {
  localStorage.removeItem("user");
  window.location.href = "../index.html";
}
function myImages() {
  window.location.href = "/pages/profile.html";
}
function myFavouritesPage() {
  window.location.href = "/pages/myFavourites.html";
}

userInfo();
