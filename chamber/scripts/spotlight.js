// Company Spotlight — randomly features 2-3 gold or silver members on each render
const levelClass = { 2: "silver", 3: "gold" };
const levelLabel = { 2: "Silver", 3: "Gold" };

async function getMembers() {
  const response = await fetch("data/members.json");
  if (!response.ok) throw new Error(`Could not load member data: ${response.status}`);
  return response.json();
}

function pickRandomSpotlights(members) {
  const eligible = members.filter((m) => m.membership === 2 || m.membership === 3);
  const shuffled = [...eligible].sort(() => Math.random() - 0.5);
  const count = Math.random() < 0.5 ? 2 : 3; // randomly show 2 or 3 spotlights
  return shuffled.slice(0, count);
}

function spotlightCard(member) {
  const card = document.createElement("article");
  card.className = "spotlight-card";
  card.innerHTML = `
    <div class="spotlight-top">
      <img class="spotlight-logo" src="images/${member.image}" alt="${member.name} logo" width="42" height="42" loading="lazy">
      <h3>${member.name}</h3>
      <span class="spotlight-level ${levelClass[member.membership]}">${levelLabel[member.membership]}</span>
    </div>
    <p>${member.tagline}</p>
    <p>${member.address}</p>
    <p>${member.phone}</p>
    <a href="${member.url}" target="_blank" rel="noopener">Visit website</a>
  `;
  return card;
}

export async function initSpotlight() {
  const container = document.getElementById("spotlight-grid");
  if (!container) return;

  try {
    const members = await getMembers();
    const spotlights = pickRandomSpotlights(members);
    container.innerHTML = "";
    spotlights.forEach((member) => container.appendChild(spotlightCard(member)));
  } catch (err) {
    console.error(err);
    container.textContent = "Sorry, member spotlights could not be loaded right now.";
  }
}
