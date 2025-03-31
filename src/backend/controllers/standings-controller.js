// Author: Emma Wigglesworth
// Description: This file contains the controller functions for the league standings
// Last Modified: 2025-03-31

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
  } catch (err) {
    return next(new HttpError("Fetching standings failed, please try again.", 500));
  }

  if (!standings) {
    return next(new HttpError("No standings found for the selected division.", 404));
  }

  res.json({ standings: standings.toObject({ getters: true, virtuals: false }) }); // sumn to get rid of double IDs
};

const updateStandings = async (divisionId) => {
  // include all teams even without played games
  const teamsInDivision = await Team.find({ divisionId: divisionId });

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
      differential: 0,
      dl: 0
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
    const defaultLossTeamId = game.defaultLossTeam ? game.defaultLossTeam.toString() : null;

    if (!teamStats[homeId]) {
      teamStats[homeId] = { team: homeId, p: 0, w: 0, d: 0, l: 0, rs: 0, ra: 0, differential: 0, dl: 0 };
    }
    if (!teamStats[awayId]) {
      teamStats[awayId] = { team: awayId, p: 0, w: 0, d: 0, l: 0, rs: 0, ra: 0, differential: 0, dl: 0 };
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
    
    if (defaultLossTeamId && teamStats[defaultLossTeamId]) {
      teamStats[defaultLossTeamId].dl += 1;
    }    

  });

  // Update each team's record in the database
  const updatePromises = Object.values(teamStats).map(stats => 
    Team.findByIdAndUpdate(stats.team, {
      $set: {
        wins: stats.w,
        draws: stats.d,
        losses: stats.l
      }
    })
  );

  // Wait for all updates to complete
  await Promise.all(updatePromises);

  // RANKING LOGIC

  const rankingEntries = Object.entries(teamStats).map(([teamId, stats]) => ({
    team: teamId,
    rank: "-", // placeholder value until the team plays
    p: stats.p,
    w: stats.w,
    l: stats.l,
    d: stats.d,
    rs: stats.rs,
    ra: stats.ra,
    differential: stats.rs - stats.ra,
    dl: stats.dl,
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
  } catch (err) {
    console.error("Failed to update standings:", err);
    throw new HttpError("Failed to update standings.", 500);
  }
};

module.exports = { getStandingsByDivision, updateStandings };
