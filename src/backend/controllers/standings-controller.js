const HttpError = require("../models/http-error"); 
const Standing = require("../models/standing"); 

// Fetch standings by division
const getStandingsByDivision = async (req, res, next) => {
  const { divisionId } = req.params;

  let standings;
  try {
    standings = await Standing.findOne({ division: divisionId })
      .populate("rankings.team", "teamName")
      .sort({ "rankings.rank": 1 }); // Ensures ranked order
  } catch (err) {
    return next(new HttpError("Fetching standings failed, please try again.", 500));
  }

  if (!standings) {
    return next(new HttpError("No standings found for the selected division.", 404));
  }

  res.json({ standings: standings.toObject({ getters: true }) });
};

module.exports = { getStandingsByDivision };
