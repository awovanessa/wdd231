// Loads the project data. If the request fails, a friendly message is shown
// in the page (role="alert") and an empty list is returned, so the rest of
// the page keeps working.
export async function getProjects(messageTarget) {
  try {
    const response = await fetch("data/projects.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const projects = await response.json();
    return projects;
  } catch {
    const message = document.createElement("p");
    message.className = "error-message";
    message.setAttribute("role", "alert");
    message.textContent =
      "Sorry, the projects could not be loaded right now. Please refresh the page or try again later.";
    messageTarget.replaceChildren(message);
    return [];
  }
}

// Escapes a value before it goes into markup built with a template literal,
// so text from the data is always shown as text, never run as HTML.
export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
