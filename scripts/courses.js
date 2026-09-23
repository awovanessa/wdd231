// Course data for the Web and Computer Programming Certificate
export const courses = [
  { code: "CSE 110", title: "Introduction to Programming", credits: 2, type: "cse", completed: true },
  { code: "WDD 130", title: "Web Fundamentals", credits: 2, type: "wdd", completed: true },
  { code: "CSE 111", title: "Programming with Functions", credits: 2, type: "cse", completed: true },
  { code: "CSE 210", title: "Programming with Classes", credits: 2, type: "cse", completed: true },
  { code: "WDD 131", title: "Dynamic Web Fundamentals", credits: 2, type: "wdd", completed: true },
  { code: "WDD 231", title: "Frontend Web Development I", credits: 2, type: "wdd", completed: true },
];

function courseRow(course) {
  const row = document.createElement("div");
  row.className = "course-row";
  row.dataset.type = course.type;

  const dotClass = course.type === "wdd" ? "dot wdd" : "dot cse";
  const status = course.completed ? "&#10003; Completed" : "In progress";

  row.innerHTML = `
    <div class="course-code"><span class="${dotClass}"></span>${course.code}</div>
    <div class="course-title">${course.title}</div>
    <div class="course-credits">${course.credits} credits</div>
    <div class="course-status">${status}</div>
  `;
  return row;
}

function renderCourses(filter) {
  const table = document.getElementById("course-table");
  if (!table) return;
  table.innerHTML = "";

  const visible = filter === "all" ? courses : courses.filter((c) => c.type === filter);
  visible.forEach((course) => table.appendChild(courseRow(course)));

  updateCreditTotal(visible);
}

function updateCreditTotal(visible) {
  const totalEl = document.getElementById("credit-total-value");
  if (!totalEl) return;
  const total = visible.reduce((sum, c) => sum + c.credits, 0);
  totalEl.textContent = total;
}

export function initCourses() {
  renderCourses("all");

  const buttons = document.querySelectorAll(".filters button");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderCourses(btn.dataset.filter);
    });
  });
}
