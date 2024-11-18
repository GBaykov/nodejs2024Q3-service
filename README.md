# Home Library Service

Prerequisites
Git - Download & Install Git.
Node.js - Download & Install Node.js and the npm package manager.
Downloading
git clone git@github.com:katyastan/nodejs2024Q3-service.git
Installing NPM modules
npm install
Port
Application is running on port by default: http://localhost:4000

You can change the port. Open the .env file and set the desired port number:

PORT=4000
Running application
To start the application:

npm run start
To run the app in development mode with hot-reloading, use:

npm run start:dev
After starting the app on port (4000 as default) you can open in your browser OpenAPI documentation by typing http://localhost:4000/doc/. For more information about OpenAPI/Swagger please visit https://swagger.io/.

Testing
After application running open new terminal and enter:

To run all tests without authorization

npm run test
To run only one of all test suites

npm run test -- <path to suite>
Auto-fix and format
Ensure code quality and consistency by running:

npm run lint
npm run format
API Documentation
The API documentation is generated using OpenAPI (Swagger) and is available at:

http://localhost:4000/doc
To generate new api.yaml file:

npm run swagger
Debugging in VSCode
Press F5 to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging

Running app in Docker Desktop

To start the Application with DB in production mode :

docker compose build

To run the Application in developer mode (use Typescript code in local folder) with restarting upon changes implemented into src folder:

docker compose up

To run Tests against app:

npm run test

To vulnerabilities scanning

npm run docker:scan
