import { poolData } from "./data.js";

const app = document.querySelector("#app");
const navButtons = [...document.querySelectorAll(".nav-link")];

const state = {
  view: "overview",
  scenario: "current",
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
  if (match.status === "final") return match.winner;
  if (state.scenario === "colombia") return "Colombia";
  if (state.scenario === "ghana") return "Ghana";
  return null;
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
  return {
    current: "Current standings",
    colombia: "If Colombia wins",
    ghana: "If Ghana wins",
  }[state.scenario];
}

function scenarioControl() {
  return `
    <div class="scenario-control" role="group" aria-label="Leaderboard scenario">
      <button class="${state.scenario === "current" ? "active" : ""}" data-scenario="current">Current</button>
      <button class="${state.scenario === "colombia" ? "active" : ""}" data-scenario="colombia">Colombia wins</button>
      <button class="${state.scenario === "ghana" ? "active" : ""}" data-scenario="ghana">Ghana wins</button>
    </div>
  `;
}

function hero() {
  return `
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow"><span></span> Round of 32 · Matchday 4</p>
        <h1>The bracket is<br><em>heating up.</em></h1>
        <p>One match left in the round. See where everyone stands before the knockout points start climbing.</p>
      </div>
      <div class="hero-stats" aria-label="Pool summary">
        <div><strong>6</strong><span>Entries</span></div>
        <div><strong>15</strong><span>Matches final</span></div>
        <div><strong>1</strong><span>Match pending</span></div>
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
          <p class="section-kicker">The table</p>
          <h2>${scenarioLabel()}</h2>
        </div>
        ${scenarioControl()}
      </div>
      <div class="leaderboard">${rows}</div>
      <button class="text-link" data-goto="picks">Compare everyone’s picks <span>→</span></button>
    </section>
  `;
}

function liveMatchPanel() {
  const match = poolData.matches.find((item) => item.status === "pending");
  const [home, away] = match.fixture.split(" vs ");
  return `
    <section class="live-card">
      <div class="live-card-top">
        <span class="live-pill"><i></i> Live snapshot</span>
        <span>${formatDate(match.date)} · Round of 32</span>
      </div>
      <div class="matchup">
        <div class="team">
          ${flag(home, "flag-large")}
          <strong>${home}</strong>
        </div>
        <div class="scoreboard">
          <strong>1 <span>–</span> 0</strong>
          <small>NOT FINAL</small>
        </div>
        <div class="team">
          ${flag(away, "flag-large")}
          <strong>${away}</strong>
        </div>
      </div>
      <div class="consensus">
        <div class="mini-avatars">
          ${poolData.players.map((player) => `<span title="${player.name}">${initials(player.name)}</span>`).join("")}
        </div>
        <p><strong>Clean sweep.</strong> All 6 entries picked Colombia.</p>
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
          <p class="section-kicker">How it works</p>
          <h2>Points get serious</h2>
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
        ${liveMatchPanel()}
        ${scoringPanel()}
      </div>
    </div>
    <section class="callout">
      <span class="callout-icon">i</span>
      <div><strong>Next update</strong><p>Standings lock when Colombia vs Ghana goes final. The Round of 16 is worth 2 points per correct pick.</p></div>
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
      <div><p class="eyebrow"><span></span> Round of 32</p><h1>Match center</h1><p>Every result, plus how the room picked it.</p></div>
      <div class="filter-control" role="group" aria-label="Filter matches">
        ${["all", "final", "pending"].map((filter) => `<button class="${state.matchFilter === filter ? "active" : ""}" data-filter="${filter}">${filter[0].toUpperCase() + filter.slice(1)}</button>`).join("")}
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
      ${scenarioControl()}
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
  const scenario = event.target.closest("[data-scenario]");
  const filter = event.target.closest("[data-filter]");
  const player = event.target.closest("[data-player]");

  if (nav || goto) {
    state.view = (nav || goto).dataset.view || (nav || goto).dataset.goto;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  if (scenario) state.scenario = scenario.dataset.scenario;
  if (filter) state.matchFilter = filter.dataset.filter;
  if (player) state.selectedPlayer = player.dataset.player;
  if (nav || goto || scenario || filter || player) render();
});

render();
