// ===== Mobile menu (hamburger) =====

// Step 2: find the elements we need in the page
const menuButton = document.querySelector(".navbar-toggle");
const menu = document.querySelector(".navbar-menu");

// Step 3: listen for a click on the button
menuButton.addEventListener("click", function () {
  // Step 4: add the class "open" if it's missing, remove it if it's there
  menu.classList.toggle("open");
});

// Step 7: close the menu when any menu link is clicked
const menuLinks = document.querySelectorAll(".navbar-link");

menuLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    // remove (not toggle): we always want it closed after a click
    menu.classList.remove("open");
  });
});

// Step 8: highlight the menu link of the section we are currently in
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", function () {
  let currentId = "";

  // the last section whose top has passed the top of the screen is the current one
  sections.forEach(function (section) {
    if (window.scrollY >= section.offsetTop - 100) {
      currentId = section.id;
    }
  });

  // give "active" only to the link that points to the current section
  menuLinks.forEach(function (link) {
    link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
  });
});

// ===== Dark navbar after scrolling =====

// Step A2: find the navbar and watch the scroll position
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", function () {
  // Step A3: add "scrolled" when we are more than 50px down, remove it otherwise
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

// ===== Back-to-top button =====

// Step B2: show the button only after we have scrolled down
const backToTop = document.querySelector(".back-to-top");

window.addEventListener("scroll", function () {
  backToTop.classList.toggle("show", window.scrollY > 300);
});

// Step B3: when the button is clicked, scroll back to the top smoothly
backToTop.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===== Contact form =====

// Step C2: catch the submit event and stop the page from reloading
const contactForm = document.querySelector("#contact-form");
const formMessage = document.querySelector("#form-message");

// Step C3: show an error under the form and mark the bad field
function showError(field, text) {
  field.classList.add("invalid");
  formMessage.textContent = text;
  field.focus();
}

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // clear the old message first
  formMessage.textContent = "";
  formMessage.classList.remove("success");
  contactForm.querySelectorAll("input, textarea").forEach(function (field) {
    field.classList.remove("invalid");
  });

  // find the four fields by their name attribute
  const nameField = contactForm.querySelector('[name="name"]');
  const emailField = contactForm.querySelector('[name="email"]');
  const phoneField = contactForm.querySelector('[name="phone"]');
  const messageField = contactForm.querySelector('[name="message"]');

  // check them one by one; stop at the first problem
  if (nameField.value.trim() === "") {
    showError(nameField, "Please enter your name.");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailField.value.trim())) {
    showError(emailField, "Please enter a valid email address.");
    return;
  }

  const phonePattern = /^[0-9+\-\s()]{6,}$/;
  if (!phonePattern.test(phoneField.value.trim())) {
    showError(phoneField, "Please enter a valid phone number.");
    return;
  }

  if (messageField.value.trim() === "") {
    showError(messageField, "Please enter your message.");
    return;
  }

  // Step C4: everything is valid, so show a success note and empty the form
  formMessage.textContent = "Thank you! Your message has been sent.";
  formMessage.classList.add("success");
  contactForm.reset();
});

// ===== Fade in on scroll =====

// Step D2: mark the items that should fade in
const revealItems = document.querySelectorAll(".service-card, .portfolio-item, .team-member, .timeline-item");

// Step D3: watch the items, and reveal each one when it scrolls into view
const revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target); // reveal only once
    }
  });
}, { threshold: 0.15 });

revealItems.forEach(function (item) {
  item.classList.add("reveal");
  revealObserver.observe(item);
});
