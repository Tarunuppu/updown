Project Setup Guide
This README provides instructions for setting up and running the project.
Prerequisites

Git
Docker (Download Docker)

Installation Steps
1. Clone the Repository (ssh: git@github.com:Tarunuppu/updown.git)
2. Environment Variables Setup
You need to set up environment variables in three locations:

Root folder
updown-ui folder
updown-backend folder

Check the .env.example files in each directory to know the required environment variables.
Example:
cp .env.example .env
Then edit the .env file with your specific configuration values.

3. Build and Run with Docker
Once everything is set up, run the following command in the root directory:
"docker-compose up --build"
This will build the Docker containers and start the application.



Troubleshooting
If you encounter any issues during setup, please check:

All environment variables are correctly set
Docker is running properly
You have sufficient permissions to execute the commands