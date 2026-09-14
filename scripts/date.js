function pad(n) {
  return n < 10 ? "0" + n : n;
}

export function initDates() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const lastModEl = document.getElementById("lastModified");
  if (lastModEl) {
    const d = new Date(document.lastModified);
    if (!isNaN(d.getTime())) {
      const formatted =
        pad(d.getMonth() + 1) + "/" + pad(d.getDate()) + "/" + d.getFullYear() +
        " " + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
      lastModEl.textContent = "Last Modification: " + formatted;
    }
  }
}
