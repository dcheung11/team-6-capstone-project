const HttpError = require("../models/http-error"); 
const Standing = require("../models/standing"); 
const Game = require("../models/game");
const mongoose = require("mongoose"); 

const getStandingsByDivision = async (req, res, next) => {
  const { divisionId } = req.params;

  let standings;
  try {
    standings = await Standing.findOne({ division: divisionId })
      .populate("rankings.team", "name")
      .sort({ "rankings.rank": 1 }); // ranked order
    console.log(standings)
  } catch (err) {
    return next(new HttpError("Fetching standings failed, please try again.", 500));
  }

  if (!standings) {
    return next(new HttpError("No standings found for the selected division.", 404));
  }

  res.json({ standings: standings.toObject({ getters: true, virtuals: false }) }); // sumn to get rid of double IDs
};

const updateStandings = async (divisionId) => {
  console.log("updateStandings called with divisionId:", divisionId);

  const games = await Game.find({
    division: divisionId,
    homeScore: { $ne: null },
    awayScore: { $ne: null }
  });

  const teamStats = {};

  games.forEach((game) => {
    const homeId = game.homeTeam.toString();
    const awayId = game.awayTeam.toString();

    if (!teamStats[homeId]) teamStats[homeId] = { p: 0, w: 0, l: 0, d: 0, rs: 0, ra: 0 };
    if (!teamStats[awayId]) teamStats[awayId] = { p: 0, w: 0, l: 0, d: 0, rs: 0, ra: 0 };

    teamStats[homeId].rs += game.homeScore;
    teamStats[homeId].ra += game.awayScore;

    teamStats[awayId].rs += game.awayScore;
    teamStats[awayId].ra += game.homeScore;

    if (game.homeScore > game.awayScore) {
      teamStats[homeId].w += 1;
      teamStats[awayId].l += 1;
      teamStats[homeId].p += 2;
    } else if (game.homeScore < game.awayScore) {
      teamStats[awayId].w += 1;
      teamStats[homeId].l += 1;
      teamStats[awayId].p += 2;
    } else { 
      teamStats[homeId].d += 1;
      teamStats[awayId].d += 1;
      teamStats[homeId].p += 1;
      teamStats[awayId].p += 1;
    }
  });

  const rankingEntries = Object.entries(teamStats).map(([teamId, stats]) => ({
    team: new mongoose.Types.ObjectId(teamId),
    rank: 0,
    p: stats.p,
    w: stats.w,
    l: stats.l,
    d: stats.d,
    rs: stats.rs,
    ra: stats.ra,
    differential: stats.rs - stats.ra
  }));

  rankingEntries.sort((a, b) => {
    if (b.p !== a.p) return b.p - a.p; 
    return b.differential - a.differential;
  });

  rankingEntries.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  try {
    await Standing.findOneAndUpdate(
      { division: divisionId },
      { rankings: rankingEntries },
      { upsert: true }
    );
    console.log("Updated standings");
  } catch (err) {
    console.error("Failed to update standings:", err);
    throw new HttpError("Failed to update standings.", 500);
  }
};

module.exports = { getStandingsByDivision, updateStandings };
