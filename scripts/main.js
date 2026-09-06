import { initNavigation } from "./navigation.js";
import { initCourses } from "./courses.js";
import { initDates } from "./date.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initCourses();
  initDates();
});
