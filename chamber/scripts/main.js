import { initNavigation } from "../../scripts/navigation.js";
import { initDates } from "../../scripts/date.js";
import { initDirectory } from "./directory.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initDates();
  initDirectory();

  const fontStylesheet = document.getElementById("font-stylesheet");
  if (fontStylesheet) {
    fontStylesheet.addEventListener("load", () => {
      fontStylesheet.media = "all";
    });
  }
});
