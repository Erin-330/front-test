(function () {
  "use strict";

  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const toggleBtn = document.querySelector(".toggle-password");

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(input, message) {
    const target = document.querySelector(
      '[data-error-for="' + input.id + '"]'
    );
    if (target) target.textContent = message || "";
    input.classList.toggle("invalid", Boolean(message));
  }

  function validate() {
    let valid = true;

    const email = emailInput.value.trim();
    if (!email) {
      setError(emailInput, "이메일을 입력해주세요.");
      valid = false;
    } else if (!EMAIL_RE.test(email)) {
      setError(emailInput, "올바른 이메일 형식이 아닙니다.");
      valid = false;
    } else {
      setError(emailInput, "");
    }

    if (!passwordInput.value) {
      setError(passwordInput, "비밀번호를 입력해주세요.");
      valid = false;
    } else {
      setError(passwordInput, "");
    }

    return valid;
  }

  // 입력 시 해당 필드 에러 초기화
  [emailInput, passwordInput].forEach(function (input) {
    input.addEventListener("input", function () {
      if (input.classList.contains("invalid")) setError(input, "");
    });
  });

  // 비밀번호 표시/숨김 토글
  toggleBtn.addEventListener("click", function () {
    const show = passwordInput.type === "password";
    passwordInput.type = show ? "text" : "password";
    toggleBtn.textContent = show ? "숨김" : "표시";
    toggleBtn.setAttribute("aria-pressed", String(show));
    toggleBtn.setAttribute("aria-label", show ? "비밀번호 숨김" : "비밀번호 표시");
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) return;

    // 실제 인증 연동 지점 (데모: 콘솔 출력)
    console.log("로그인 시도:", {
      email: emailInput.value.trim(),
    });
  });
})();
