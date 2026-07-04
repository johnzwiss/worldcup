import { poolData } from "./data.js";

const app = document.querySelector("#app");
const navButtons = [...document.querySelectorAll(".nav-link")];

const state = {
  view: "overview",
  matchFilter: "all",
  selectedPlayer: "all",
};

const flagCodes = {
  Germany: "de", Paraguay: "py", France: "fr", Sweden: "se", "South Africa": "za",
  Canada: "ca", Netherlands: "nl", Morocco: "ma", Portugal: "pt", Croatia: "hr",
  Spain: "es", Austria: "at", "United States": "us", "Bosnia and Herzegovina": "ba",
  Belgium: "be", Senegal: "sn", Brazil: "br", Japan: "jp", "Ivory Coast": "ci",
  Norway: "no", Mexico: "mx", Ecuador: "ec", England: "gb-eng", "DR Congo": "cd",
  Argentina: "ar", "Cape Verde": "cv", Australia: "au", Egypt: "eg", Switzerland: "ch",
  Algeria: "dz", Colombia: "co", Ghana: "gh",
};

const initials = (name) => name.split(/\s+|\s*&\s*/).filter((part) => !["&"].includes(part)).map((part) => part[0]).slice(0, 2).join("");

function flag(country, className = "") {
  const code = flagCodes[country];
  return code
    ? `<span class="flag fi fi-${code} ${className}" role="img" aria-label="${country} flag"></span>`
    : `<span class="flag-placeholder ${className}" aria-hidden="true"></span>`;
}

function formatDate(dateString, full = false) {
  const date = new Date(`${dateString}T12:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    month: full ? "long" : "short",
    day: "numeric",
    ...(full ? { year: "numeric" } : {}),
  }).format(date);
}

function resultFor(match) {
  return match.status === "final" ? match.winner : null;
}

function playerScore(player) {
  return poolData.matches.reduce((score, match, index) => {
    const result = resultFor(match);
    return score + (result && player.roundOf32Picks[index] === result ? match.points : 0);
  }, 0);
}

function leaderboard() {
  return poolData.players
    .map((player) => ({ ...player, score: playerScore(player) }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .map((player, index, players) => ({
      ...player,
      rank: index > 0 && player.score === players[index - 1].score ? players[index - 1].rank : index + 1,
    }));
}

function scenarioLabel() {
  return "Current standings";
}

function hero() {
  return `
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow"><span></span> The Shark Pool · Round of 32 complete</p>
        <h1>There’s blood<br><em>in the water.</em></h1>
        <p>Six entries. One leaderboard. Nobody wants to be chum when the knockout points start climbing.</p>
      </div>
      <div class="hero-sharks" aria-hidden="true">
        <svg viewBox="0 0 560 240" role="presentation">
          <path d="M500 108c-50-24-103-35-160-32l39-39-61 38c-35 1-69 6-102 16l-39-37 10 49c-43 16-79 36-116 53l-54-24 31 36-36 31 64-25c52 25 116 31 182 17l-35 30 73-41c69-4 137-28 204-72Z" />
          <path class="small-shark" transform="translate(250 110) scale(.42)" d="M500 108c-50-24-103-35-160-32l39-39-61 38c-35 1-69 6-102 16l-39-37 10 49c-43 16-79 36-116 53l-54-24 31 36-36 31 64-25c52 25 116 31 182 17l-35 30 73-41c69-4 137-28 204-72Z" />
          <path class="tiny-shark" transform="translate(-80 135) scale(.28)" d="M500 108c-50-24-103-35-160-32l39-39-61 38c-35 1-69 6-102 16l-39-37 10 49c-43 16-79 36-116 53l-54-24 31 36-36 31 64-25c52 25 116 31 182 17l-35 30 73-41c69-4 137-28 204-72Z" />
          <circle cx="480" cy="55" r="5" /><circle cx="510" cy="32" r="3" /><circle cx="532" cy="58" r="2" />
        </svg>
      </div>
      <div class="hero-stats" aria-label="Pool summary">
        <div><strong>6</strong><span>Entries</span></div>
        <div><strong>16</strong><span>Matches final</span></div>
        <div><strong>✓</strong><span>Round locked</span></div>
      </div>
    </section>
  `;
}

function leaderboardPanel() {
  const rows = leaderboard().map((player, index) => {
    const currentScore = poolData.matches.reduce((score, match, matchIndex) => {
      return score + (match.status === "final" && player.roundOf32Picks[matchIndex] === match.winner ? match.points : 0);
    }, 0);
    const gain = player.score - currentScore;
    return `
      <div class="leader-row ${index === 0 ? "leader" : ""}">
        <span class="rank">${player.rank.toString().padStart(2, "0")}</span>
        <span class="avatar avatar-${index + 1}">${initials(player.name)}</span>
        <span class="player-name">
          <strong>${player.name}</strong>
          <small>${index === 0 ? "In the lead" : `${leaderboard()[0].score - player.score} pts off lead`}</small>
        </span>
        <span class="score"><strong>${player.score}</strong><small>PTS</small></span>
        ${gain ? `<span class="gain">+${gain}</span>` : ""}
      </div>
    `;
  }).join("");

  return `
    <section class="panel leaderboard-panel">
      <div class="panel-heading leaderboard-heading">
        <div>
          <p class="section-kicker">Feeding order</p>
          <h2>${scenarioLabel()}</h2>
        </div>
      </div>
      <div class="leaderboard">${rows}</div>
      <button class="text-link" data-goto="picks">Compare everyone’s picks <span>→</span></button>
    </section>
  `;
}

function roundCompletePanel() {
  return `
    <section class="live-card round-complete-card">
      <div class="live-card-top">
        <span class="live-pill"><i></i> Waters settled</span>
        <span>Round of 32</span>
      </div>
      <div class="round-lock">
        <strong>16<small>/16</small></strong>
        <div><h3>Round locked.</h3><p>Colombia advances. Every score is updated.</p></div>
      </div>
      <div class="consensus">
        <div class="mini-avatars">
          ${poolData.players.map((player) => `<span title="${player.name}">${initials(player.name)}</span>`).join("")}
        </div>
        <p><strong>Clean sweep.</strong> All 6 entries backed Colombia.</p>
      </div>
    </section>
  `;
}

function scoringPanel() {
  const labels = {
    roundOf32: "Round of 32",
    roundOf16: "Round of 16",
    quarterfinal: "Quarterfinals",
    semifinal: "Semifinals",
    final: "Final",
    thirdPlace: "3rd Place",
  };
  return `
    <section class="panel scoring-panel">
      <div class="panel-heading">
        <div>
          <p class="section-kicker">Bite value</p>
          <h2>The bites get bigger</h2>
        </div>
      </div>
      <div class="scoring-steps">
        ${Object.entries(poolData.scoring).map(([round, points], index) => `
          <div class="scoring-step ${index === 0 ? "current" : ""} ${round === "thirdPlace" ? "bonus" : ""}">
            <span>${labels[round]}</span>
            <strong>${round === "thirdPlace" ? "+" : ""}${points}</strong>
            <small>${points === 1 ? "point" : "points"}</small>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function overviewView() {
  return `
    ${hero()}
    <div class="dashboard-grid">
      ${leaderboardPanel()}
      <div class="side-stack">
        ${roundCompletePanel()}
        ${scoringPanel()}
      </div>
    </div>
    <section class="callout">
      <span class="callout-icon">i</span>
      <div><strong>Next feeding</strong><p>The Round of 16 is up next and worth 2 points per correct pick.</p></div>
    </section>
  `;
}

function matchesView() {
  const visibleMatches = poolData.matches.filter((match) => state.matchFilter === "all" || match.status === state.matchFilter);
  const cards = visibleMatches.map((match, index) => {
    const [home, away] = match.fixture.split(" vs ");
    const picksForHome = poolData.players.filter((player) => player.roundOf32Picks[poolData.matches.indexOf(match)] === home).length;
    const picksForAway = poolData.players.length - picksForHome;
    const homeWon = match.winner === home;
    const awayWon = match.winner === away;
    return `
      <article class="match-card ${match.status === "pending" ? "pending" : ""}" style="--delay:${index * 25}ms">
        <div class="match-meta">
          <span>${formatDate(match.date)}</span>
          <span class="match-status ${match.status}">${match.status === "final" ? "Final" : "Pending"}</span>
        </div>
        <div class="match-team ${homeWon ? "winner" : ""}">
          <span>${flag(home)} ${home}</span>
          <strong>${picksForHome}<small>/6</small></strong>
        </div>
        <div class="match-team ${awayWon ? "winner" : ""}">
          <span>${flag(away)} ${away}</span>
          <strong>${picksForAway}<small>/6</small></strong>
        </div>
        <div class="pick-bar" aria-label="${picksForHome} picks for ${home}, ${picksForAway} picks for ${away}">
          <span style="width:${picksForHome / 6 * 100}%"></span>
        </div>
        <p class="match-foot">${match.status === "final" ? `${flag(match.winner)} ${match.winner} advances` : "1 point still available"}</p>
      </article>
    `;
  }).join("");

  return `
    <section class="page-intro">
      <div><p class="eyebrow"><span></span> Shark watch · Round of 32</p><h1>Match center</h1><p>Every result, plus how the room picked it.</p></div>
      <div class="filter-control" role="group" aria-label="Filter matches">
        ${["all", "final"].map((filter) => `<button class="${state.matchFilter === filter ? "active" : ""}" data-filter="${filter}">${filter[0].toUpperCase() + filter.slice(1)}</button>`).join("")}
      </div>
    </section>
    <div class="matches-grid">${cards}</div>
  `;
}

function picksView() {
  const playerOptions = poolData.players.map((player) => `<button class="${state.selectedPlayer === player.name ? "active" : ""}" data-player="${player.name}">${player.name}</button>`).join("");
  const players = state.selectedPlayer === "all" ? poolData.players : poolData.players.filter((player) => player.name === state.selectedPlayer);

  const rows = poolData.matches.map((match, matchIndex) => {
    const [home, away] = match.fixture.split(" vs ");
    return `
      <tr>
        <th scope="row">
          <span class="fixture-number">${String(matchIndex + 1).padStart(2, "0")}</span>
          <span><strong>${home}</strong><small>vs ${away}</small></span>
        </th>
        ${players.map((player) => {
          const pick = player.roundOf32Picks[matchIndex];
          const result = resultFor(match);
          const status = !result ? "open" : pick === result ? "correct" : "wrong";
          return `<td><span class="pick ${status}">${flag(pick)} ${pick}${status === "correct" ? " <i>✓</i>" : status === "wrong" ? " <i>×</i>" : ""}</span></td>`;
        }).join("")}
      </tr>
    `;
  }).join("");

  return `
    <section class="page-intro picks-intro">
      <div><p class="eyebrow"><span></span> Head to head</p><h1>All picks</h1><p>Correct picks are green. Misses are red. Simple, brutal, beautiful.</p></div>
    </section>
    <div class="player-filter" role="group" aria-label="Filter by entry">
      <button class="${state.selectedPlayer === "all" ? "active" : ""}" data-player="all">Everyone</button>
      ${playerOptions}
    </div>
    <section class="picks-table-wrap">
      <table class="picks-table">
        <thead>
          <tr>
            <th>Match</th>
            ${players.map((player) => `<th><span class="avatar">${initials(player.name)}</span><strong>${player.name}</strong><small>${playerScore(player)} pts</small></th>`).join("")}
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </section>
    <section class="champion-strip">
      <div><p class="section-kicker">The long game</p><h2>Finals predictions</h2></div>
      <div class="champion-grid">
        ${poolData.players.map((player) => `<div><span>${initials(player.name)}</span><p><small>${player.name}</small><strong>${flag(player.champion)} ${player.champion} <i>over</i> ${player.finalist ? `${flag(player.finalist)} ${player.finalist}` : "—"}</strong></p></div>`).join("")}
      </div>
    </section>
  `;
}

function render() {
  app.classList.add("is-changing");
  const views = { overview: overviewView, matches: matchesView, picks: picksView };
  app.innerHTML = views[state.view]();
  navButtons.forEach((button) => button.classList.toggle("active", button.dataset.view === state.view));
  requestAnimationFrame(() => app.classList.remove("is-changing"));
}

document.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-view]");
  const goto = event.target.closest("[data-goto]");
  const filter = event.target.closest("[data-filter]");
  const player = event.target.closest("[data-player]");

  if (nav || goto) {
    state.view = (nav || goto).dataset.view || (nav || goto).dataset.goto;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  if (filter) state.matchFilter = filter.dataset.filter;
  if (player) state.selectedPlayer = player.dataset.player;
  if (nav || goto || filter || player) render();
});

render();
