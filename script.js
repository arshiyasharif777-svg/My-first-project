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

// ===== "Tell Me More" button: text changes on hover =====

const heroButton = document.querySelector(".hero .btn");
const originalText = heroButton.textContent;
const hoverText = "Let's Go";
let swapTimer;

// keep the button the same width so it does not jump when the text changes
heroButton.style.minWidth = heroButton.offsetWidth + "px";
heroButton.style.textAlign = "center";
heroButton.style.transition = "opacity 0.2s ease, transform 0.2s ease, background-color 0.3s, color 0.3s";

// fade the old text out and slide it up, swap the text, then fade the new one in from below
function swapText(newText) {
  clearTimeout(swapTimer);
  heroButton.style.opacity = "0";
  heroButton.style.transform = "translateY(-8px)";

  swapTimer = setTimeout(function () {
    heroButton.textContent = newText;
    heroButton.style.transition = "none"; // jump to the start position without animating
    heroButton.style.transform = "translateY(8px)";
    heroButton.offsetWidth; // force the browser to apply the line above
    heroButton.style.transition = "opacity 0.2s ease, transform 0.2s ease, background-color 0.3s, color 0.3s";
    heroButton.style.opacity = "1";
    heroButton.style.transform = "translateY(0)";
  }, 200);
}

heroButton.addEventListener("mouseenter", function () {
  swapText(hoverText);
});

heroButton.addEventListener("mouseleave", function () {
  swapText(originalText);
});

// ===== Animated number counters =====

const counters = document.querySelectorAll(".counter");

// count from 0 up to the number in data-target over about 2 seconds
function runCounter(counter) {
  const target = Number(counter.dataset.target);
  const duration = 2000;
  const startTime = performance.now();

  function update(now) {
    // progress goes from 0 to 1; the easing makes the end slow down
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.round(target * eased);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// start each counter once, when it scrolls into view
const counterObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      runCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(function (counter) {
  counterObserver.observe(counter);
});

// ===== Dark mode =====

const themeButton = document.querySelector(".theme-toggle");
const themeIcon = themeButton.querySelector("i");

// show a sun while dark mode is on (click = go light), a moon otherwise
function applyTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  themeIcon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
}

// remember the choice; localStorage can fail (private mode), so wrap it in try/catch
function readSavedTheme() {
  try {
    return localStorage.getItem("theme");
  } catch (error) {
    return null;
  }
}

const savedTheme = readSavedTheme();
if (savedTheme) {
  applyTheme(savedTheme === "dark");
} else {
  // first visit: follow the system setting
  applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
}

themeButton.addEventListener("click", function () {
  const goDark = !document.body.classList.contains("dark");
  applyTheme(goDark);
  try {
    localStorage.setItem("theme", goDark ? "dark" : "light");
  } catch (error) {
    // saving failed; the theme still changed for this visit
  }
});

// ===== Portfolio filter =====

const filterButtons = document.querySelectorAll(".filter-btn");
const portfolioItems = document.querySelectorAll(".portfolio-item");

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const chosen = button.dataset.filter;

    // only the clicked button looks active
    filterButtons.forEach(function (other) {
      other.classList.toggle("active", other === button);
    });

    // hide the items from other categories, show (with a fade) the matching ones
    portfolioItems.forEach(function (item) {
      const matches = chosen === "all" || item.dataset.category === chosen;
      item.classList.toggle("filtered-out", !matches);

      item.classList.remove("filter-show");
      if (matches) {
        item.offsetWidth; // restart the animation if it already ran
        item.classList.add("filter-show");
      }
    });
  });
});

// ===== Smooth scroll for menu links =====

menuLinks.forEach(function (link) {
  link.addEventListener("click", function (event) {
    // find the section this link points to, e.g. "#about" -> the element with id "about"
    const target = document.querySelector(link.getAttribute("href"));

    if (target) {
      event.preventDefault(); // stop the instant jump
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// ===== Typing effect on the hero title =====

const heroTitle = document.querySelector(".hero-title");
const fullTitle = heroTitle.textContent;

// skip the animation for people who asked their system for less motion
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  // keep the title's height so the page below does not jump while typing
  heroTitle.style.minHeight = heroTitle.offsetHeight + "px";
  heroTitle.textContent = "";

  // the typed letters go in this text node, with the blinking cursor right after it
  const typedText = document.createTextNode("");
  const cursor = document.createElement("span");
  cursor.className = "typing-cursor";
  cursor.textContent = "|";
  heroTitle.appendChild(typedText);
  heroTitle.appendChild(cursor);

  let letterIndex = 0;

  const typingTimer = setInterval(function () {
    letterIndex++;
    typedText.textContent = fullTitle.slice(0, letterIndex);

    if (letterIndex >= fullTitle.length) {
      clearInterval(typingTimer);
      // let the cursor blink for a moment, then remove it
      setTimeout(function () {
        cursor.remove();
      }, 2000);
    }
  }, 80);
}
