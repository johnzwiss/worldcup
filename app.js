import { poolData } from "./data.js?v=20260707-1";

const app = document.querySelector("#app");
const navButtons = [...document.querySelectorAll(".nav-link")];

const state = {
  view: "overview",
  matchFilter: "all",
  selectedPlayer: "all",
  pickRound: "quarterfinals",
};

const pickRounds = [
  { key: "roundOf32", label: "Round of 32" },
  { key: "roundOf16", label: "Round of 16" },
  { key: "quarterfinals", label: "Quarterfinals" },
  { key: "semifinals", label: "Semifinals" },
  { key: "thirdPlace", label: "Third Place" },
  { key: "final", label: "Final" },
];

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

function completedLaterMatches() {
  return poolData.laterRoundMatches.filter((match) => match.winner);
}

function completedMatchCount() {
  return poolData.matches.length + completedLaterMatches().length;
}

function completedMatches() {
  return [
    ...poolData.matches.map((match, matchIndex) => ({ ...match, roundKey: "roundOf32", matchIndex })),
    ...completedLaterMatches().map((match) => ({ ...match, matchIndex: null })),
  ];
}

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

function playerScore(player) {
  const roundOf32Score = poolData.matches.reduce((score, match, index) => {
    return score + (player.roundOf32Picks[index] === match.winner ? match.points : 0);
  }, 0);
  const laterRoundScore = poolData.laterRoundMatches.reduce((score, match) => {
    const pick = poolData.laterRoundPicks[player.name]?.[match.roundKey]?.[match.id];
    return score + (match.winner && pick === match.winner ? match.points : 0);
  }, 0);
  return roundOf32Score + laterRoundScore;
}

function leaderboard() {
  const sortedPlayers = poolData.players
    .map((player) => ({ ...player, score: playerScore(player) }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  let previousScore = null;
  let previousRank = 0;
  return sortedPlayers.map((player, index) => {
    const rank = player.score === previousScore ? previousRank : index + 1;
    previousScore = player.score;
    previousRank = rank;
    return { ...player, rank };
  });
}

function scenarioLabel() {
  return "Current standings";
}

function hero() {
  return `
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow"><span></span> World Cup 2026 · Family bracket pool</p>
        <h1>World Cup<br><em>Bracket Pool.</em></h1>
        <p>Follow the standings, match results, and everyone’s picks throughout the tournament.</p>
      </div>
      <div class="hero-sharks" aria-hidden="true">
        <span class="shark main-shark"></span>
        <span class="shark small-shark"></span>
        <span class="shark tiny-shark"></span>
        <i class="bubble bubble-one"></i><i class="bubble bubble-two"></i><i class="bubble bubble-three"></i>
      </div>
      <div class="hero-stats" aria-label="Pool summary">
        <div><strong>6</strong><span>Entries</span></div>
        <div><strong>${completedMatchCount()}</strong><span>Matches final</span></div>
        <div><strong>3</strong><span>QF points</span></div>
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
          <p class="section-kicker">Standings</p>
          <h2>${scenarioLabel()}</h2>
        </div>
      </div>
      <div class="leaderboard">${rows}</div>
      <button class="text-link" data-goto="picks">Compare everyone’s picks <span>→</span></button>
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
          <p class="section-kicker">Scoring</p>
          <h2>Points by round</h2>
        </div>
      </div>
      <div class="scoring-steps">
        ${Object.entries(poolData.scoring).map(([round, points], index) => `
          <div class="scoring-step ${round === "quarterfinal" ? "current" : ""} ${round === "thirdPlace" ? "bonus" : ""}">
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
  const quarterfinals = matchesForPickRound("quarterfinals")
    .map((match) => match.fixture.replace(" vs ", "–"))
    .join(" · ");
  return `
    ${hero()}
    <div class="dashboard-grid">
      ${leaderboardPanel()}
      <div class="side-stack">
        ${scoringPanel()}
      </div>
    </div>
    <section class="callout">
      <span class="callout-icon">i</span>
      <div><strong>Quarterfinals set</strong><p>${quarterfinals}. Correct quarterfinal picks are worth 3 points.</p></div>
    </section>
  `;
}

function matchesView() {
  const matchFilters = [
    { key: "all", label: "All results" },
    { key: "roundOf32", label: "Round of 32" },
    { key: "roundOf16", label: "Round of 16" },
  ];
  const visibleMatches = completedMatches().filter((match) => state.matchFilter === "all" || match.roundKey === state.matchFilter);
  const cards = visibleMatches.map((match, index) => {
    const [home, away] = match.fixture.split(" vs ");
    const picksForHome = poolData.players.filter((player) => playerPickForMatch(player, match) === home).length;
    const picksForAway = poolData.players.filter((player) => playerPickForMatch(player, match) === away).length;
    const pickedFixtureTotal = Math.max(picksForHome + picksForAway, 1);
    const homeWon = match.winner === home;
    const awayWon = match.winner === away;
    return `
      <article class="match-card" style="--delay:${index * 25}ms">
        <div class="match-meta">
          <span>${match.date ? formatDate(match.date) : match.round}</span>
          <span class="match-status final">Final</span>
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
          <span style="width:${picksForHome / pickedFixtureTotal * 100}%"></span>
        </div>
        <p class="match-foot">${flag(match.winner)} ${match.winner} advances</p>
      </article>
    `;
  }).join("");

  return `
    <section class="page-intro">
      <div><p class="eyebrow"><span></span> Completed matches</p><h1>Match center</h1><p>Results and picks for every finished round.</p></div>
      <div class="filter-control" role="group" aria-label="Filter matches">
        ${matchFilters.map((filter) => `<button class="${state.matchFilter === filter.key ? "active" : ""}" data-filter="${filter.key}">${filter.label}</button>`).join("")}
      </div>
    </section>
    <div class="matches-grid">${cards}</div>
  `;
}

function matchesForPickRound(roundKey) {
  return roundKey === "roundOf32"
    ? poolData.matches
    : poolData.laterRoundMatches.filter((match) => match.roundKey === roundKey);
}

function playerPickForMatch(player, match) {
  if (match.roundKey === "roundOf32") {
    return player.roundOf32Picks[match.matchIndex];
  }
  return poolData.laterRoundPicks[player.name]?.[match.roundKey]?.[match.id];
}

function pickMarkup(player, roundKey, match, matchIndex) {
  if (roundKey === "roundOf32") {
    const pick = player.roundOf32Picks[matchIndex];
    const status = pick === match.winner ? "correct" : "wrong";
    return `<span class="pick ${status}">${flag(pick)} ${pick}${status === "correct" ? " <i>✓</i>" : " <i>×</i>"}</span>`;
  }

  const roundPicks = poolData.laterRoundPicks[player.name]?.[roundKey];
  const pick = roundPicks?.[match.id];
  const runnerUp = roundPicks?.runnerUp;
  if (!pick) {
    return `<span class="pick saved pick-empty" title="${roundPicks?.note || "Not provided"}">Not provided</span>`;
  }
  const status = match.winner ? (pick === match.winner ? "correct" : "wrong") : "saved";
  const indicator = match.winner ? (status === "correct" ? " <i>✓</i>" : " <i>×</i>") : "";
  if ((roundKey === "final" || roundKey === "thirdPlace") && runnerUp) {
    return `<span class="pick ${status} pick-pair"><span>${flag(pick)} ${pick}${indicator}</span><small>over ${flag(runnerUp)} ${runnerUp}</small></span>`;
  }
  return `<span class="pick ${status}">${flag(pick)} ${pick}${indicator}</span>`;
}

function playerPicksProfile(player) {
  const roundSections = pickRounds.map((round) => {
    const matches = matchesForPickRound(round.key);
    return `
      <section class="player-round-card ${matches.length > 2 ? "wide" : ""}">
        <div class="player-round-heading">
          <h2>${round.label}</h2>
          <span>${matches.length} ${matches.length === 1 ? "pick" : "picks"}</span>
        </div>
        <div class="player-pick-grid">
          ${matches.map((match, matchIndex) => {
            const matchNumber = round.key === "roundOf32" ? String(matchIndex + 1).padStart(2, "0") : match.id.replace("match-", "");
            return `
              <article class="profile-pick">
                <div class="profile-pick-match"><span>${matchNumber}</span><p>${match.fixture}</p></div>
                ${pickMarkup(player, round.key, match, matchIndex)}
              </article>
            `;
          }).join("")}
        </div>
      </section>
    `;
  }).join("");

  return `
    <section class="player-picks-profile">
      <div class="player-profile-heading">
        <span class="avatar">${initials(player.name)}</span>
        <div><p class="section-kicker">Complete pick sheet</p><h2>${player.name}</h2></div>
        <span class="profile-score"><strong>${playerScore(player)}</strong><small>points</small></span>
      </div>
      <div class="player-rounds">${roundSections}</div>
    </section>
  `;
}

function picksView() {
  const playerOptions = poolData.players.map((player) => `<button class="${state.selectedPlayer === player.name ? "active" : ""}" data-player="${player.name}">${player.name}</button>`).join("");
  const players = state.selectedPlayer === "all" ? poolData.players : poolData.players.filter((player) => player.name === state.selectedPlayer);
  const selectedPlayer = state.selectedPlayer === "all" ? null : players[0];
  const isRoundOf32 = state.pickRound === "roundOf32";
  const roundMatches = matchesForPickRound(state.pickRound);

  const rows = roundMatches.map((match, matchIndex) => {
    const [home, away] = match.fixture.split(" vs ");
    const matchNumber = isRoundOf32 ? String(matchIndex + 1).padStart(2, "0") : match.id.replace("match-", "");
    return `
      <tr>
        <th scope="row">
          <span class="fixture-number">${matchNumber}</span>
          <span><strong>${home}</strong><small>${away ? `vs ${away}` : match.round}</small></span>
        </th>
        ${players.map((player) => {
          return `<td>${pickMarkup(player, state.pickRound, match, matchIndex)}</td>`;
        }).join("")}
      </tr>
    `;
  }).join("");

  return `
    <section class="page-intro picks-intro">
      <div><p class="eyebrow"><span></span> Player picks</p><h1>All picks</h1><p>Every saved prediction, round by round.</p></div>
    </section>
    <div class="player-filter" role="group" aria-label="Filter by entry">
      <button class="${state.selectedPlayer === "all" ? "active" : ""}" data-player="all">Everyone</button>
      ${playerOptions}
    </div>
    ${selectedPlayer ? playerPicksProfile(selectedPlayer) : `
      <div class="round-filter" role="group" aria-label="Choose bracket round">
        ${pickRounds.map((round) => `<button class="${state.pickRound === round.key ? "active" : ""}" data-pick-round="${round.key}">${round.label}</button>`).join("")}
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
        <div><p class="section-kicker">Final predictions</p><h2>Championship picks</h2></div>
        <div class="champion-grid">
          ${poolData.players.map((player) => `<div><span>${initials(player.name)}</span><p><small>${player.name}</small><strong>${flag(player.champion)} ${player.champion} <i>over</i> ${player.finalist ? `${flag(player.finalist)} ${player.finalist}` : "—"}</strong></p></div>`).join("")}
        </div>
      </section>
    `}
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
  const pickRound = event.target.closest("[data-pick-round]");

  if (nav || goto) {
    state.view = (nav || goto).dataset.view || (nav || goto).dataset.goto;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  if (filter) state.matchFilter = filter.dataset.filter;
  if (player) state.selectedPlayer = player.dataset.player;
  if (pickRound) state.pickRound = pickRound.dataset.pickRound;
  if (nav || goto || filter || player || pickRound) render();
});

render();
