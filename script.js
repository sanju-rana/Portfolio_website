// script.js - interactions & animations
document.addEventListener("DOMContentLoaded", function () {
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav__link");
  const header = document.querySelector(".header");
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const scrollBar = document.querySelector(".scroll-progress__bar");
  const backToTopBtn = document.querySelector(".back-to-top");
  const cursorDot = document.querySelector(".cursor--dot");
  const cursorOutline = document.querySelector(".cursor--outline");
  const typingElement = document.querySelector(".hero__typing");

  /* Mobile nav toggle */
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");

    navToggle.classList.toggle("is-open");
    const spans = navToggle.querySelectorAll("span");
    if (navToggle.classList.contains("is-open")) {
      spans[0].style.transform = "translateY(7px) rotate(45deg)";
      spans[1].style.opacity = "0";
      spans[2].style.transform = "translateY(-7px) rotate(-45deg)";
    } else {
      spans[0].style.transform = "";
      spans[1].style.opacity = "";
      spans[2].style.transform = "";
    }
  });

  /* Close nav on link click + smooth scroll with header offset */
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const headerOffset = header.offsetHeight;
          const rect = target.getBoundingClientRect();
          const offsetTop = rect.top + window.pageYOffset - headerOffset + 4;

          window.scrollTo({ top: offsetTop, behavior: "smooth" });
        }
      }

      navMenu.classList.remove("open");
      navToggle.classList.remove("is-open");
      const spans = navToggle.querySelectorAll("span");
      spans[0].style.transform = "";
      spans[1].style.opacity = "";
      spans[2].style.transform = "";
    });
  });

  /* Header shadow on scroll */
  window.addEventListener("scroll", () => {
    header.style.boxShadow =
      window.scrollY > 10 ? "0 18px 45px rgba(15, 23, 42, 0.9)" : "none";
  });

  /* Active link highlight on scroll */
  const sections = document.querySelectorAll("section[id]");
  const setActiveLink = () => {
    let currentId = "";
    const scrollY = window.pageYOffset + header.offsetHeight + 10;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active-link");
      if (link.getAttribute("href") === "#" + currentId) {
        link.classList.add("active-link");
      }
    });
  };

  window.addEventListener("scroll", setActiveLink);
  setActiveLink();

  /* Scroll progress bar + back to top visibility */
  const updateScrollUI = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollBar) {
      scrollBar.style.width = progress + "%";
    }

    if (backToTopBtn) {
      if (scrollTop > 300) {
        backToTopBtn.classList.add("back-to-top--visible");
      } else {
        backToTopBtn.classList.remove("back-to-top--visible");
      }
    }
  };

  window.addEventListener("scroll", updateScrollUI);
  updateScrollUI();

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Intersection Observer for section reveal + skills bars */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");

          if (entry.target.id === "skills") {
            const bars = entry.target.querySelectorAll(".skill__bar span");
            bars.forEach((bar) => {
              const level = bar.getAttribute("data-level") || "0";
              bar.style.width = level + "%";
            });
          }

          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  document.querySelectorAll(".reveal").forEach((section) => {
    revealObserver.observe(section);
  });

  /* Typing effect */
  if (typingElement) {
    const phrases = JSON.parse(typingElement.getAttribute("data-phrases") || "[]");
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const typeLoop = () => {
      const currentPhrase = phrases[phraseIndex] || "";

      if (!deleting && charIndex <= currentPhrase.length) {
        typingElement.textContent = currentPhrase.slice(0, charIndex);
        charIndex += 1;
      } else if (deleting && charIndex >= 0) {
        typingElement.textContent = currentPhrase.slice(0, charIndex);
        charIndex -= 1;
      }

      if (!deleting && charIndex > currentPhrase.length) {
        deleting = true;
        setTimeout(typeLoop, 1200);
        return;
      }

      if (deleting && charIndex < 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }

      const delay = deleting ? 60 : 110;
      setTimeout(typeLoop, delay);
    };

    if (phrases.length) {
      typeLoop();
    }
  }

  /* Custom cursor movement */
  let outlineX = window.innerWidth / 2;
  let outlineY = window.innerHeight / 2;
  let targetX = outlineX;
  let targetY = outlineY;

  const moveCursor = (event) => {
    targetX = event.clientX;
    targetY = event.clientY;

    if (cursorDot) {
      cursorDot.style.transform = `translate(${targetX}px, ${targetY}px)`;
    }
  };

  window.addEventListener("mousemove", moveCursor);

  const animateOutline = () => {
    outlineX += (targetX - outlineX) * 0.18;
    outlineY += (targetY - outlineY) * 0.18;

    if (cursorOutline) {
      cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
    }

    requestAnimationFrame(animateOutline);
  };

  animateOutline();

  /* Cursor interactions on clickable elements */
  const interactiveElements = document.querySelectorAll("a, button, .btn");
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      if (cursorOutline) {
        cursorOutline.style.transform += " scale(1.4)";
      }
    });
    el.addEventListener("mouseleave", () => {
      if (cursorOutline) {
        cursorOutline.style.transform = cursorOutline.style.transform.replace(" scale(1.4)", "");
      }
    });
  });

  /* Contact form (front-end only) */
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !email || !message) {
      formStatus.textContent = "Please fill in all fields.";
      formStatus.style.color = "#f97373";
      return;
    }

    formStatus.textContent = "Thank you! Your message has been noted locally.";
    formStatus.style.color = "#4ade80";
    contactForm.reset();

    setTimeout(() => {
      formStatus.textContent = "";
    }, 4000);
  });
});