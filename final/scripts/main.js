// Shared by every page: navigation toggle, wayfinding, footer dates
// and the video link.

// The one place the video demonstration URL is kept.
const VIDEO_URL = "https://www.loom.com/share/f073b51d360d46e897c676678b9fcc44";

function initNavigation() {
  const toggle = document.querySelector("#nav-toggle");
  const nav = document.querySelector("#primary-nav");
  if (!toggle || !nav) return;

  const setOpen = (isOpen) => {
    nav.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  };
  const isOpen = () => toggle.getAttribute("aria-expanded") === "true";

  toggle.addEventListener("click", () => setOpen(!isOpen()));

  // close the menu after a link is chosen
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  // Escape closes the menu and puts focus back on the menu button
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });
}

// Wayfinding: mark the nav link for the page being viewed.
function markCurrentPage() {
  const path = window.location.pathname;
  const currentFile = path.endsWith("/") ? "index.html" : path.split("/").pop();

  document.querySelectorAll("#primary-nav a").forEach((link) => {
    if (link.getAttribute("href") === currentFile) {
      link.setAttribute("aria-current", "page");
    }
  });
}

function initFooter() {
  const yearEl = document.querySelector("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const modifiedEl = document.querySelector("#last-modified");
  if (modifiedEl) {
    modifiedEl.textContent = new Date(document.lastModified).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  document.querySelectorAll(".video-link").forEach((link) => {
    link.href = VIDEO_URL;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  markCurrentPage();
  initFooter();
});
