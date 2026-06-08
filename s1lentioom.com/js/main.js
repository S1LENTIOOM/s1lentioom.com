// Общие функции сайта: меню, анимации, прогресс-бары, фильтр треков и форма.
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initScrollReveal();
  initBackToTop();
  initProgressBars();
  initTrackFilters();
  initContactForm();
});

function initMobileMenu() {
  const menuButton = document.querySelector(".menu-toggle");
  const navList = document.querySelector(".nav-list");

  if (!menuButton || !navList) return;

  menuButton.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("open");
    menuButton.classList.toggle("open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  navList.addEventListener("click", (event) => {
    if (event.target.classList.contains("nav-link")) {
      navList.classList.remove("open");
      menuButton.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}

function initScrollReveal() {
  const elements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach((element) => observer.observe(element));
}

function initBackToTop() {
  const button = document.querySelector(".back-to-top");
  if (!button) return;

  window.addEventListener("scroll", () => {
    button.classList.toggle("visible", window.scrollY > 420);
  });

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initProgressBars() {
  const progressItems = document.querySelectorAll(".progress");
  if (!progressItems.length) return;

  const fillProgress = (item) => {
    const value = Number(item.dataset.progress) || 0;
    const bar = item.querySelector(".progress-value");
    if (bar) bar.style.width = `${Math.min(value, 100)}%`;
  };

  if (!("IntersectionObserver" in window)) {
    progressItems.forEach(fillProgress);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        fillProgress(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  progressItems.forEach((item) => observer.observe(item));
}

function initTrackFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".track-card");

  if (!buttons.length || !cards.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      buttons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      cards.forEach((card) => {
        const shouldShow = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("hidden", !shouldShow);
      });
    });
  });
}

function initContactForm() {
  const form = document.querySelector("#contactForm");
  if (!form) return;

  const messageBox = document.querySelector("#formMessage");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const fields = {
      name: form.querySelector("#name"),
      email: form.querySelector("#email"),
      message: form.querySelector("#message")
    };

    const errors = {
      name: validateName(fields.name.value),
      email: validateEmail(fields.email.value),
      message: validateMessage(fields.message.value)
    };

    Object.keys(fields).forEach((key) => showFieldError(fields[key], errors[key]));

    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) {
      showFormMessage(messageBox, "Проверь поля заявки и попробуй снова.", "error");
      return;
    }

    showFormMessage(messageBox, "Заявка готова к отправке. Подключи сервер, чтобы получать сообщения.", "success");
    form.reset();
  });
}

function validateName(value) {
  const trimmed = value.trim();
  if (!trimmed) return "Введите имя или псевдоним.";
  if (trimmed.length < 2) return "Минимум 2 символа.";
  return "";
}

function validateEmail(value) {
  const trimmed = value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmed) return "Введите email.";
  if (!emailPattern.test(trimmed)) return "Введите корректный email.";
  return "";
}

function validateMessage(value) {
  const trimmed = value.trim();
  if (!trimmed) return "Опишите задачу или идею.";
  if (trimmed.length < 10) return "Сообщение должно быть длиннее 10 символов.";
  return "";
}

function showFieldError(field, errorText) {
  const wrapper = field.closest(".form-field");
  const error = wrapper.querySelector(".error-text");

  wrapper.classList.toggle("invalid", Boolean(errorText));
  error.textContent = errorText;
}

function showFormMessage(messageBox, text, type) {
  if (!messageBox) return;

  messageBox.textContent = text;
  messageBox.className = `form-message show ${type}`;
}

document.querySelectorAll(".track-item").forEach(track => {

    track.addEventListener("click", () => {

        document
          .querySelectorAll(".track-item")
          .forEach(t => t.classList.remove("active"));

        track.classList.add("active");

    });

});