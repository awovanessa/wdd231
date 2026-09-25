import { initNavigation } from "../../scripts/navigation.js";
import { initDates } from "../../scripts/date.js";

function formatTimestamp(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

// Read the submitted form fields back out of the URL query string
// (the join form uses method="get") and display them on the page.
function renderSubmission() {
  const params = new URLSearchParams(window.location.search);

  const fields = {
    fname: "confirm-fname",
    lname: "confirm-lname",
    email: "confirm-email",
    phone: "confirm-phone",
    orgname: "confirm-orgname",
  };

  Object.entries(fields).forEach(([param, id]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = params.get(param) || "Not provided";
  });

  const timestampEl = document.getElementById("confirm-timestamp");
  if (timestampEl) timestampEl.textContent = formatTimestamp(params.get("timestamp"));
}

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initDates();
  renderSubmission();

  const fontStylesheet = document.getElementById("font-stylesheet");
  if (fontStylesheet) {
    fontStylesheet.addEventListener("load", () => {
      fontStylesheet.media = "all";
    });
  }
});
