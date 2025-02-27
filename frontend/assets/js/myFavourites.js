const userData = JSON.parse(localStorage.getItem("user"));
console.log(userData);

const userTitle = document.querySelector(".userTitle");

// user ismini navbarda ko'rsatish
function userInfo() {
  userTitle.innerHTML = `
        <span>${userData[0].firstname}</span> <span>${userData[0].lastname}</span>
    `;
}




function myImages() {
  window.location.href = "/pages/profile.html";
}
function allImagesShow() {
  window.location.href = "/pages/all_Images.html";
}



userInfo()