const express = require('express');
const Game = require('../models/game');
const Team = require('../models/team');
const Notification = require('../models/notification');
const Gameslot = require('../models/gameslot');
const RescheduleRequest = require('../models/reschedule-request');

const createRequest = async (req, res) => {
    try {
        const { gameId, newGameSlotId, requestingTeamId } = req.body;

        // Find the game to be rescheduled
        const game = await Game.findById(gameId);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        // Check if the new game slot is available
        // this shouldn't even happen since unavailable game slots
        // shouldn't even appear in reschedule menu
        const isSlotAvailable = await Game.findOne({ gameslot: newGameSlotId });
        if (isSlotAvailable) {
            return res.status(400).json({ message: 'New game slot is not available' });
        }

        // Find the recipient team
        const otherTeamId = game.teams.find(teamId => teamId !== requestingTeamId);
        const otherTeam = await Team.findById(otherTeamId);
        if (!otherTeam) {
            return res.status(404).json({ message: 'Other team not found' });
        }

        const newGameSlot = Gameslot.findById(newGameSlotId);
        const requestingTeam = Team.findById(requestingTeamId);

        // create reschedule request
        const rescheduleRequest = new RescheduleRequest({
            game: gameId,
            requestingTeam: requestingTeamId,
            recipientTeam: otherTeamId,
            requestedGameslot: newGameSlotId,
        });

        await rescheduleRequest.save();

        // Create a notification for the other team
        const notification = new Notification({
            type: 'reschedule request',
            sender: requestingTeamId,
            recipient: otherTeamId,
            message: `Team ${requestingTeam.name} has requested to reschedule the game to ${newGameSlot.date}. Please approve or reject the request.`
        });

        await notification.save();

        res.status(200).json({ message: 'Reschedule request sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { createRequest };