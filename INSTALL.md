# Installation Instructions

## Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) 
- [npm](https://www.npmjs.com/) (Comes with Node.js)

v22.12.0 is suggested and was used in development.

## Installation

### .env file
To connect to the backend, you must have the correct MongoDB env variables.

In the `/backend/.env` file, you should see something like this:

```
PORT=3001
MONGO_URI=mongodb+srv://root:[CODE]@capstone-cluster.ghx0o.mongodb.net/
JWT_SECRET=yourSecretKey
```

You need to replace `[CODE]` with our MongoDB Cluster Secret, since we cannot expose this code publicly in our repository. Please contact any of the capstone team for access to the secret.

Replace the `.env` file and save it. You can now proceed to starting the backend.

### Backend Setup
1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
   You can ignore any warning flags, and add `--legacy-peer-deps` if this error resolution is suggested.
3. Start the backend server:
   ```sh
   npm start
   ```

### Frontend Setup
1. Open a new terminal window and navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
   You can ignore any warning flags, and add `--legacy-peer-deps` if this error resolution is suggested.
3. Start the frontend application:
   ```sh
   npm start
   ```

Your application should now be running locally at `http://localhost:3000/`

---

## Uninstallation

### Stopping the Application
1. If the backend and frontend are running, stop them by pressing `Ctrl + C` in their respective terminal windows.

### Removing Installed Dependencies
1. Navigate to the backend folder and remove dependencies:
   ```sh
   cd backend
   rm -rf node_modules package-lock.json
   ```
2. Navigate to the frontend folder and remove dependencies:
   ```sh
   cd frontend
   rm -rf node_modules package-lock.json
   ```

### Removing the Project
To completely remove the project from your system, delete the project folder:
```sh
rm -rf /path/to/project
```

Your software is now uninstalled.

