import { initNavigation } from "../../scripts/navigation.js";
import { initDates } from "../../scripts/date.js";
import { places } from "../data/discover.mjs";

const VISIT_KEY = "discover-last-visit";
const DAY_MS = 24 * 60 * 60 * 1000;

function getVisitMessage(lastVisit, now) {
  if (lastVisit === null) return "Welcome! Let us know if you have any questions.";

  const elapsed = now - lastVisit;
  if (elapsed < DAY_MS) return "Back so soon! Awesome!";

  const days = Math.floor(elapsed / DAY_MS);
  return `You last visited ${days} ${days === 1 ? "day" : "days"} ago.`;
}

function readLastVisit() {
  try {
    const stored = localStorage.getItem(VISIT_KEY);
    if (!stored) return null;
    const value = Number(stored);
    return Number.isFinite(value) ? value : null;
  } catch {
    // storage blocked (private mode, disabled site data): treat as a first visit
    return null;
  }
}

function saveVisit(now) {
  try {
    localStorage.setItem(VISIT_KEY, String(now));
  } catch {
    // nothing to do; the message still shows for this visit
  }
}

function renderVisitMessage() {
  const messageEl = document.getElementById("visit-message");
  if (!messageEl) return;

  const now = Date.now();
  messageEl.textContent = getVisitMessage(readLastVisit(), now);
  saveVisit(now);
}

function buildCard(place, index) {
  const card = document.createElement("article");
  card.className = `place-card card${index + 1}`;

  const title = document.createElement("h2");
  title.id = `place-${place.id}`;
  title.textContent = place.name;

  const figure = document.createElement("figure");
  const img = document.createElement("img");
  img.alt = place.alt;
  img.width = 300;
  img.height = 200;
  img.decoding = "async";
  figure.append(img);

  const address = document.createElement("address");
  address.textContent = place.address;

  const description = document.createElement("p");
  description.textContent = place.description;

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Learn More";
  button.setAttribute("aria-describedby", title.id);

  card.append(title, figure, address, description, button);
  return card;
}

function buildPlaces() {
  const grid = document.getElementById("discover-grid");
  if (!grid) return;

  const cards = places.map(buildCard);
  grid.append(...cards);

  // The cards are laid out before any src is set, so each image's position
  // is known: images that start inside the first screen load right away,
  // the rest get loading="lazy". The first card is never lazy.
  const fold = window.innerHeight;
  cards.forEach((card, index) => {
    const img = card.querySelector("img");
    if (index === 0) {
      img.fetchPriority = "high";
    } else if (img.getBoundingClientRect().top >= fold) {
      img.loading = "lazy";
    }
    img.src = `images/${places[index].image}`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initDates();
  renderVisitMessage();
  buildPlaces();

  // The font stylesheet can finish loading before this runs, so check
  // whether it is already in before waiting for its load event.
  const fontStylesheet = document.getElementById("font-stylesheet");
  if (fontStylesheet) {
    if (fontStylesheet.sheet) {
      fontStylesheet.media = "all";
    } else {
      fontStylesheet.addEventListener("load", () => {
        fontStylesheet.media = "all";
      });
    }
  }
});
