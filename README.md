# McMaster Softball League Online Scheduling and League Management Platform

Developer Names:

Derek Li, Damien Cheung, Emma Wigglesworth, Jad Haytaoglu, Temituoyo Ugborogho

Date of project start: September 20th 2024

The McMaster GSA softball league is used every summer by 30-40 teams and as many as 1,000 unique participants. The league is currently organized through 1 an old software platform accessible via a web browser. However, it is outdated and does not include features for administrators to maintain the site without extensive knowledge of computer programming. The capstone team will be responsible for a complete site review, including all functionalities such as scheduling, division management, communication between captains, waiver management, rescheduling, score and league standings management, and other tasks identified by the capstone teams and the client. The capstone team would then be responsible for creating a web-based service with the same functionalities, but in an updated form that enables league and schedule management from a convenient user interface (specific access privileges for team representatives and league administrators). The GSA league is aware that paid-for and ad-supported services are available, and features present in those applications should be explored and added. The GSA league is a minimal-cost non-profit and would like a personalized platform to operate without committing to paid-for services.

The folders and files for this project are as follows:

docs - Documentation for the project  
refs - Reference material used for the project, including papers  
src - Source code  
test - Test cases  

# Project Overview

Our project is built using the **MERN Stack** (MongoDB, Express, React, Node.js), because it allows full-stack **JavaScript development**, making the backend (API) and frontend (UI) seamlessly connected. It is **scalable, efficient, and widely supported**, enabling fast development with modern web technologies. 

[MERN Stack](https://www.mongodb.com/resources/languages/mern-stack)

Inside the `src` folder, we have `backend` and `frontend` subdirectories:

## Backend (`backend/`)
The backend is built using **Node.js, Express, and MongoDB**. MongoDB is a **NoSQL database**, which allows flexible, schema-less data storage. This makes it easy to store and scale league-related data such as teams, schedules, scores, and user authentication. The backend provides a **REST API** that the frontend uses to fetch and update league information, ensuring scalability as the league grows.


## Frontend (`frontend/`)
The frontend is developed with **React**. It handles the **user interface and experience**, displaying league information, schedules, standings, and team details. The frontend communicates with the backend to retrieve and submit data. Our modern tech stack also makes it easy to implement role-based access control and store user information.

