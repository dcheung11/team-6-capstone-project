const HttpError = require("../models/http-error"); 
const Standing = require("../models/standing"); 

const getStandingsByDivision = async (req, res, next) => {
  const { divisionId } = req.params;

  let standings;
  try {
    standings = await Standing.findOne({ division: divisionId })
      .populate("rankings.team", "teamName")
      .sort({ "rankings.rank": 1 }); // ranked order
  } catch (err) {
    return next(new HttpError("Fetching standings failed, please try again.", 500));
  }

  if (!standings) {
    return next(new HttpError("No standings found for the selected division.", 404));
  }

  // calculations for the run differential
  const standingsWithDifferential = standings.rankings.map((team) => ({
    ...team.toObject(),
    differential: team.rs - team.ra // runs scored - runs allowed
  }));

  res.json({ standings: standingsWithDifferential });
};

module.exports = { getStandingsByDivision };
