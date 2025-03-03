const user_info = document.querySelector(".user_info");
const userTitle = document.querySelector(".userTitle");
const MyCards = document.querySelector(".MyCards");
const addImgModal = document.querySelector(".addImgModal");

const userData = JSON.parse(localStorage.getItem("user"));
console.log(userData);

// user ismini navbarda ko'rsatish
function userInfo() {
  userTitle.innerHTML = `
        <span>${userData[0].firstname}</span> <span>${userData[0].lastname}</span>
    `;
  showUserImages(userData[0].id);
}
// rasmlarni ekranga chiqarish
function showUserImages(userId) {
  axios
    .post(`http://localhost:4180/imgs`, { id: userId })
    .then((res) => {
      const userImages = res.data;
      console.log(userImages);
      MyCards.innerHTML = ""; // HTML tozalash

      let cardsHTML = ""; // HTML string yaratish

      userImages.forEach((img) => {
        cardsHTML += `
          <div class="f-card">
              <div class="reference">
                  <img class="reference-thumb" src="${img.imageurl}" />
              </div>
              <div class="social">
                  <div class="social-content"></div>
                  <div class="social-buttons">
                      <div class="likeDiv">
                          <i onclick="clickLikeButton(${img.id})" id="like_${img.id}" class="fa fa-thumbs-up"></i> 
                          <span onclick="openImgModal(${img.id})" id="likeSpan_${img.id}" class='likeSpan'>Like</span>
                      </div>
                      <span><i class="fa fa-comment"></i> Comment</span>
                      <span><i class="fa fa-share"></i> Share</span>
                      <span onclick="deleteImg(${img.id})">
                          <i class="fa-solid fa-trash-can"></i> Trash
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
  const modal__text_div = document.querySelector('.modal__text_div')
  const modal_container = document.querySelector('.modal-container')
  modal_container.style.display = 'flex'
  axios.post(`http://localhost:4180/clickedLikes`, {
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



async function getLikeCount(imageId) {
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

    // Agar like soni 0 dan katta bo‘lsa, kok aks holda qora bo‘lsin
    if (likeCount > 0) {
      likeIcon.style.color = "blue";
    } else {
      likeIcon.style.color = "black";
    }
  } catch (error) {
    console.error("Error fetching like count:", error);
  }
}
function clickLikeButton(imageId) {
  axios
    .post("http://localhost:4180/like", {
      user_id: userData[0].id,
      images_id: imageId,
    })
    .then((res) => {
      console.log("Like response:", res.data);
      getLikeCount(imageId); // Like bosilgandan keyin yangilash
    })
    .catch((error) => {
      console.error("Error liking image:", error);
    });
}
// user uchun yangi rasm qo'shish
function addImgUser() {
  const newImg = document.querySelector(".newImg").value;
  console.log(newImg);
  axios
    .post(`http://localhost:4180/addImg`, {
      imageurl: newImg,
      userid: userData[0].id,
    })
    .then(() => {
      closeModal();
      userInfo();
    });
}
// rasmlarni o'chirib yuborish
function deleteImg(imgId) {
  console.log(imgId);
  axios
    .post(`http://localhost:4180/deleteImg`, {
      id: imgId,
    })
    .then(() => {
      userInfo();
    });
}
// agar ro'yhatdan o'tmagan user link bo'yicha kiradigan bo'lsa uni sign pagega yuboradi.
if (!userData) {
  logOut();
}
function myFavouritesPage() {
  window.location.href = '/pages/myFavourites.html'
}
function allImagesShow() {
  window.location.href = '/pages/all_Images.html'
}
function logOut() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}
// modalni ochib yopish
function closeModal() {
  addImgModal.style.display = "none";
}
function openModal() {
  addImgModal.style.display = "flex";
}

userInfo();
