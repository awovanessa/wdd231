import { initNavigation } from "../../scripts/navigation.js";
import { initDates } from "../../scripts/date.js";

// Stamp the hidden field with the moment the form was loaded into the browser.
function setTimestamp() {
  const field = document.getElementById("timestamp");
  if (field) field.value = new Date().toISOString();
}

// Wire each membership card's "View benefits" button to its own dialog,
// and let each dialog be closed via its close button or by clicking the backdrop.
function initModals() {
  const triggers = document.querySelectorAll("[data-modal-target]");
  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const dialog = document.getElementById(trigger.dataset.modalTarget);
      dialog?.showModal();
    });
  });

  document.querySelectorAll("dialog.benefits-modal").forEach((dialog) => {
    const closeBtn = dialog.querySelector(".modal-close");
    closeBtn?.addEventListener("click", () => dialog.close());

    // A click that lands on the dialog element itself (not its content)
    // means the user clicked the ::backdrop area, so close it.
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initDates();
  setTimestamp();
  initModals();

  const fontStylesheet = document.getElementById("font-stylesheet");
  if (fontStylesheet) {
    fontStylesheet.addEventListener("load", () => {
      fontStylesheet.media = "all";
    });
  }
});
