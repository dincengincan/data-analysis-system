# Omics Data Retrieval and Analysis System

![flow-gif](https://github.com/dincengincan/data-analysis-system/assets/51540754/4f91245d-9f97-44e0-a8e9-67a97f527978)



Here is the demo link, you can try it out here: https://data-analysis-system-live.vercel.app/

This is a full-stack application that allows users to retrieve specific omics data, process it, and visualize the results. The project is built using Node.js for the backend, React for the frontend, and MongoDB as the database.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Docker](https://www.docker.com/products/docker-desktop/)

### Installation

1. Clone the repository:
   `git clone git@github.com:dincengincan/data-analysis-system.git`
2. Navigate to the project directory: `cd data-analysis-system`
3. Run `docker-compose up`
4. You should see the app on `http://localhost:5173/`

### Running locally without Docker

1. Navigate to the server directory: `cd data-analysis-system/server`
2. Run BE project: `npm start`
3. Navigate to the client directory: `cd data-analysis-system/client`
4. Run FE project: `npm run dev`
5. You should see the app on `http://localhost:5173/`
