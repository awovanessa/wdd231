const API_KEY = "872934bc0879419402e4a9ff31f1f4a6";
const LAT = 9.0765;
const LON = 7.3986;

const CURRENT_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}`;
const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}`;

async function getCurrentWeather() {
  const response = await fetch(CURRENT_URL);
  if (!response.ok) throw new Error(`Current weather request failed: ${response.status}`);
  return response.json();
}

async function getForecast() {
  const response = await fetch(FORECAST_URL);
  if (!response.ok) throw new Error(`Forecast request failed: ${response.status}`);
  return response.json();
}

function renderCurrent(data) {
  const tempEl = document.getElementById("current-temp");
  const descEl = document.getElementById("current-desc");
  if (tempEl) tempEl.textContent = `${Math.round(data.main.temp)}°C`;
  if (descEl) descEl.textContent = data.weather[0].description;
}

// The free /forecast endpoint returns data in 3 hour steps for 5 days.
// Pick one entry per day (closest to noon) to build a simple 3 day outlook.
function pickDailyForecast(list) {
  const byDate = {};
  list.forEach((entry) => {
    const date = entry.dt_txt.split(" ")[0];
    const hour = entry.dt_txt.split(" ")[1];
    if (!byDate[date] || hour === "12:00:00") {
      byDate[date] = entry;
    }
  });
  const today = new Date().toISOString().split("T")[0];
  return Object.keys(byDate)
    .filter((date) => date !== today)
    .slice(0, 3)
    .map((date) => byDate[date]);
}

function dayLabel(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

function renderForecast(days) {
  const container = document.getElementById("weather-forecast");
  if (!container) return;
  container.innerHTML = "";

  days.forEach((day) => {
    const card = document.createElement("div");
    card.className = "forecast-day";
    card.innerHTML = `
      <div class="f-label">${dayLabel(day.dt_txt)}</div>
      <div class="f-temp">${Math.round(day.main.temp)}°C</div>
    `;
    container.appendChild(card);
  });
}

export async function initWeather() {
  const noteEl = document.getElementById("weather-note");
  try {
    const [current, forecast] = await Promise.all([getCurrentWeather(), getForecast()]);
    renderCurrent(current);
    renderForecast(pickDailyForecast(forecast.list));
  } catch (err) {
    console.error(err);
    const tempEl = document.getElementById("current-temp");
    const descEl = document.getElementById("current-desc");
    if (tempEl) tempEl.textContent = "--°C";
    if (descEl) descEl.textContent = "Weather data unavailable right now";
    if (noteEl) {
      noteEl.textContent = "Add a valid OpenWeatherMap API key in scripts/weather.js to enable live weather.";
    }
  }
}
