// Author: Damien Cheung
// Description: Unit tests for the Announcement model
// Last Modified: 2025-03-21

const mongoose = require('mongoose');
const Announcement = require('../../models/announcements');
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

describe('Announcement Model', () => {
  it('should create an announcement with required fields', () => {
    const announcement = new Announcement({
      title: 'Season Update',
      content: 'The season schedule has been updated.',
    });

    expect(announcement.title).toBe('Season Update');
    expect(announcement.content).toBe('The season schedule has been updated.');
    expect(announcement.createdAt).toBeDefined();
  });

  it('should throw an error if title is missing', async () => {
    const announcement = new Announcement({
      content: 'The season schedule has been updated.',
    });

    await expect(announcement.validate()).rejects.toThrowError('title');
  });

  it('should throw an error if content is missing', async () => {
    const announcement = new Announcement({
      title: 'Season Update',
    });

    await expect(announcement.validate()).rejects.toThrowError('content');
  });

  it('should set createdAt to the current date by default', async () => {
    const announcement = new Announcement({
      title: 'Season Update',
      content: 'The season schedule has been updated.',
    });

    expect(announcement.createdAt).toBeDefined();
    expect(announcement.createdAt).toBeInstanceOf(Date);
  });

  it('should allow announcements with content length greater than 0', async () => {
    const announcement = new Announcement({
      title: 'Important Announcement',
      content: 'Please attend the meeting tomorrow.',
    });

    await expect(announcement.validate()).resolves.not.toThrow();
  });
});
