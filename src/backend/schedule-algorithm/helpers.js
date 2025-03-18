const Gameslot = require("../models/gameslot");
const Game = require("../models/game");
const Division = require("../models/division");

const assignDivisionGames = async (
  allDivisionPairings,
  schedule,
  season,
  teams
) => {
  // Fetch all available game slots for the season
  const availableSlots = await Gameslot.find({
    date: { $gte: season.startDate, $lte: season.endDate },
    game: null,
  }).sort("date time");

  // flatten all pairings into a single array, alternating between divisions
  const totalWeeks = Math.ceil(
    (season.endDate - season.startDate) / (7 * 24 * 60 * 60 * 1000)
  );
  const teamAvailability = new Map();

  let interleavedPairings = interleavePairings(
    allDivisionPairings,
    totalWeeks,
    teams
  );
  const MIN_ACCEPTABLE_SCORE = 0.5; // Threshold for acceptance

  // Batch operations
  const gamesToCreate = [];
  const slotsToUpdate = [];

  for (const slot of availableSlots) {
    if (interleavedPairings.length === 0) break; // Stop if no more pairings are left

    const slotDate = slot.date.toISOString().split("T")[0];
    const weekNumber = getWeekNumber(slot.date, season.startDate);

    // Find the first valid pairing for this slot
    let pairingIndex = interleavedPairings.findIndex(
      ({ homeTeam, awayTeam, division, week }) => {
        if (week !== weekNumber) return false;

        // Check team availability
        const homeTeamBusy = teamAvailability.get(homeTeam._id)?.has(slotDate);
        const awayTeamBusy = teamAvailability.get(awayTeam._id)?.has(slotDate);

        if (homeTeamBusy || awayTeamBusy) return false;

        // Check blacklisted days, proceed if the slot is not blacklisted for both teams
        if (
          isBlacklisted(slot.date, homeTeam.blacklistDays) ||
          isBlacklisted(slot.date, awayTeam.blacklistDays)
        ) {
          return false;
        }

        // Check preferred times, proceed if the slot matches at least one team's preferred time
        const homeTeamScore = getTimeScore(slot.time, homeTeam.preferredTimes);
        const awayTeamScore = getTimeScore(slot.time, awayTeam.preferredTimes);

        const avgScore = (homeTeamScore + awayTeamScore) / 2;
        if (avgScore < MIN_ACCEPTABLE_SCORE) return false;

        return true;
      }
    );

    // If a valid pairing is found, assign the game to the slot
    if (pairingIndex !== -1) {
      // Assign the game to the slot
      const { division, homeTeam, awayTeam } =
        interleavedPairings[pairingIndex];

      const game = new Game({
        date: slot.date,
        time: slot.time,
        field: slot.field,
        homeTeam: homeTeam._id,
        awayTeam: awayTeam._id,
        division: division._id,
        gameslot: slot._id,
      });
      gamesToCreate.push(game);

      slotsToUpdate.push({
        _id: slot._id,
        game: game._id,
      });

      // Update availability tracking
      teamAvailability.set(
        homeTeam._id,
        (teamAvailability.get(homeTeam._id) || new Set()).add(slotDate)
      );
      teamAvailability.set(
        awayTeam._id,
        (teamAvailability.get(awayTeam._id) || new Set()).add(slotDate)
      );

      // Remove the assigned pairing from the list
      interleavedPairings.splice(pairingIndex, 1);
    } else {
      // Remove constraints and try again, Check team availability only (ignore preferred times and blacklisted days)
      pairingIndex = interleavedPairings.findIndex(({ homeTeam, awayTeam }) => {
        const homeTeamBusy = teamAvailability.get(homeTeam._id)?.has(slotDate);
        const awayTeamBusy = teamAvailability.get(awayTeam._id)?.has(slotDate);
        return !homeTeamBusy && !awayTeamBusy;
      });
    }
  }

  // Batch operations (saves time to do all at the end)
  await bulkSaveSchedule(
    gamesToCreate,
    slotsToUpdate,
    schedule,
    allDivisionPairings
  );

  //  Might be uneccessary
  const sortedGames = await Game.find({ _id: { $in: schedule.games } }).sort(
    "date time"
  );
  schedule.games = sortedGames.map((game) => game._id);
  await schedule.save();
};

// New generateDivisionPairings function that generates pairings in a round-robin fashion
// this shuffles the order of games and improves the runtime as well

const generateDivisionPairings = (teams) => {
  const pairings = [];
  const gamesPerTeam = 20;
  let round = 0;
  const gamesPerTeamMap = new Map();
  const homeGamesCount = new Map();
  const totalGames = (gamesPerTeam * teams.length) / 2;

  if (teams.length < 2) return [];

  // Initialize home count for each team
  teams.forEach((team) => (homeGamesCount[team] = 0));

  let teamsCopy = [...teams];
  // For odd-numbered divisions, add a "bye" team
  if (teams.length % 2 !== 0) {
    teamsCopy.push(null);
  }

  // n accounts for the bye team if present
  const n = teamsCopy.length;
  const gamesPerRound = Math.floor(n / 2);

  while (pairings.length < totalGames) {
    for (let i = 0; i < gamesPerRound; i++) {
      let homeTeam = teamsCopy[i];
      let awayTeam = teamsCopy[n - 1 - i];

      // Skip if either team is the "bye" team
      if (!homeTeam || !awayTeam) continue;

      // Swap home/away if one team has more home games
      if (homeGamesCount[homeTeam] > homeGamesCount[awayTeam]) {
        [homeTeam, awayTeam] = [awayTeam, homeTeam];
      }

      pairings.push([homeTeam, awayTeam]);

      // Update home count
      homeGamesCount[homeTeam]++;
      gamesPerTeamMap.set(
        homeTeam._id,
        (gamesPerTeamMap.get(homeTeam._id) || 0) + 1
      );
      gamesPerTeamMap.set(
        awayTeam._id,
        (gamesPerTeamMap.get(awayTeam._id) || 0) + 1
      );
    }

    // Rotate teams (except the first one) for Round Robin Algo
    teamsCopy = [teamsCopy[0], ...teamsCopy.slice(2).concat(teamsCopy[1])];
    round++;
  }

  //   Log pairings and games per team
  //   pairings.forEach((pairing) => {
  //     console.log(pairing[0]?.name + " vs " + pairing[1]?.name);
  //   });
  //   console.log(gamesPerTeamMap);

  return pairings;
};

// Interleaves pairings from all divisions to ensure a distribution of games and not games sequentilly played by division

const interleavePairings = (allDivisionPairings, totalWeeks, teams) => {
  const allPairings = [];
  const NUM_GAMES_PER_TEAM = 20;

  // Helper function to calculate the number of 1-game and 2-game weeks for a team
  const calculateTeamWeeklyDistribution = (totalGames, totalWeeks) => {
    let highGames = Math.ceil(totalGames / totalWeeks);
    let lowGames = Math.floor(totalGames / totalWeeks);

    let numHighWeeks = totalGames % totalWeeks;
    let numLowWeeks = totalWeeks - numHighWeeks;
    return { lowGames, highGames, numLowWeeks, numHighWeeks };
  };

  const { lowGames, highGames, numLowWeeks, numHighWeeks } =
    calculateTeamWeeklyDistribution(NUM_GAMES_PER_TEAM, totalWeeks);

  allDivisionPairings.forEach(({ division, pairings }) => {
    const teamGamesPerWeek = new Map(); // { teamId: { week1: 1, week2: 2, ... } }
    const teamsThatPlayedInWeek = new Map(); // { week: [team1, team2, ...] }
    let availablePairings = [...pairings];

    // assign 1 game per team per week
    for (let week = 1; week <= totalWeeks; week++) {
      if (!teamsThatPlayedInWeek.has(week)) {
        teamsThatPlayedInWeek.set(week, new Set());
      }
      while (teamsThatPlayedInWeek.get(week).size != division.teams.length) {
        if (availablePairings.length == 0) break;
        const [home, away] = availablePairings[0];
        // Initialize the week's game count for the home team
        if (!teamGamesPerWeek.has(home._id)) {
          teamGamesPerWeek.set(home._id, {});
        }
        if (!teamGamesPerWeek.has(away._id)) {
          teamGamesPerWeek.set(away._id, {});
        }

        allPairings.push({ division, homeTeam: home, awayTeam: away, week });

        // Update the count for this week
        teamGamesPerWeek.get(home._id)[week] =
          (teamGamesPerWeek.get(home._id)[week] || 0) + 1;
        teamGamesPerWeek.get(away._id)[week] =
          (teamGamesPerWeek.get(away._id)[week] || 0) + 1;
        teamsThatPlayedInWeek.get(week).add(home._id);
        teamsThatPlayedInWeek.get(week).add(away._id);

        availablePairings.shift();
      }
    }

    // Assign remaining pairings for the second iteration
    for (let week = 1; week <= totalWeeks; week++) {
      if (availablePairings.length > 0) {
        const [home, away] = availablePairings[0];
        // Update the count for this week
        const homeWeekGameCount = teamGamesPerWeek.get(home._id)[week];
        const awayWeekGameCount = teamGamesPerWeek.get(away._id)[week];

        if (homeWeekGameCount < highGames && awayWeekGameCount < highGames) {
          allPairings.push({ division, homeTeam: home, awayTeam: away, week });
          // Update the count for this week
          teamGamesPerWeek.get(home._id)[week] = homeWeekGameCount + 1;
          teamGamesPerWeek.get(away._id)[week] = awayWeekGameCount + 1;
          availablePairings.shift();
        }
      }
    }
    if (availablePairings.length != 0) {
      throw new Error("Something went wrong with week assignments");
    }
    teamGamesPerWeek.forEach((teamWeeks, teamId) => {
      Object.values(teamWeeks).forEach((week) => {
        if (week != lowGames && week != highGames) {
          throw new Error("Team has incorrect weekly distribution");
        }
      });
      const totalGames = Object.values(teamWeeks).reduce(
        (sum, games) => sum + games,
        0
      );

      if (!(NUM_GAMES_PER_TEAM <= totalGames <= NUM_GAMES_PER_TEAM + 2)) {
        throw new Error("Team has incorrect total games");
      }

      if (Object.values(teamWeeks).length != totalWeeks) {
        console.warn(
          "Team has incorrect number of weeks with games (odd number bye weeks-> shorter season)"
        );
      }
    });
  });

  return allPairings;
};

const getWeekNumber = (date, seasonStartDate) => {
  const diffInDays = Math.floor(
    (date - seasonStartDate) / (1000 * 60 * 60 * 24)
  );
  return Math.floor(diffInDays / 7) + 1; // Week 1, Week 2, etc.
};

const generateGameSlots = async (startDate, endDate) => {
  const gameSlotTimes = ["5:00 PM", "6:30 PM", "8:00 PM", "9:30 PM"];
  const fields = ["Field 1", "Field 2", "Field 3"];

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Generate all valid weekday dates ahead of time
  const validDates = [];
  let currentDate = new Date(start);

  while (currentDate <= end) {
    if (currentDate.getDay() >= 0 && currentDate.getDay() <= 4) {
      validDates.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Fetch all existing game slots in one query
  const existingSlots = await Gameslot.find({
    date: { $gte: start, $lte: end },
  }).lean();

  const existingSet = new Set(
    existingSlots.map((s) => `${s.date.toISOString()}|${s.time}|${s.field}`)
  );

  // Create missing slots
  const newSlots = [];
  for (const date of validDates) {
    for (const field of fields) {
      for (const time of gameSlotTimes) {
        const key = `${date.toISOString()}|${time}|${field}`;
        if (!existingSet.has(key)) {
          newSlots.push({ date, time, field });
        }
      }
    }
  }

  // Use MongoDB bulk insert for efficiency
  console.log("Bulk insert gameslots");
  if (newSlots.length > 0) {
    await Gameslot.insertMany(newSlots);
  }
};

/* Time preferences and Blacklist Day score calculations */

const timeScores = {
  "Mostly Early": {
    "5:00 PM": 1.0,
    "6:30 PM": 0.8,
    "8:00 PM": 0.3,
    "9:30 PM": 0.1,
  },
  Balanced: {
    "5:00 PM": 0.6,
    "6:30 PM": 1.0,
    "8:00 PM": 0.8,
    "9:30 PM": 0.6,
  },
  "Mostly Late": {
    "5:00 PM": 0.1,
    "6:30 PM": 0.3, // Poor match
    "8:00 PM": 0.8, // Good match
    "9:30 PM": 1.0, // Best match
  },
};

const getTimeScore = (time, preferredTime) => {
  return timeScores[preferredTime][time];
};

const isBlacklisted = (date, blacklistedDays) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayIndex = new Date(date).getUTCDay(); // Use UTC-based day index
  const day = days[dayIndex];
  return blacklistedDays.includes(day);
};

// Saves all games, updates gameslots, and updates division games in efficient batch operations
async function bulkSaveSchedule(
  gamesToCreate,
  slotsToUpdate,
  schedule,
  allDivisionPairings
) {
  const divisionMap = new Map();
  for (const dp of allDivisionPairings) {
    divisionMap.set(dp.division._id.toString(), dp.division);
  }
  console.log("Saving games");
  const createdGames = await Game.insertMany(gamesToCreate);
  console.log("Updating gameslots");
  const updateOperations = slotsToUpdate.map((slot) => ({
    updateOne: {
      filter: { _id: slot._id }, // Filter by slot ID
      update: { $set: { game: slot.game } }, // Set the game field
    },
  }));
  await Gameslot.bulkWrite(updateOperations);
  console.log("Saving schedule");
  schedule.games.push(...createdGames.map((g) => g._id));
  await schedule.save();
  console.log("Updating division");

  const divisionUpdates = new Map(); // { divisionId: { games: [gameIds] } }
  for (const game of createdGames) {
    const divisionId = game.division.toString();
    if (!divisionUpdates.has(divisionId)) {
      divisionUpdates.set(divisionId, { games: [] });
    }
    divisionUpdates.get(divisionId).games.push(game._id);
  }
  const bulkOps = [];
  for (const [divisionId, update] of divisionUpdates) {
    bulkOps.push({
      updateOne: {
        filter: { _id: divisionId }, // Filter by division ID
        update: { $push: { games: { $each: update.games } } }, // Add game IDs to the division's games array
      },
    });
  }
  await Division.bulkWrite(bulkOps);
}

module.exports = {
  generateDivisionPairings,
  assignDivisionGames,
  generateGameSlots,
};
