# Garb Rehab

## Overview
**Garb Rehab** is an e-commerce platform focused on selling thrifted clothes with an eco-friendly delivery system using electric motorbikes. The platform aims to reduce textile waste and lower carbon emissions.

## Table of Contents
1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Running the Application](#running-the-application)
6. [Environment Variables](#environment-variables)
7. [Important Note on Local Development](#important-note-on-local-development)

## Features
- **User registration and authentication**
- **Browse and search for thrifted clothes**
- **Secure payment processing using Flutterwave**
- **Eco-friendly delivery scheduling**

## Technologies Used
- **Frontend**: React.js
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Gateway**: Flutterwave
- **Deployment**: Render

## Prerequisites
Before you begin, ensure you have the following installed on your machine:
- **Node.js**: v14 or above
- **npm**: v6 or above
- **MongoDB**: v4.4 or above
- **Git**: v2.28 or above

## Installation
Follow these steps to set up the project locally:

**1. Clone the Repository**
```bash
git clone https://github.com/yourusername/garb-rehab.git
cd Garb-Rehab
```
**2. Install Dependencies**
Frontend
```bash
cd frontend
npm install
```
Backend
```bash
cd ../backend
npm install
```
Admin
```bash
cd ../admin
npm install
```
## Running the Application
1. Set Up Environment Variables
Create a .env file in the backend directory and add the following environment variables:

```makefile
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FLUTTERWAVE_SECRET_KEY=your_flutterwave_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
```
2. Starting the servers.
- Backend
```bash
node ./index.js
```
- Frontend
```bash
npm start
```
- Admin
```bash
npm run dev
```

## Important Note on Local Development
Since Garb Rehab has been deployed, the application might not work perfectly in a local development environment. This is due to potential changes in URL configurations, especially for third-party integrations such as Google OAuth and Flutterwave payment processing. These services often require consistent URLs, which might differ between local and deployed environments.

To ensure smooth local development:

- Update any hardcoded URLs or endpoints to match your local setup.
- Consider using tools like ngrok to expose your local server to the internet temporarily, which can help test third-party services that require a publicly accessible URL.
- Be aware that some features, like payment processing, may not work without proper URL setup in the environment variables.
