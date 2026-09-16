import { initNavigation } from "../../scripts/navigation.js";
import { initDates } from "../../scripts/date.js";
import { initWeather } from "./weather.js";
import { initSpotlight } from "./spotlight.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initDates();
  initWeather();
  initSpotlight();

  const fontStylesheet = document.getElementById("font-stylesheet");
  if (fontStylesheet) {
    fontStylesheet.addEventListener("load", () => {
      fontStylesheet.media = "all";
    });
  }
});
