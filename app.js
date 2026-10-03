const state = {
  sourceType: "all",
  topic: "all",
  eventId: null,
  query: ""
};

const sourceLabels = {
  all: "すべて",
  official: "一次情報",
  practical: "実務解説"
};

const topicLabels = {
  company: "会社設立・登記",
  tax: "税務",
  labor: "労務・社会保険",
  accounting: "会計・経理",
  finance: "財務・資金繰り",
  contracts: "契約・取引"
};

async function loadData() {
  const [company, events, resources] = await Promise.all([
    fetch("./data/company.json").then(r => r.json()),
    fetch("./data/events.json").then(r => r.json()),
    fetch("./data/resources.json").then(r => r.json())
  ]);
  return { company, events, resources };
}

function renderCompany(company) {
  const el = document.querySelector("#company-card");
  el.innerHTML = `
    <p class="card-kicker">CASE COMPANY</p>
    <h2>${company.name}</h2>
    <p class="summary">${company.description}</p>
    <div class="company-facts">
      ${company.facts.map(f => `
        <div class="company-fact">
          <span>${f.label}</span>
          <strong>${f.value}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderTimeline(events, resources) {
  const root = document.querySelector("#timeline");
  root.innerHTML = events.map(event => {
    const count = resources.filter(r => r.eventIds.includes(event.id)).length;
    return `
      <button class="timeline-item" type="button" data-event-id="${event.id}">
        <span class="timeline-month">${event.month}</span>
        <h3>${event.title}</h3>
        <p>${event.summary}</p>
        <p>${count}教材</p>
      </button>
    `;
  }).join("");

  root.addEventListener("click", e => {
    const button = e.target.closest("[data-event-id]");
    if (!button) return;
    const id = button.dataset.eventId;
    state.eventId = state.eventId === id ? null : id;
    state.topic = "all";
    document.querySelectorAll(".timeline-item").forEach(el => {
      el.classList.toggle("active", state.eventId === el.dataset.eventId);
    });
    document.querySelectorAll(".topic-card").forEach(el => el.classList.remove("active"));
    renderResources(events, resources);
    document.querySelector("#library").scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function renderTopics(events, resources) {
  const root = document.querySelector("#topic-grid");
  root.innerHTML = Object.entries(topicLabels).map(([key, label], index) => {
    const count = resources.filter(r => r.topics.includes(key)).length;
    const desc = {
      company: "設立、定款、機関設計、役員変更、本店移転など。",
      tax: "法人税、源泉徴収、年末調整、各種届出など。",
      labor: "採用、労働条件、社会保険、給与まわり。",
      accounting: "帳簿、決算、減価償却、損益の見方。",
      finance: "創業資金、融資、資金繰り、キャッシュ管理。",
      contracts: "受注、契約、請求、回収までの取引実務。"
    }[key];
    return `
      <article class="topic-card" role="button" tabindex="0" data-topic="${key}">
        <span class="topic-number">0${index + 1} / ${count} RESOURCES</span>
        <h3>${label}</h3>
        <p>${desc}</p>
      </article>
    `;
  }).join("");

  const activate = el => {
    state.topic = state.topic === el.dataset.topic ? "all" : el.dataset.topic;
    state.eventId = null;
    document.querySelectorAll(".topic-card").forEach(card => {
      card.classList.toggle("active", card.dataset.topic === state.topic);
    });
    document.querySelectorAll(".timeline-item").forEach(item => item.classList.remove("active"));
    renderResources(events, resources);
    document.querySelector("#library").scrollIntoView({ behavior: "smooth", block: "start" });
  };

  root.addEventListener("click", e => {
    const el = e.target.closest("[data-topic]");
    if (el) activate(el);
  });
  root.addEventListener("keydown", e => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches("[data-topic]")) {
      e.preventDefault();
      activate(e.target);
    }
  });
}

function renderSourceFilters(events, resources) {
  const root = document.querySelector("#source-filters");
  root.innerHTML = Object.entries(sourceLabels).map(([key, label]) =>
    `<button class="filter-chip ${key === "all" ? "active" : ""}" type="button" data-source="${key}">${label}</button>`
  ).join("");

  root.addEventListener("click", e => {
    const button = e.target.closest("[data-source]");
    if (!button) return;
    state.sourceType = button.dataset.source;
    root.querySelectorAll(".filter-chip").forEach(el => {
      el.classList.toggle("active", el.dataset.source === state.sourceType);
    });
    renderResources(events, resources);
  });
}

function resourceMatches(resource) {
  const q = state.query.trim().toLowerCase();
  const sourceOk = state.sourceType === "all" || resource.sourceType === state.sourceType;
  const topicOk = state.topic === "all" || resource.topics.includes(state.topic);
  const eventOk = !state.eventId || resource.eventIds.includes(state.eventId);
  const haystack = [
    resource.title,
    resource.provider,
    resource.why,
    ...resource.tags,
    ...resource.topics.map(t => topicLabels[t] || t)
  ].join(" ").toLowerCase();
  const queryOk = !q || haystack.includes(q);
  return sourceOk && topicOk && eventOk && queryOk;
}

function renderResources(events, resources) {
  const filtered = resources.filter(resourceMatches);
  const root = document.querySelector("#resource-grid");
  const empty = document.querySelector("#empty-state");
  const context = document.querySelector("#active-context");

  document.querySelector("#resource-count").textContent = filtered.length;
  empty.hidden = filtered.length > 0;

  let contextText = "";
  if (state.eventId) {
    const event = events.find(e => e.id === state.eventId);
    contextText = event ? `「${event.month}：${event.title}」で必要になる教材を表示しています。` : "";
  } else if (state.topic !== "all") {
    contextText = `「${topicLabels[state.topic]}」の教材を表示しています。`;
  }
  context.hidden = !contextText;
  context.textContent = contextText;

  root.innerHTML = filtered.map(resource => `
    <article class="resource-card">
      <div class="resource-meta">
        <span class="source-badge ${resource.sourceType}">${sourceLabels[resource.sourceType]}</span>
        <span class="resource-time">${resource.time} · ${resource.difficulty}${resource.lastCheckedAt ? ` · 確認 ${resource.lastCheckedAt}` : ""}</span>
      </div>
      <h3>${resource.title}</h3>
      <p class="resource-provider">${resource.provider}</p>
      <p class="resource-why">${resource.why}</p>
      <div class="tags">
        ${resource.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
      </div>
      <a class="resource-link" href="${resource.url}" target="_blank" rel="noopener noreferrer">
        教材を開く
      </a>
    </article>
  `).join("");
}

function bindControls(events, resources) {
  const input = document.querySelector("#search-input");
  input.addEventListener("input", () => {
    state.query = input.value;
    renderResources(events, resources);
  });

  document.querySelector("#reset-filters").addEventListener("click", () => {
    state.sourceType = "all";
    state.topic = "all";
    state.eventId = null;
    state.query = "";
    input.value = "";
    document.querySelectorAll(".filter-chip").forEach(el => {
      el.classList.toggle("active", el.dataset.source === "all");
    });
    document.querySelectorAll(".timeline-item, .topic-card").forEach(el => el.classList.remove("active"));
    renderResources(events, resources);
  });
}

async function init() {
  try {
    const { company, events, resources } = await loadData();
    const officialCount = resources.filter(r => r.sourceType === "official").length;
    const practicalCount = resources.filter(r => r.sourceType === "practical").length;
    document.querySelector("#header-resource-count").textContent = resources.length;
    document.querySelector("#hero-resource-count").textContent = resources.length;
    document.querySelector("#hero-event-count").textContent = events.length;
    document.querySelector("#official-count").textContent = officialCount;
    document.querySelector("#practical-count").textContent = practicalCount;
    renderCompany(company);
    renderTimeline(events, resources);
    renderTopics(events, resources);
    renderSourceFilters(events, resources);
    bindControls(events, resources);
    renderResources(events, resources);
  } catch (error) {
    console.error(error);
    document.querySelector("#resource-grid").innerHTML =
      '<p class="empty-state">教材データを読み込めませんでした。Webサーバー経由で開いてください。</p>';
  }
}

init();
