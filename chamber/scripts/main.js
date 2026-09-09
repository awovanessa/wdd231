import { initNavigation } from "../../scripts/navigation.js";
import { initDates } from "../../scripts/date.js";
import { initDirectory } from "./directory.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initDates();
  initDirectory();
});
