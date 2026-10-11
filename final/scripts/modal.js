// The project details dialog (native <dialog> opened with showModal()).
import { escapeHtml } from "./data.js";

let lastTrigger = null;

function detailsMarkup(project) {
  const tags = project.technologies
    .map((tech) => `<li class="tag">${escapeHtml(tech)}</li>`)
    .join("");

  return `
    <img src="images/${escapeHtml(project.image)}" alt="${escapeHtml(project.imageAlt)}" width="400" height="250" decoding="async">
    <p class="meta">${escapeHtml(project.category)} &middot; ${escapeHtml(project.year)}</p>
    <p>${escapeHtml(project.description)}</p>
    <ul class="tags" aria-label="Technologies">${tags}</ul>
    <a class="button" href="${escapeHtml(project.url)}" target="_blank" rel="noopener">View the live project (opens in a new tab)</a>
  `;
}

export function initModal() {
  const dialog = document.querySelector("#project-dialog");
  if (!dialog) return;

  dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());

  // The dialog itself has no padding, so a click whose target is the
  // dialog element landed on the backdrop: close it.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  // Escape, the close button and a backdrop click all end in "close":
  // let the page scroll again and return focus to the button that opened it.
  dialog.addEventListener("close", () => {
    document.documentElement.classList.remove("modal-open");
    lastTrigger?.focus();
    lastTrigger = null;
  });
}

export function openProjectModal(project, trigger) {
  const dialog = document.querySelector("#project-dialog");
  dialog.querySelector("#dialog-title").textContent = project.title;
  dialog.querySelector(".dialog-body").innerHTML = detailsMarkup(project);

  lastTrigger = trigger;
  document.documentElement.classList.add("modal-open");
  // showModal() moves focus into the dialog (to its first button, Close)
  dialog.showModal();
}
