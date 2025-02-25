Project Setup Guide
This README provides instructions for setting up and running the project.
Prerequisites

Git and
Docker (Download Docker)

Installation Steps

1. Clone the Repository (ssh: git@github.com:Tarunuppu/updown.git)

2. Environment Variables Setup: You need to set up aws credentials inside updown-backend folder
   Check the .env.example files in each directory to know the required environment variables.

3. Build and Run with Docker
   Once everything is set up, run the following command in the root directory:
   "docker-compose up --build"
   This will build the Docker containers and start the application.

Troubleshooting
If you encounter any issues during setup, please check:

1. All environment variables are correctly set
2. Docker is running properly
3. You have sufficient permissions to execute the commands
4. You have sufficient memory to deploy containers

Windows Issue:
Please ensure that the docker-entrypoint file use LF (`\n`) line endings instead of Windows-style CRLF (`\r\n`).
Fix:
In VS Code: Look at the bottom right of the editor window and click on "CRLF" to change it to "LF"
