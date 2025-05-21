
# 👤 User Management System with Admin Panel

A CRUD-based user management system built with Node.js, Express, MongoDB, and EJS. Admins can register, login, and manage users via a protected interface.

## 🚀 Features

- Admin registration and login
- Secure session-based admin access
- Create, update, delete, and search users
- Password validation for updates and deletions
- MongoDB integration via Mongoose
- Fully EJS-rendered frontend with form validation feedback

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Templating**: EJS
- **Session Management**: express-session
- **Utilities**: method-override, uuid

## 📂 Project Structure

```

├── model/
│   ├── schema.js       # User schema
│   └── admin.js        # Admin schema
├── public/             # Static CSS and client assets
├── views/              # All EJS views
├── server.js           # Main Express application
├── package.json
└── README.md

````

## 🧪 Local Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/user-management-system.git
cd user-management-system
````

2. Install dependencies:

```bash
npm install
```

3. Start MongoDB locally

4. Run the server:

```bash
node server.js
```

5. Open your browser and visit:

```
http://localhost:3000/admin/login
```

## 📋 Admin Setup

* First-time setup:

  * Register an admin at `/admin/Register`
* Login:

  * Go to `/admin/login`
* After login, you'll be redirected to the admin dashboard (`/admin`)

## 🔐 Admin Routes

* `/admin/Register` – Register new admin
* `/admin/login` – Login existing admin
* `/admin/logout` – Logout
* `/admin` – Protected admin dashboard

## 👤 User Management Routes

* `/user` – View all users
* `/user/new` – Create user
* `/user/:id/edit` – Edit user
* `/user/:id` – Delete confirmation form
* `/search?filter=email@example.com` – Search users by email

## ⚙️ Environment Variables

*Currently, MongoDB connection URI is hardcoded. For production use, consider using a `.env` file.*
