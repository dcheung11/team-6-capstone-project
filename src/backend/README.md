## Backend Structure

### `models/`
The `models/` folder holds the **MongoDB schemas**. These define the structure and validation rules for the data stored in the database (e.g., team, player). Models are used by the controllers to interact with MongoDB.

### `controllers/`
This folder contains the logic for handling incoming requests and interacting with the data. Each controller typically corresponds to a resource (e.g., teams, users) and contains functions for **creating, reading, updating, and deleting** data, and model-specific functions.

### `routes/`
This folder defines the **API routes**. It contains the endpoint definitions that the frontend uses to interact with the backend. Each route corresponds to a specific function in a controller, such as retrieving or updating team data.

### `server.js`
The `server.js` file is the entry point for the backend application. It sets up the Express server, connects to the MongoDB database, and configures middleware to handle HTTP requests. This file also defines the routes and links them to the relevant controllers.

### `scripts/`
The `scripts/` folder contains utility scripts for tasks, such as updating schedule status or other backend operations that need to run on a scheduled basis.

### `schedule-algorithm/`
The `schedule-algorithm/` folder contains the logic for the **league scheduling algorithm**. This algorithm is responsible for creating and managing the game schedules, ensuring teams are paired correctly, games are evenly distributed, constraints from captains are met, and scheduling conflicts are avoided.





