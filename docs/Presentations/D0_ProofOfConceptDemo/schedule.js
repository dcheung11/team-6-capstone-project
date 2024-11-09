const { Console } = require('console');
const fs = require('fs');
// const { start } = require('repl');

// Load teams and slots data from JSON files
const teams = JSON.parse(fs.readFileSync('./data/teams_mini.json', 'utf8'));
const slots = JSON.parse(fs.readFileSync('./data/slots_mini.json', 'utf8'));

teams.forEach(team => { // Initialize team property
    team.opponentList = [];
    getDivisionOpponents(team, teams);
})

///////////////////////
// UTILITY FUNCTIONS //
///////////////////////

// Utility function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Run the scheduling function
const seasonLength = 1; // Adjust this as necessary
generateSchedule(teams, slots, seasonLength);

// // Set up counters for tracking games assigned to each team
// teams.forEach(team => {
//     team.gamesAssigned = 0;
//     team.preferredCount = 0; // Tracks how many times a team gets their preferred time slot
// });

function restructureSlots(slots){
    // Divide slots into weekly schedules
    // weeklySlots needs to be an array of slot objects with slot.isAvailable off definition
    weeklySlots = {};
    slots.forEach(slot => {
        slot.isAvailable = true; // initialize slot availability
        week = getWeekNumber(slot.calendar_day);
        if (!weeklySlots[week]) {
            weeklySlots[week] = [];
        }
        weeklySlots[week].push(slot);
    });
    return weeklySlots
}

function getWeekNumber(dateStr) {
    let dateObj = new Date(dateStr);
    if (isNaN(dateObj)) {
        console.error('Invalid date:', dateStr);
        return NaN;
    }
    let startOfYear = new Date(dateObj.getFullYear(), 0, 1);
    let dayOfYear = Math.floor((dateObj - startOfYear) / (24 * 60 * 60 * 1000));
    return Math.ceil((dayOfYear + startOfYear.getDay() + 1) / 7);
}

function getDivisionOpponents(team, teams){
    // Adds all opponents a team can face in their division
    division = team.division;
    teams.forEach(opponent => {
        if (opponent.division == division && opponent.id != team.id){ // check division and that its not the current team
            //console.log(opponent)
            team.opponentList.push(opponent);
            //console.log(team.opponentList);
        }
    });
    
    return
}

// function getDivisionTeams(teams, division){ // Would've been used in getDivsionOpponents
//     // Takes all teams and a division and returns the teams in that divison
//     return
// }

function isValidSlotForTeam(team, slot){
    // Takes a team and a lot and returns if the slot works based on blacklist
    if (team.blacklist_days.includes(slot.day_of_week)){
        return false;
    }
    return true;
}

function findAvailableTeam(teams, slot){
    // Takes a team and a slot and finds an available team
    for (const team of teams) {
        if (isValidSlotForTeam(team, slot)){
            //console.log(`team found: ${team.name}`)
            return team;
        }
    };
    //console.log(`team not found`)
    return null;
}

function findAvailableOpponent(team, slot, unassignedTeams){
    // Takes a team and a slot and returns an available opponent
    // For opponents left for the team, checks availability
    //console.log(team.opponentList);
    for (const opponent of team.opponentList){
        //console.log(`current opponent: ${opponent.name}`)
        if (isValidSlotForTeam(opponent, slot) && unassignedTeams.some(team => team.id === opponent.id)){
            return opponent;
        }
    };
    return null;
}

function removeFromUnassigned(unassignedTeams, team1, team2){
    // Takes list of unassigned teams and removes team1 and team2
    unassignedTeams = unassignedTeams.filter(team => team.id !== team1.id && team.id !== team2.id);
    return unassignedTeams;
}

function updateOpponentLists(team1, team2){
    // Updates the tracker of opponents left to face for team1 and team2 (remove each from respectve lists)
    team1.opponentList = team1.opponentList.filter(opponent => opponent.id !== team2.id);
    team2.opponentList = team2.opponentList.filter(opponent => opponent.id !== team1.id);
    return
}

function assignSlotToTeams(schedule, slot, team1, team2) {
    // Extract the week number from the slot date to use it as the key
    const weekKey = `week${getWeekNumber(new Date(slot.calendar_day))}`;

    // If the week key doesn't exist in the schedule create it
    if (!schedule[weekKey]) {
        schedule[weekKey] = [];
    }

    // Create a game object representing the assigned slot
    const game = {
        slotId: slot.slot_id,
        field: slot.field,
        date: slot.calendar_day,
        weekday: slot.day_of_week,
        time: slot.time,
        teams: [team1.name, team2.name],
        division: team1.division // Assuming both teams are in the same division
    };

    // Add the game to the corresponding week's schedule
    schedule[weekKey].push(game);

    // Remove these teams from their opponent lists and unassigned teams list
    updateOpponentLists(team1, team2);
    unassignedTeams = removeFromUnassigned(unassignedTeams, team1, team2);

    // Change slot availability
    slot.isAvailable = false;

    // Log the assignment for verification
    console.log(`Assigned ${team1.name} vs ${team2.name} to slot ${slot.slot_id} on ${slot.calendar_day} at ${slot.time}`);
    return schedule
}

//////////////////////////
// SCHEDULING ALGORITHM //
//////////////////////////

function generateSchedule(teams, slots, seasonLength) {
    schedule = {};

    // Shuffle teams to avoid bias
    teams = shuffleArray(teams);
    console.log(Array.isArray(teams)); // Should print `true` if `teams` is an array.

    // Initialize a list of teams not scheduled yet
    unassignedTeams = [...teams];
    console.log(Array.isArray(unassignedTeams)); // Should print `true` if `teams` is an array.
    
    // Organize slots into weekly slots
    weeklySlots = restructureSlots(slots);

    // Schedule team gamers per week
    for (week in weeklySlots) {
        weeklySlots[week].forEach(slot => {
            if (slot.isAvailable == true) {
                //console.log(`Working...`);
                const primaryTeam = findAvailableTeam(unassignedTeams, slot);
                //console.log(primaryTeam);
                if (primaryTeam) {
                    console.log(`looking for opponent for ${primaryTeam.name}...`)
                    const opponentTeam = findAvailableOpponent(primaryTeam, slot, unassignedTeams);
                    if (opponentTeam) {
                        console.log(`assigning ${primaryTeam.name} and ${opponentTeam.name} to ${slot.slot_id}`)
                        schedule = assignSlotToTeams(schedule, slot, primaryTeam, opponentTeam);
                    } else {
                        // Log that no opponent team was available for this slot
                        console.log(`No opponent available for ${primaryTeam.name} in slot ${slot.slot_id}. Trying next slot.`);
                    }
                } else {
                    // Log that no primary team could be matched for this slot
                    console.log(`No primary team available for slot ${slot.slot_id}. Trying next slot.`);
                }
            }
        });
    };
    
    // print schedule fro verification
    console.log("Final Schedule:")
    console.dir(schedule, { depth: null });

    return schedule;
}



