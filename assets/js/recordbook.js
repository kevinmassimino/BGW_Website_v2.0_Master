(() => {
  const state = { data: null, section: "all", query: "", expanded: false };
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const content = document.getElementById("recordContent");
  const tabs = document.getElementById("recordTabs");
  const sectionSelect = document.getElementById("recordSection");

  fetch("data/bgw-records.json")
    .then(r => { if (!r.ok) throw new Error("Record data could not be loaded."); return r.json(); })
    .then(data => { state.data = data; buildControls(); render(); })
    .catch(err => { content.innerHTML = `<div class="record-error"><h2>Record book unavailable</h2><p>${esc(err.message)}</p></div>`; });

  function buildControls() {
    const m = state.data.metadata;
    document.getElementById("recordKpis").innerHTML = [
      ["Rounds Carded", m.rounds], ["Classic Rounds", m.classicRounds], ["Hole Scores", m.holeScores.toLocaleString()],
      ["Courses", m.courses], ["Matches", m.matches], ["Historical Golfers", m.players]
    ].map(([label,value]) => `<article><strong>${esc(value)}</strong><span>${esc(label)}</span></article>`).join("");
    document.getElementById("methodologyText").textContent = m.methodology;
    state.data.sections.forEach(s => {
      sectionSelect.insertAdjacentHTML("beforeend", `<option value="${esc(s.id)}">${esc(s.title)}</option>`);
    });
    tabs.innerHTML = `<button class="active" data-section="all">All</button>` +
      state.data.sections.map(s => `<button data-section="${esc(s.id)}">${esc(s.title.replace(" Records",""))}</button>`).join("");
    tabs.addEventListener("click", e => {
      const btn = e.target.closest("button"); if (!btn) return;
      state.section = btn.dataset.section; sectionSelect.value = state.section;
      tabs.querySelectorAll("button").forEach(b => b.classList.toggle("active", b.dataset.section === state.section)); render();
    });
    sectionSelect.addEventListener("change", e => {
      state.section = e.target.value;
      tabs.querySelectorAll("button").forEach(b => b.classList.toggle("active", b.dataset.section === state.section)); render();
    });
    document.getElementById("recordSearch").addEventListener("input", e => { state.query = e.target.value.trim().toLowerCase(); render(); });
    document.getElementById("expandAll").addEventListener("click", e => {
      state.expanded = !state.expanded; e.target.textContent = state.expanded ? "Collapse all" : "Expand all"; render();
    });
  }

  function rowMatches(row, record, section) {
    if (!state.query) return true;
    return JSON.stringify([row, record.title, section.title]).toLowerCase().includes(state.query);
  }
  function render() {
    if (!state.data) return;
    const selected = state.data.sections.filter(s => state.section === "all" || s.id === state.section);
    let visible = 0;
    const html = selected.map(section => {
      const cards = section.records.map(record => {
        const rows = record.rows.filter(row => rowMatches(row, record, section));
        if (!rows.length) return "";
        visible++;
        return card(record, rows);
      }).join("");
      if (!cards) return "";
      return `<section class="record-section" id="${esc(section.id)}"><div class="record-section-head"><p class="eyebrow">BGW Leaders</p><h2>${esc(section.title)}</h2><span>${section.records.length} categories</span></div><div class="record-grid">${cards}</div></section>`;
    }).join("");
    content.innerHTML = visible ? html : `<div class="record-empty"><h2>No records found</h2><p>Try a different player, course, year or category.</p></div>`;
    content.querySelectorAll(".record-card-toggle").forEach(btn => btn.addEventListener("click", () => {
      btn.closest(".record-card").classList.toggle("open");
      btn.setAttribute("aria-expanded", btn.closest(".record-card").classList.contains("open"));
    }));
  }
  function card(record, rows) {
    const open = state.expanded || state.query ? " open" : "";
    return `<article class="record-card${open}">
      <button class="record-card-toggle" aria-expanded="${open ? "true":"false"}">
        <span><small>Top ${rows.length}</small><strong>${esc(record.title)}</strong></span><b>＋</b>
      </button>
      <p class="record-card-description">${esc(record.description || "")}</p>
      <div class="record-table-wrap"><table><thead><tr><th>Rank</th><th>Name / Record</th><th>Stat</th><th>Course / Context</th><th>Year</th></tr></thead>
      <tbody>${rows.map(row => `<tr class="rank-${Math.min(Number(row.rank)||99,4)}">
        <td><span class="rank-badge">${esc(row.rank)}</span></td>
        <td><strong>${esc(row.name)}</strong>${row.record ? `<small>${esc(row.record)}</small>`:""}</td>
        <td class="stat-cell">${esc(row.stat)}</td>
        <td>${esc(row.course || row.context || row.location || "")}${row.par ? `<small>Par ${esc(row.par)}</small>`:""}${row.sample ? `<small>${esc(row.sample)} rounds</small>`:""}</td>
        <td>${esc(row.year || "")}</td></tr>`).join("")}</tbody></table></div>
    </article>`;
  }
})();