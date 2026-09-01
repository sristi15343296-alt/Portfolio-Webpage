/* =========================================================
   SRISTI — PORTFOLIO SCRIPT
   Vanilla JavaScript only. No external libraries.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initNavbarScrollStyle();
  initMobileMenu();
  initSmoothScrollLinks();
  initActiveNavHighlighting();
  initScrollReveal();
  initScrollToTopButton();
  initContactForm();
  initAchievementGallery();
  initProjectGallery();
});

/* ---------------------------------------------------------
   1. Navbar style change on scroll
   Adds a subtle background/blur once the page is scrolled.
--------------------------------------------------------- */
function initNavbarScrollStyle() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  const updateNavbar = () => {
    if (window.scrollY > 12) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  updateNavbar();
  window.addEventListener("scroll", updateNavbar, { passive: true });
}

/* ---------------------------------------------------------
   2. Mobile hamburger menu
--------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  if (!toggle || !menu) return;

  const closeMenu = () => {
    toggle.classList.remove("open");
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the mobile menu whenever a nav link is clicked.
  menu.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close the mobile menu on Escape for keyboard users.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

/* ---------------------------------------------------------
   3. Smooth scrolling for in-page navigation links
   (CSS `scroll-behavior: smooth` already handles most of this;
   this JS ensures it also works in older browsers and accounts
   for the sticky navbar height.)
--------------------------------------------------------- */
function initSmoothScrollLinks() {
  const links = document.querySelectorAll('a[href^="#"]');
  const navHeight = document.getElementById("navbar")?.offsetHeight || 0;

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const targetPosition =
        target.getBoundingClientRect().top + window.scrollY - navHeight + 1;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });
  });
}

/* ---------------------------------------------------------
   4. Active navigation link highlighting while scrolling
--------------------------------------------------------- */
function initActiveNavHighlighting() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  if (!sections.length || !navLinks.length) return;

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      const isMatch = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("active-link", isMatch);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    {
      // Trigger when a section occupies the middle band of the viewport.
      rootMargin: "-45% 0px -50% 0px",
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------------------------------------------------------
   5. Scroll reveal animation using Intersection Observer
   Fades and lifts elements with the .reveal class into view.
--------------------------------------------------------- */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealEls.forEach((el, index) => {
    // Small staggered delay for elements revealing together.
    el.style.transitionDelay = `${(index % 4) * 60}ms`;
    observer.observe(el);
  });
}

/* ---------------------------------------------------------
   6. Scroll-to-top button
--------------------------------------------------------- */
function initScrollToTopButton() {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;

  const toggleVisibility = () => {
    btn.classList.toggle("visible", window.scrollY > 480);
  };

  toggleVisibility();
  window.addEventListener("scroll", toggleVisibility, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------------------------------------------------------
   7. Contact form validation (front-end only)

   NOTE: There is no backend connected to this form yet.
   On successful validation, a success message is shown but
   no data is actually transmitted anywhere. To make this
   functional, send `formData` below to a backend endpoint
   or an email service (e.g. Formspree, EmailJS, or a custom
   API route) instead of / in addition to showing the message.
--------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const messageField = document.getElementById("message");
  const successMessage = document.getElementById("formSuccess");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const showError = (field, errorEl, message) => {
    field.closest(".form-group").classList.add("has-error");
    errorEl.textContent = message;
  };

  const clearError = (field, errorEl) => {
    field.closest(".form-group").classList.remove("has-error");
    errorEl.textContent = "";
  };

  const validateField = (field, errorEl, validator, message) => {
    if (!validator(field.value.trim())) {
      showError(field, errorEl, message);
      return false;
    }
    clearError(field, errorEl);
    return true;
  };

  // Validate a single field as the user types, once it has an error shown.
  [nameField, emailField, messageField].forEach((field) => {
    field.addEventListener("input", () => {
      const errorEl = document.getElementById(`${field.id}Error`);
      if (errorEl.textContent) {
        runValidation(field, errorEl);
      }
    });
  });

  function runValidation(field) {
    const errorEl = document.getElementById(`${field.id}Error`);

    if (field === nameField) {
      return validateField(field, errorEl, (v) => v.length > 0, "Please enter your name.");
    }
    if (field === emailField) {
      return validateField(
        field,
        errorEl,
        (v) => v.length > 0 && emailPattern.test(v),
        "Please enter a valid email address."
      );
    }
    if (field === messageField) {
      return validateField(field, errorEl, (v) => v.length > 0, "Please enter a message.");
    }
    return true;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    successMessage.textContent = "";

    const isNameValid = runValidation(nameField);
    const isEmailValid = runValidation(emailField);
    const isMessageValid = runValidation(messageField);

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      // Focus the first invalid field for a smoother keyboard/screen-reader experience.
      const firstInvalid = [nameField, emailField, messageField].find(
        (field) => document.getElementById(`${field.id}Error`).textContent
      );
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Front-end only: collect the data but do not send it anywhere yet.
    const formData = {
      name: nameField.value.trim(),
      email: emailField.value.trim(),
      message: messageField.value.trim(),
    };
    // TODO: connect formData to a backend endpoint or email service.
    console.log("Contact form submitted (front-end demo only):", formData);

    successMessage.textContent = "Thanks! Your message has been captured (demo only — no backend connected yet).";
    form.reset();
  });
}

/* ---------------------------------------------------------
   8. Achievement photo gallery modal
   Opens the CDP CyberSecurity session photos from the
   Achievements section. Supports thumbnail clicks, arrow
   buttons, keyboard arrows, and Escape to close.
--------------------------------------------------------- */
function initAchievementGallery() {
  const modal = document.getElementById("achievementGalleryModal");
  if (!modal) return;

  const triggers = document.querySelectorAll(".achievement-gallery-trigger");
  const closeButtons = modal.querySelectorAll("[data-gallery-close]");
  const thumbButtons = Array.from(modal.querySelectorAll(".gallery-thumb-btn"));
  const galleryImage = document.getElementById("galleryImage");
  const galleryCaption = document.getElementById("galleryCaption");
  const prevButton = document.getElementById("galleryPrev");
  const nextButton = document.getElementById("galleryNext");
  const closeButton = modal.querySelector(".gallery-close");

  if (!triggers.length || !thumbButtons.length || !galleryImage || !galleryCaption) return;

  const galleryItems = thumbButtons.map((button) => ({
    src: button.dataset.src,
    alt: button.dataset.alt || "CDP CyberSecurity Awareness Session photo",
    caption: button.dataset.caption || "CDP CyberSecurity Awareness Session photo.",
  }));

  let activeIndex = 0;
  let lastFocusedElement = null;

  const isGalleryOpen = () => modal.classList.contains("open");

  const showImage = (index) => {
    activeIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[activeIndex];

    galleryImage.src = item.src;
    galleryImage.alt = item.alt;
    galleryCaption.textContent = `Photo ${activeIndex + 1} of ${galleryItems.length}: ${item.caption}`;

    thumbButtons.forEach((button, buttonIndex) => {
      button.classList.toggle("active", buttonIndex === activeIndex);
      button.setAttribute("aria-current", buttonIndex === activeIndex ? "true" : "false");
    });
  };

  const openGallery = (index = 0) => {
    lastFocusedElement = document.activeElement;
    showImage(index);
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    if (closeButton) closeButton.focus();
  };

  const closeGallery = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const requestedIndex = Number(trigger.dataset.galleryIndex || 0);
      openGallery(Number.isNaN(requestedIndex) ? 0 : requestedIndex);
    });
  });

  thumbButtons.forEach((button, index) => {
    button.addEventListener("click", () => showImage(index));
  });

  if (prevButton) {
    prevButton.addEventListener("click", () => showImage(activeIndex - 1));
  }
  if (nextButton) {
    nextButton.addEventListener("click", () => showImage(activeIndex + 1));
  }

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeGallery);
  });

  document.addEventListener("keydown", (event) => {
    if (!isGalleryOpen()) return;

    if (event.key === "Escape") {
      closeGallery();
    } else if (event.key === "ArrowLeft") {
      showImage(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      showImage(activeIndex + 1);
    }
  });
}


/* ---------------------------------------------------------
   9. Project proof gallery modal
   Opens proof screenshots for ExpenseFlow and the Census
   Management System from the project cards.
--------------------------------------------------------- */
function initProjectGallery() {
  const modal = document.getElementById("projectGalleryModal");
  if (!modal) return;

  const projects = {
    census: {
      title: "Census Management System",
      description: "Proof screenshots showing the working Census Management System dashboard, analytics, household records, and add-citizen form.",
      items: [
        {
          src: "assets/projects/census-proof-01.png",
          alt: "Census Management System dashboard screenshot",
          caption: "Dashboard overview with citizen, household, birth, and death summary cards."
        },
        {
          src: "assets/projects/census-proof-02.png",
          alt: "Census Management System analytics dashboard screenshot",
          caption: "Analytics dashboard with gender, age, education, and employment charts."
        },
        {
          src: "assets/projects/census-proof-03.png",
          alt: "Census Management System household management screenshot",
          caption: "Household management table with registered household records and actions."
        },
        {
          src: "assets/projects/census-proof-04.png",
          alt: "Census Management System add citizen form screenshot",
          caption: "Add citizen form for entering personal and contact information."
        }
      ]
    },
    expense: {
      title: "ExpenseFlow / Expense Tracker",
      description: "Proof screenshots showing the working ExpenseFlow dashboard, analytics, and savings goals screens.",
      items: [
        {
          src: "assets/projects/expenseflow-proof-01.png",
          alt: "ExpenseFlow dashboard screenshot",
          caption: "Dashboard overview with total balance, income, expenses, savings, quick actions, and insights."
        },
        {
          src: "assets/projects/expenseflow-proof-02.png",
          alt: "ExpenseFlow analytics page screenshot",
          caption: "Analytics page showing category breakdown, monthly expenses, income vs expenses, and spending trends."
        },
        {
          src: "assets/projects/expenseflow-proof-03.png",
          alt: "ExpenseFlow analytics charts screenshot",
          caption: "Detailed analytics charts for expense categories, monthly expenses, and income vs expenses."
        },
        {
          src: "assets/projects/expenseflow-proof-04.png",
          alt: "ExpenseFlow savings goals screenshot",
          caption: "Savings goals page showing goal progress, update controls, and edit/delete actions."
        }
      ]
    }
  };

  const triggers = document.querySelectorAll(".project-gallery-trigger");
  const closeButtons = modal.querySelectorAll("[data-project-gallery-close]");
  const titleEl = document.getElementById("projectGalleryModalTitle");
  const descriptionEl = document.getElementById("projectGalleryDescription");
  const imageEl = document.getElementById("projectGalleryImage");
  const captionEl = document.getElementById("projectGalleryCaption");
  const thumbsEl = document.getElementById("projectGalleryThumbs");
  const prevButton = document.getElementById("projectGalleryPrev");
  const nextButton = document.getElementById("projectGalleryNext");
  const closeButton = modal.querySelector(".gallery-close");

  if (!triggers.length || !titleEl || !descriptionEl || !imageEl || !captionEl || !thumbsEl) return;

  let activeProjectKey = "expense";
  let activeIndex = 0;
  let lastFocusedElement = null;

  const isOpen = () => modal.classList.contains("open");

  const getActiveProject = () => projects[activeProjectKey];

  const renderThumbnails = () => {
    const project = getActiveProject();
    thumbsEl.innerHTML = project.items
      .map((item, index) => `
        <button type="button" class="gallery-thumb-btn${index === activeIndex ? " active" : ""}" data-project-thumb-index="${index}" aria-current="${index === activeIndex ? "true" : "false"}">
          <img src="${item.src}" alt="${project.title} proof thumbnail ${index + 1}" loading="lazy" />
        </button>
      `)
      .join("");

    thumbsEl.querySelectorAll("[data-project-thumb-index]").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.projectThumbIndex || 0);
        showImage(index);
      });
    });
  };

  const updateThumbnails = () => {
    thumbsEl.querySelectorAll("[data-project-thumb-index]").forEach((button) => {
      const index = Number(button.dataset.projectThumbIndex || 0);
      const isActive = index === activeIndex;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-current", isActive ? "true" : "false");
    });
  };

  const showImage = (index) => {
    const project = getActiveProject();
    activeIndex = (index + project.items.length) % project.items.length;
    const item = project.items[activeIndex];

    imageEl.src = item.src;
    imageEl.alt = item.alt;
    captionEl.textContent = `Screenshot ${activeIndex + 1} of ${project.items.length}: ${item.caption}`;
    updateThumbnails();
  };

  const openGallery = (projectKey, index = 0) => {
    if (!projects[projectKey]) return;

    activeProjectKey = projectKey;
    activeIndex = 0;
    lastFocusedElement = document.activeElement;

    const project = getActiveProject();
    titleEl.textContent = project.title;
    descriptionEl.textContent = project.description;
    renderThumbnails();
    showImage(index);

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    if (closeButton) closeButton.focus();
  };

  const closeGallery = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      const projectKey = trigger.dataset.project || "expense";
      const requestedIndex = Number(trigger.dataset.galleryIndex || 0);
      openGallery(projectKey, Number.isNaN(requestedIndex) ? 0 : requestedIndex);
    });
  });

  if (prevButton) {
    prevButton.addEventListener("click", () => showImage(activeIndex - 1));
  }
  if (nextButton) {
    nextButton.addEventListener("click", () => showImage(activeIndex + 1));
  }

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeGallery);
  });

  document.addEventListener("keydown", (event) => {
    if (!isOpen()) return;

    if (event.key === "Escape") {
      closeGallery();
    } else if (event.key === "ArrowLeft") {
      showImage(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      showImage(activeIndex + 1);
    }
  });
}
