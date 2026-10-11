// Renders project cards on the home page (featured) and the projects page
// (all, with a filter and saved projects).
import { getProjects, escapeHtml } from "./data.js";
import { initModal, openProjectModal } from "./modal.js";
import { getSavedIds, setSavedIds, getLastFilter, setLastFilter } from "./storage.js";

function projectCard(project, { headingLevel, full, saved }) {
  const titleId = `project-${project.id}-title`;
  const tags = project.technologies
    .map((tech) => `<li class="tag">${escapeHtml(tech)}</li>`)
    .join("");

  const details = full
    ? `<p class="meta">${escapeHtml(project.category)} &middot; ${escapeHtml(project.year)}</p>
       <p>${escapeHtml(project.description)}</p>`
    : "";

  const saveButton = full
    ? `<button type="button" class="button button-alt save-button" data-id="${project.id}" aria-pressed="${saved}" aria-describedby="${titleId}">${saved ? "Saved" : "Save"}</button>`
    : "";

  return `
    <article class="card">
      <img data-src="images/${escapeHtml(project.image)}" alt="${escapeHtml(project.imageAlt)}" width="400" height="250" decoding="async">
      <div class="card-body">
        <h${headingLevel} id="${titleId}">${escapeHtml(project.title)}</h${headingLevel}>
        ${details}
        <ul class="tags" aria-label="Technologies">${tags}</ul>
        <div class="card-actions">
          <button type="button" class="button details-button" data-id="${project.id}" aria-describedby="${titleId}">View details</button>
          ${saveButton}
        </div>
      </div>
    </article>`;
}

// The cards are in the page before any image src is set, so each image's
// position is known: images on the first screen load right away, the rest
// get loading="lazy".
function loadImages(container) {
  const fold = window.innerHeight;
  container.querySelectorAll("img[data-src]").forEach((img) => {
    if (img.getBoundingClientRect().top >= fold) img.loading = "lazy";
    img.src = img.dataset.src;
    img.removeAttribute("data-src");
  });
}

// "View details" buttons open the dialog for their project.
function handleDetailsClicks(container, projects) {
  container.addEventListener("click", (event) => {
    const button = event.target.closest(".details-button");
    if (!button) return;
    const project = projects.find((item) => item.id === Number(button.dataset.id));
    openProjectModal(project, button);
  });
}

/* ---------- home page: featured projects ---------- */

async function initFeatured(grid) {
  const projects = await getProjects(grid);
  if (!projects.length) return;

  const featured = projects.filter((project) => project.featured);
  grid.innerHTML = featured
    .map((project) => projectCard(project, { headingLevel: 3, full: false, saved: false }))
    .join("");
  loadImages(grid);
  handleDetailsClicks(grid, featured);
}

/* ---------- projects page: filter and saved projects ---------- */

// Counts how many projects use each value, for example { "Web page": 6 }.
function countBy(values) {
  return values.reduce((totals, value) => {
    totals[value] = (totals[value] ?? 0) + 1;
    return totals;
  }, {});
}

function optionGroup(label, prefix, counts) {
  const options = Object.keys(counts)
    .sort((a, b) => a.localeCompare(b))
    .map((value) => `<option value="${prefix}:${escapeHtml(value)}">${escapeHtml(value)} (${counts[value]})</option>`)
    .join("");
  return `<optgroup label="${label}">${options}</optgroup>`;
}

function buildFilterOptions(select, projects) {
  const categories = countBy(projects.map((project) => project.category));
  const technologies = countBy(projects.flatMap((project) => project.technologies));
  select.insertAdjacentHTML(
    "beforeend",
    optionGroup("Category", "category", categories) + optionGroup("Technology", "tech", technologies)
  );
}

function matchesFilter(project, filter, savedIds) {
  if (filter === "all") return true;
  if (filter === "saved") return savedIds.includes(project.id);

  const [type, value] = filter.split(":");
  return type === "category" ? project.category === value : project.technologies.includes(value);
}

function updateSavedOption(select, savedIds) {
  select.querySelector('option[value="saved"]').textContent = `Saved projects (${savedIds.length})`;
}

function renderProjects(grid, count, projects, filter, savedIds) {
  const visible = projects.filter((project) => matchesFilter(project, filter, savedIds));

  if (visible.length) {
    grid.innerHTML = visible
      .map((project) =>
        projectCard(project, { headingLevel: 2, full: true, saved: savedIds.includes(project.id) })
      )
      .join("");
    loadImages(grid);
  } else {
    const message =
      filter === "saved"
        ? "You have not saved any projects yet. Use the Save button on a card to keep it here."
        : "No projects match this filter.";
    grid.innerHTML = `<p class="empty-message">${message}</p>`;
  }

  count.textContent = `Showing ${visible.length} of ${projects.length} projects`;
}

async function initProjectsPage(grid) {
  const select = document.querySelector("#project-filter");
  const count = document.querySelector("#results-count");

  const projects = await getProjects(grid);
  if (!projects.length) {
    count.textContent = "Showing 0 projects";
    return;
  }

  // drop saved ids that no longer match a project
  let savedIds = getSavedIds().filter((id) => projects.some((project) => project.id === id));

  buildFilterOptions(select, projects);
  updateSavedOption(select, savedIds);

  // restore the last filter, or reset it if the stored value is not an option
  const lastFilter = getLastFilter();
  const options = [...select.querySelectorAll("option")].map((option) => option.value);
  if (options.includes(lastFilter)) {
    select.value = lastFilter;
  } else if (lastFilter !== null) {
    setLastFilter("all");
  }

  renderProjects(grid, count, projects, select.value, savedIds);

  select.addEventListener("change", () => {
    setLastFilter(select.value);
    renderProjects(grid, count, projects, select.value, savedIds);
  });

  handleDetailsClicks(grid, projects);

  // Save / unsave toggle on each card
  grid.addEventListener("click", (event) => {
    const button = event.target.closest(".save-button");
    if (!button) return;

    const id = Number(button.dataset.id);
    const isSaved = savedIds.includes(id);
    savedIds = isSaved ? savedIds.filter((savedId) => savedId !== id) : [...savedIds, id];
    setSavedIds(savedIds);
    updateSavedOption(select, savedIds);

    if (select.value === "saved") {
      // the card leaves the saved view, so move focus to the filter
      renderProjects(grid, count, projects, select.value, savedIds);
      select.focus();
    } else {
      button.setAttribute("aria-pressed", String(!isSaved));
      button.textContent = isSaved ? "Save" : "Saved";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initModal();

  const featuredGrid = document.querySelector("#featured-grid");
  if (featuredGrid) initFeatured(featuredGrid);

  const projectGrid = document.querySelector("#project-grid");
  if (projectGrid) initProjectsPage(projectGrid);
});
