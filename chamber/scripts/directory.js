// Chamber Directory — fetches member data and renders grid/list views

const levelLabels = {
  1: { label: "Member", dot: "member" },
  2: { label: "Silver", dot: "silver" },
  3: { label: "Gold", dot: "gold" },
};

async function getMembers() {
  const response = await fetch("data/members.json");
  if (!response.ok) {
    throw new Error(`Could not load member data: ${response.status}`);
  }
  const data = await response.json();
  return data;
}

function memberCard(member) {
  const level = levelLabels[member.membership] ?? levelLabels[1];
  const card = document.createElement("article");
  card.className = "member-card";
  card.innerHTML = `
    <img class="member-logo" src="images/${member.image}" alt="${member.name} logo">
    <h3>${member.name}</h3>
    <p>${member.tagline}</p>
    <p>${member.address}</p>
    <p>${member.phone}</p>
    <a href="${member.url}" target="_blank" rel="noopener">Visit website</a>
    <span class="member-level"><span class="dot ${level.dot}"></span>${level.label}</span>
  `;
  return card;
}

function memberRow(member) {
  const level = levelLabels[member.membership] ?? levelLabels[1];
  const row = document.createElement("div");
  row.className = "member-row";
  row.innerHTML = `
    <div class="member-name">${member.name}</div>
    <div class="member-address">${member.address}</div>
    <div class="member-contact">
      <span>${member.phone}</span>
      <a href="${member.url}" target="_blank" rel="noopener">Website</a>
    </div>
    <div class="member-level"><span class="dot ${level.dot}"></span>${level.label}</div>
  `;
  return row;
}

function renderMembers(members, view) {
  const container = document.getElementById("member-container");
  if (!container) return;

  container.innerHTML = "";
  container.classList.remove("is-grid", "is-list");
  container.classList.add(view === "list" ? "is-list" : "is-grid");

  members.forEach((member) => {
    container.appendChild(view === "list" ? memberRow(member) : memberCard(member));
  });

  const countEl = document.getElementById("member-count-value");
  if (countEl) countEl.textContent = members.length;
}

export async function initDirectory() {
  const gridBtn = document.getElementById("view-grid");
  const listBtn = document.getElementById("view-list");

  try {
    const members = await getMembers();
    renderMembers(members, "grid");

    gridBtn?.addEventListener("click", () => {
      gridBtn.classList.add("active");
      listBtn?.classList.remove("active");
      renderMembers(members, "grid");
    });

    listBtn?.addEventListener("click", () => {
      listBtn.classList.add("active");
      gridBtn?.classList.remove("active");
      renderMembers(members, "list");
    });
  } catch (err) {
    const container = document.getElementById("member-container");
    if (container) {
      container.textContent = "Sorry, member data could not be loaded right now.";
    }
    console.error(err);
  }
}
