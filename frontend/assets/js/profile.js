const user_info = document.querySelector(".user_info");
const userTitle = document.querySelector(".userTitle");
const MyCards = document.querySelector(".MyCards");
const addImgModal = document.querySelector(".addImgModal");

const userData = JSON.parse(localStorage.getItem("user"));
const token = JSON.parse(localStorage.getItem("token"));
// console.log(userData);
// console.log(token);

// user ismini navbarda ko'rsatish
function userInfo() {
  userTitle.innerHTML = `
        <span>${userData.firstname}</span> <span>${userData.lastname}</span>
    `;
  showUserImages(userData.id);
}
// rasmlarni ekranga chiqarish
function showUserImages(userId) {
  axios
    .post(
      `https://full-stack-crud-photo-gallery-with-users.onrender.com/profile/imgs`,
      { id: userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => {
      const userImages = res.data;
      console.log(userImages);
      MyCards.innerHTML = ""; // HTML tozalash

      let cardsHTML = ""; // HTML string yaratish

      userImages.map((img) => {
        cardsHTML += `
          <div class="f-card">
              <div class="reference">
                  <img class="reference-thumb" src="${img.url}" />
              </div>
              <div class="social">
                  <div class="social-content"></div>
                  <div class="social-buttons">
                      <div class="likeDiv">
                          <i onclick="clickLikeButton(${img.id})" id="like_${img.id}" class="fa fa-thumbs-up"></i> 
                          <span onclick="openImgModal(${img.id})" id="likeSpan_${img.id}" class='likeSpan'>Like</span>
                      </div>
                      <span><i class="fa fa-comment"></i></span>
                      <span><i class="fa fa-share"></i></span>
                      <span onclick="deleteImg(${img.id})">
                          <i class="fa-solid fa-trash-can"></i>
                      </span>
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

      MyCards.innerHTML = cardsHTML; // Barcha HTML-ni bir martada qo‘shish

      // Rasmlar uchun like sonini yuklash
      userImages.forEach((img) => {
        getLikeCount(img.id);
      });
    })
    .catch((err) => {
      console.error("Error loading images:", err);
    });
}

function openImgModal(id) {
  const modal__text_div = document.querySelector(".modal__text_div");
  const modal_container = document.querySelector(".modal-container");
  modal_container.style.display = "flex";
  axios
    .post(
      `https://full-stack-crud-photo-gallery-with-users.onrender.com/fav/clickedLikes`,
      {
        image_id: id,
      }
    )
    .then((res) => {
      const result = res.data;
      modal__text_div.innerHTML = "";
      result.map((user) => {
        modal__text_div.innerHTML += `
      <p class="modal__text">${user.firstname} ${user.lastname}</p>
      `;
      });
    });
}
function closeImgModal() {
  const modal_container = document.querySelector(".modal-container");
  modal_container.style.display = "none";
}

async function getLikeCount(imageId) {
  try {
    const response = await axios.post(
      "https://full-stack-crud-photo-gallery-with-users.onrender.com/userLike/likes",
      {
        images_id: imageId,
      }
    );
    const likeCount = response.data.like_count || 0;

    const likeSpan = document.getElementById(`likeSpan_${imageId}`);
    if (likeSpan) {
      likeSpan.innerHTML = likeCount;
    }
  } catch (error) {
    console.error("Error fetching like count:", error);
  }
}

function clickLikeButton(imageId) {
  const likeIcon = document.getElementById(`like_${imageId}`);
  if (!likeIcon) return;

  // Rangni darhol o‘zgartirish (yaxshi UX uchun)
  likeIcon.style.color = likeIcon.style.color === "blue" ? "black" : "blue";

  axios
    .post(
      "https://full-stack-crud-photo-gallery-with-users.onrender.com/userLike/like",
      {
        user_id: userData.id,
        images_id: imageId,
      }
    )
    .then((res) => {
      console.log("Like response:", res.data);
      const boolLike = res.data.liked;
      likeIcon.style.color = boolLike ? "blue" : "black";
      getLikeCount(imageId); // Like sonini yangilash
    })
    .catch((error) => {
      console.error("Error liking image:", error);
    });
}

// user uchun yangi rasm qo'shish
function addImgUser() {
  const fileInput = document.getElementById("photo");
  const file = fileInput.files[0];

  const formData = new FormData();
  formData.append("photo", file);
  formData.append("userid", userData.id);

  console.log(userData.id);
  console.log(file);

  axios
    .post(
      `https://full-stack-crud-photo-gallery-with-users.onrender.com/profile/addImg`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      }
    )
    .then(() => {
      closeModal();
      userInfo();
    });
}

// rasmlarni o'chirib yuborish
function deleteImg(imgId) {
  console.log(imgId);
  axios
    .post(
      `https://full-stack-crud-photo-gallery-with-users.onrender.com/profile/deleteImg`,
      {
        id: imgId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then(() => {
      userInfo();
    });
}
// agar ro'yhatdan o'tmagan user link bo'yicha kiradigan bo'lsa uni sign pagega yuboradi.
if (!userData) {
  logOut();
}
function myFavouritesPage() {
  window.location.href = "/pages/myFavourites.html";
}
function allImagesShow() {
  window.location.href = "/pages/all_Images.html";
}
function logOut() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.location.href = "../index.html";
}
// modalni ochib yopish
function closeModal() {
  addImgModal.style.display = "none";
}
function openModal() {
  addImgModal.style.display = "flex";
}

userInfo();
