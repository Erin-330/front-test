(function () {
  "use strict";

  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");
  const togglePassword = document.getElementById("toggle-password");
  const submitButton = form.querySelector(".submit-button");

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(input, errorEl, message) {
    if (message) {
      input.classList.add("invalid");
      errorEl.textContent = message;
    } else {
      input.classList.remove("invalid");
      errorEl.textContent = "";
    }
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    if (!value) {
      setError(emailInput, emailError, "이메일을 입력해주세요.");
      return false;
    }
    if (!EMAIL_RE.test(value)) {
      setError(emailInput, emailError, "올바른 이메일 형식이 아닙니다.");
      return false;
    }
    setError(emailInput, emailError, "");
    return true;
  }

  function validatePassword() {
    const value = passwordInput.value;
    if (!value) {
      setError(passwordInput, passwordError, "비밀번호를 입력해주세요.");
      return false;
    }
    if (value.length < 8) {
      setError(passwordInput, passwordError, "비밀번호는 8자 이상이어야 합니다.");
      return false;
    }
    setError(passwordInput, passwordError, "");
    return true;
  }

  emailInput.addEventListener("blur", validateEmail);
  passwordInput.addEventListener("blur", validatePassword);

  togglePassword.addEventListener("click", function () {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    togglePassword.textContent = isHidden ? "숨김" : "표시";
    togglePassword.setAttribute(
      "aria-label",
      isHidden ? "비밀번호 숨김" : "비밀번호 표시"
    );
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const validEmail = validateEmail();
    const validPassword = validatePassword();
    if (!validEmail || !validPassword) {
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "로그인 중...";

    // 실제 인증 API 연동 위치 — 데모용으로 동작을 시뮬레이션합니다.
    const payload = {
      email: emailInput.value.trim(),
      remember: document.getElementById("remember").checked,
    };
    console.log("로그인 요청:", payload);

    setTimeout(function () {
      submitButton.disabled = false;
      submitButton.textContent = "로그인";
      alert("로그인 성공 (데모)");
    }, 800);
  });
})();
