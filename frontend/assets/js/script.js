const userData = JSON.parse(localStorage.getItem("user"));
if (userData) {
  window.location.href = 'pages/profile.html'
}


const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

function signup() {
  const Firstname = document.querySelector(".firstname").value;
  const Lastname = document.querySelector(".lastname").value;
  const Username = document.querySelector(".username").value;
  const Password = document.querySelector(".password").value;

  if (!Firstname || !Lastname || !Username || !Password) {
    alert(
      "Iltmos inputni bo'sh qoldirmang. \nPlease do not leave the input blank.\nПожалуйста, не оставляйте поле пустым"
    );
  } else {
    axios
      .post(`http://localhost:4180/user/signup`, {
        firstname: Firstname,
        lastname: Lastname,
        username: Username,
        password: Password,
      })
      .then((res) => {
        signUpMessage();
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 400) {
            showSignUpError();
          } else {
            alert(
              "Ro'yxatdan o'tishda xatolik yuz berdi. Qaytadan urinib ko'ring."
            );
          }
        } else {
          alert(
            "Serverga ulanishda muammo bor. Iltimos, keyinroq urinib ko'ring."
          );
        }
      });
  }
}

function signUpMessage() {
  const sign_up_message = document.querySelector(".sign_up_message");
  sign_up_message.style.display = "flex";
  container.style.display = "none";
}

function login() {
  const userN = document.querySelector("#username").value;
  const passW = document.querySelector("#password").value;

  if (!userN && !passW) {
    alert(
      "Iltmos inputni bo'sh qoldirmang. \nPlease do not leave the input blank.\nПожалуйста, не оставляйте поле пустым"
    );
  } else {
    axios
      .post(`http://localhost:4180/user/login`, {
        username: userN,
        password: passW,
      })
      .then((response) => {
        const user = response.data;
        localStorage.setItem("user", JSON.stringify(user));
        LogInMessage();
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            showError();
          } else {
            alert(
              "Ro'yxatdan o'tishda xatolik yuz berdi. Qaytadan urinib ko'ring."
            );
          }
        } else {
          alert(
            "Serverga ulanishda muammo bor. Iltimos, keyinroq urinib ko'ring."
          );
        }
      });
  }
}

function LogInMessage() {
  const login_message = document.querySelector(".login_message");
  container.style.display = "none";

  login_message.style.display = "flex";
  setTimeout(() => {
    window.location.href = "pages/profile.html";
  }, 3000);
}

function showError() {
  const errorMessage = document.querySelector(".error-message");
  const errorText = document.querySelector(".error_text");

  if (errorMessage && errorText) {
    errorText.innerHTML = "Username or Password is incorrect.";
    errorMessage.style.right = "-300px";
    errorMessage.style.opacity = "1";
    errorMessage.style.transition = "right 1s ease, opacity 1s ease";

    setTimeout(() => {
      errorMessage.style.right = "0";
    }, 10);

    setTimeout(() => {
      errorMessage.style.opacity = "0";
    }, 4000);
  }
}

function showSignUpError() {
  const errorMessage = document.querySelector(".error-message");
  const errorText = document.querySelector(".error_text");

  if (errorMessage && errorText) {
    errorText.innerHTML = "Username already taken, please choose another one";
    errorMessage.style.right = "-300px";
    errorMessage.style.opacity = "1";
    errorMessage.style.transition = "right 1s ease, opacity 1s ease";

    setTimeout(() => {
      errorMessage.style.right = "0";
    }, 10);

    setTimeout(() => {
      errorMessage.style.opacity = "0";
    }, 4000);
  }
}
