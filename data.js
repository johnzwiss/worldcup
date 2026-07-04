export const poolData = {
  title: "World Cup Bracket Pool",
  lastUpdated: "2026-07-03",

  scoring: {
    roundOf32: 1,
    roundOf16: 2,
    quarterfinal: 3,
    semifinal: 4,
    final: 5,
    thirdPlace: 3,
  },

  notes: [
    "Otis & Tyler are now scored straight up with the rest of the group.",
    "The Round of 32 is complete.",
    "Colombia is recorded as the winner over Ghana.",
    "Everyone picked Colombia and received 1 point.",
  ],

  matches: [
    { id: "r32-01", round: "Round of 32", points: 1, date: "2026-06-29", fixture: "Germany vs Paraguay", winner: "Paraguay", status: "final" },
    { id: "r32-02", round: "Round of 32", points: 1, date: "2026-06-30", fixture: "France vs Sweden", winner: "France", status: "final" },
    { id: "r32-03", round: "Round of 32", points: 1, date: "2026-06-28", fixture: "South Africa vs Canada", winner: "Canada", status: "final" },
    { id: "r32-04", round: "Round of 32", points: 1, date: "2026-06-29", fixture: "Netherlands vs Morocco", winner: "Morocco", status: "final" },
    { id: "r32-05", round: "Round of 32", points: 1, date: "2026-07-02", fixture: "Portugal vs Croatia", winner: "Portugal", status: "final" },
    { id: "r32-06", round: "Round of 32", points: 1, date: "2026-07-02", fixture: "Spain vs Austria", winner: "Spain", status: "final" },
    { id: "r32-07", round: "Round of 32", points: 1, date: "2026-07-01", fixture: "United States vs Bosnia and Herzegovina", winner: "United States", status: "final" },
    { id: "r32-08", round: "Round of 32", points: 1, date: "2026-07-01", fixture: "Belgium vs Senegal", winner: "Belgium", status: "final" },
    { id: "r32-09", round: "Round of 32", points: 1, date: "2026-06-29", fixture: "Brazil vs Japan", winner: "Brazil", status: "final" },
    { id: "r32-10", round: "Round of 32", points: 1, date: "2026-06-30", fixture: "Ivory Coast vs Norway", winner: "Norway", status: "final" },
    { id: "r32-11", round: "Round of 32", points: 1, date: "2026-06-30", fixture: "Mexico vs Ecuador", winner: "Mexico", status: "final" },
    { id: "r32-12", round: "Round of 32", points: 1, date: "2026-07-01", fixture: "England vs DR Congo", winner: "England", status: "final" },
    { id: "r32-13", round: "Round of 32", points: 1, date: "2026-07-03", fixture: "Argentina vs Cape Verde", winner: "Argentina", status: "final" },
    { id: "r32-14", round: "Round of 32", points: 1, date: "2026-07-03", fixture: "Australia vs Egypt", winner: "Egypt", status: "final" },
    { id: "r32-15", round: "Round of 32", points: 1, date: "2026-07-02", fixture: "Switzerland vs Algeria", winner: "Switzerland", status: "final" },
    { id: "r32-16", round: "Round of 32", points: 1, date: "2026-07-03", fixture: "Colombia vs Ghana", winner: "Colombia", status: "final" },
  ],

  players: [
    {
      name: "Henry",
      champion: "France",
      finalist: "Argentina",
      roundOf32Picks: ["Germany", "France", "Canada", "Morocco", "Portugal", "Spain", "United States", "Belgium", "Brazil", "Norway", "Mexico", "England", "Argentina", "Egypt", "Switzerland", "Colombia"],
    },
    {
      name: "Louisa",
      champion: "France",
      finalist: null,
      roundOf32Picks: ["Germany", "France", "Canada", "Morocco", "Portugal", "Spain", "United States", "Belgium", "Brazil", "Norway", "Mexico", "England", "Argentina", "Egypt", "Algeria", "Colombia"],
    },
    {
      name: "Lawrence",
      champion: "France",
      finalist: "Argentina",
      roundOf32Picks: ["Germany", "France", "Canada", "Netherlands", "Portugal", "Spain", "United States", "Belgium", "Japan", "Norway", "Mexico", "England", "Argentina", "Egypt", "Switzerland", "Colombia"],
    },
    {
      name: "Julie",
      champion: "France",
      finalist: "Argentina",
      roundOf32Picks: ["Germany", "France", "Canada", "Netherlands", "Croatia", "Spain", "United States", "Belgium", "Brazil", "Norway", "Mexico", "England", "Argentina", "Australia", "Switzerland", "Colombia"],
    },
    {
      name: "Otis & Tyler",
      champion: "France",
      finalist: "Argentina",
      roundOf32Picks: ["Germany", "France", "Canada", "Netherlands", "Croatia", "Spain", "United States", "Senegal", "Brazil", "Norway", "Mexico", "England", "Argentina", "Egypt", "Algeria", "Colombia"],
    },
    {
      name: "John",
      champion: "France",
      finalist: "England",
      roundOf32Picks: ["Germany", "France", "South Africa", "Netherlands", "Portugal", "Spain", "United States", "Senegal", "Japan", "Norway", "Ecuador", "England", "Argentina", "Egypt", "Switzerland", "Colombia"],
    },
  ],
};
