Newton Project Tracker

A role-based web application built to help students submit and track academic projects, while admins and instructors provide timely feedback and oversight.
 Features

    Student Dashboard — Submit, edit, and track project progress

    Admin Interface — View all submissions, assign reviewers, give feedback

    Real-Time Sync — Submissions and feedback update instantly

    Authentication & RBAC — Secure access for students, admins, instructors

    Responsive UI — Styled with custom CSS and animated elements

    Backend API — Powered by Node.js, Express, PostgreSQL, and Sequelize

🛠️ Stack

    Frontend: React, Axios, CSS

    Backend: Node.js, Express

    Database: PostgreSQL + Sequelize ORM

    Auth: JWT-based authentication

    Deployment: Optional placeholder if hosted

Getting Started# 
      Clone the repository
git clone https://github.com/your-username/newton-project-tracker.git
cd newton-project-tracker

# Install dependencies
npm install

# Create a PostgreSQL database and set credentials in config/config.json or .env

# Run migrations and seeders
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

# Start backend
npm run dev

# In another terminal, go to client/ and start frontend
cd client
npm install
npm start

Project Structure
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── seeders/
├── client/
│   ├── components/
│   ├── pages/
│   └── styles/
├── migrations/
└── README.md

Author

Built and maintained by Lenox. ResiAuthor
