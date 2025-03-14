const HttpError = require("../models/http-error"); 
const Standing = require("../models/standing"); 
const Game = require("../models/game");
const mongoose = require("mongoose"); 
const Team = require("../models/team");

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

  // include all teams even without played games
  const teamsInDivision = await Team.find({ divisionId: divisionId });
  //console.log(teamsInDivision);

  const teamStats = {};
  teamsInDivision.forEach((team) => {
    teamStats[team._id.toString()] = {
      team: team._id,
      name: team.name, 
      p: 0,
      w: 0,
      d: 0,
      l: 0,
      rs: 0,
      ra: 0,
      differential: 0
    };
  });

  // update stats for games that have been played
  const games = await Game.find({
    division: divisionId,
    homeScore: { $ne: null },
    awayScore: { $ne: null }
  });

  games.forEach((game) => {
    const homeId = game.homeTeam.toString();
    const awayId = game.awayTeam.toString();

    if (!teamStats[homeId]) {
      teamStats[homeId] = { team: homeId, p: 0, w: 0, d: 0, l: 0, rs: 0, ra: 0, differential: 0 };
    }
    if (!teamStats[awayId]) {
      teamStats[awayId] = { team: awayId, p: 0, w: 0, d: 0, l: 0, rs: 0, ra: 0, differential: 0 };
    }

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
  

  // RANKING LOGIC

  const rankingEntries = Object.entries(teamStats).map(([teamId, stats]) => ({
    team: new mongoose.Types.ObjectId(teamId),
    rank: "-", // placeholder value until the team plays
    p: stats.p,
    w: stats.w,
    l: stats.l,
    d: stats.d,
    rs: stats.rs,
    ra: stats.ra,
    differential: stats.rs - stats.ra
  }));

  const rankedTeams = rankingEntries.filter((team) => team.p > 0 || team.l > 0);
  
  rankedTeams.sort((a, b) => {
    if (b.p !== a.p) return b.p - a.p;
    return b.differential - a.differential;
  });

  // assign ranks to the ranked teams
  rankedTeams.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  // now slap on unranked teams 
  const finalRankings = [...rankedTeams, ...rankingEntries.filter((team) => team.rank === "-")];

  try {
    await Standing.findOneAndUpdate(
      { division: divisionId },
      { rankings: finalRankings },
      { upsert: true }
    );
    console.log("Updated standings");
  } catch (err) {
    console.error("Failed to update standings:", err);
    throw new HttpError("Failed to update standings.", 500);
  }
};

module.exports = { getStandingsByDivision, updateStandings };
