// Shows the values sent by the contact form (method="get"), read from the
// query string with URLSearchParams. Values are set with textContent, so
// anything typed in the form is displayed as plain text.

const FIELDS = {
  name: "#result-name",
  email: "#result-email",
  reason: "#result-reason",
  message: "#result-message",
};

function showSubmission() {
  const params = new URLSearchParams(window.location.search);
  const entries = Object.entries(FIELDS);
  const hasData = entries.some(([key]) => params.get(key)?.trim());

  document.querySelector("#submission").hidden = !hasData;
  document.querySelector("#no-submission").hidden = hasData;
  if (!hasData) return;

  entries.forEach(([key, selector]) => {
    document.querySelector(selector).textContent = params.get(key)?.trim() || "Not provided";
  });
}

document.addEventListener("DOMContentLoaded", showSubmission);
