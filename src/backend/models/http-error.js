// Author: Damien Cheung
// Description: HTTP Error model for error handling in the API
// Last Modified: 2025-03-31
class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); // Add a "message" property
    this.code = errorCode; // Adds a "code" property
  }
}

module.exports = HttpError;