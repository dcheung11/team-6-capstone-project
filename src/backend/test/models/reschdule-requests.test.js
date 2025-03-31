// Author: Damien Cheung
// Description: Unit tests for the Reschedule Request model
// Last Modified: 2025-03-21

const mongoose = require('mongoose');
const RescheduleRequest = require('../../models/reschedule-request.js');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Set up MongoMemoryServer for an in-memory database before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Connect to the in-memory database
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Clean up after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('RescheduleRequest Model', () => {
  it('should create a reschedule request with required fields', () => {
    const rescheduleRequest = new RescheduleRequest({
      game: new mongoose.Types.ObjectId(),
      requestingTeam: new mongoose.Types.ObjectId(),
      recipientTeam: new mongoose.Types.ObjectId(),
      requestedGameslot: new mongoose.Types.ObjectId(),
    });

    expect(rescheduleRequest.game).toBeDefined();
    expect(rescheduleRequest.requestingTeam).toBeDefined();
    expect(rescheduleRequest.recipientTeam).toBeDefined();
    expect(rescheduleRequest.requestedGameslot).toBeDefined();
    expect(rescheduleRequest.status).toBe('Pending'); // Default status
    expect(rescheduleRequest.createdAt).toBeDefined(); // CreatedAt should be set by default
  });

  it('should throw an error if game is missing', async () => {
    const rescheduleRequest = new RescheduleRequest({
      requestingTeam: new mongoose.Types.ObjectId(),
      recipientTeam: new mongoose.Types.ObjectId(),
      requestedGameslot: new mongoose.Types.ObjectId(),
    });

    await expect(rescheduleRequest.validate()).rejects.toThrowError('game');
  });

  it('should throw an error if requestingTeam is missing', async () => {
    const rescheduleRequest = new RescheduleRequest({
      game: new mongoose.Types.ObjectId(),
      recipientTeam: new mongoose.Types.ObjectId(),
      requestedGameslot: new mongoose.Types.ObjectId(),
    });

    await expect(rescheduleRequest.validate()).rejects.toThrowError('requestingTeam');
  });

  it('should throw an error if recipientTeam is missing', async () => {
    const rescheduleRequest = new RescheduleRequest({
      game: new mongoose.Types.ObjectId(),
      requestingTeam: new mongoose.Types.ObjectId(),
      requestedGameslot: new mongoose.Types.ObjectId(),
    });

    await expect(rescheduleRequest.validate()).rejects.toThrowError('recipientTeam');
  });

  it('should throw an error if requestedGameslot is missing', async () => {
    const rescheduleRequest = new RescheduleRequest({
      game: new mongoose.Types.ObjectId(),
      requestingTeam: new mongoose.Types.ObjectId(),
      recipientTeam: new mongoose.Types.ObjectId(),
    });

    await expect(rescheduleRequest.validate()).rejects.toThrowError('requestedGameslot');
  });

  it('should default status to "Pending"', async () => {
    const rescheduleRequest = new RescheduleRequest({
      game: new mongoose.Types.ObjectId(),
      requestingTeam: new mongoose.Types.ObjectId(),
      recipientTeam: new mongoose.Types.ObjectId(),
      requestedGameslot: new mongoose.Types.ObjectId(),
    });

    expect(rescheduleRequest.status).toBe('Pending');
  });

  it('should accept a valid status', async () => {
    const rescheduleRequest = new RescheduleRequest({
      game: new mongoose.Types.ObjectId(),
      requestingTeam: new mongoose.Types.ObjectId(),
      recipientTeam: new mongoose.Types.ObjectId(),
      requestedGameslot: new mongoose.Types.ObjectId(),
      status: 'Accepted',
    });

    expect(rescheduleRequest.status).toBe('Accepted');
  });

  it('should throw an error for invalid status', async () => {
    const rescheduleRequest = new RescheduleRequest({
      game: new mongoose.Types.ObjectId(),
      requestingTeam: new mongoose.Types.ObjectId(),
      recipientTeam: new mongoose.Types.ObjectId(),
      requestedGameslot: new mongoose.Types.ObjectId(),
      status: 'InvalidStatus',
    });

    await expect(rescheduleRequest.validate()).rejects.toThrowError('status');
  });

  it('should set createdAt to the current date by default', async () => {
    const rescheduleRequest = new RescheduleRequest({
      game: new mongoose.Types.ObjectId(),
      requestingTeam: new mongoose.Types.ObjectId(),
      recipientTeam: new mongoose.Types.ObjectId(),
      requestedGameslot: new mongoose.Types.ObjectId(),
    });

    expect(rescheduleRequest.createdAt).toBeDefined();
    expect(rescheduleRequest.createdAt).toBeInstanceOf(Date);
  });
});
