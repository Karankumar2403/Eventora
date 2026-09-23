# 🎟️ Eventora — Event Booking Platform

A full-stack **MERN** (MongoDB, Express, React, Node.js) event booking web application where users can browse events, book tickets with OTP verification, and admins can manage everything from a dashboard.

---

## ✨ Features

- 🔐 **User Authentication** — Register & Login with Email OTP verification
- 🎫 **Event Browsing** — Search and filter events in real time
- 📋 **Booking System** — Book tickets with OTP confirmation
- 👤 **User Dashboard** — View and cancel your bookings
- 🛠️ **Admin Dashboard** — Create/delete events, approve/reject bookings
- 📧 **Email Notifications** — Booking confirmations sent via email
- 🚀 **Production Ready** — Deployable as a single service on Render

---

## 🖥️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS v4 |
| Backend | Node.js, Express v5 |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + Bcrypt |
| Email | Nodemailer (Gmail) |
| Dev Tools | Nodemon, Concurrently |

---

## 📁 Project Structure

```
Eventora/
├── client/               # React frontend (Vite)
│   └── src/
│       ├── components/   # Navbar
│       ├── context/      # AuthContext (global auth state)
│       ├── pages/        # Home, Login, Register, Dashboard, Admin...
│       └── utils/        # Axios instance
├── server/               # Express backend
│   ├── controllers/      # Business logic
│   ├── middlewares/      # JWT auth middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API route definitions
│   ├── utils/            # Email helper
│   └── seed.js           # Sample data seeder
├── package.json          # Root scripts (concurrently)
└── render.yaml           # Render deployment config
```

---

## 🚀 Getting Started (Local Setup)

Follow these steps exactly — even if you're new to MERN!

### Prerequisites

Make sure you have these installed:
- [Node.js](https://nodejs.org/) v18 or higher
- [Git](https://git-scm.com/)
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) account

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/Karankumar2403/Eventora.git
cd Eventora
```

---

### Step 2 — Set up environment variables

The server needs a `.env` file with secret keys. Create it:

```bash
# Navigate into the server folder
cd server

# Create the .env file by copying the example
copy .env.example .env
```

Now open `server/.env` and fill in your values:

```env
PORT=5000
MONGO_URL=your_mongodb_atlas_connection_string
JWT_SECRET=any_random_secret_string_here
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

> 💡 **How to get each value:**
>
> - **MONGO_URL** → [Create a free cluster on MongoDB Atlas](https://www.mongodb.com/atlas) → Connect → Drivers → Copy the connection string
> - **JWT_SECRET** → Any random string like `mysecret123` (used to sign login tokens)
> - **EMAIL_USER** → Your Gmail address
> - **EMAIL_PASS** → A Gmail **App Password** (not your regular password). [How to generate one →](https://support.google.com/accounts/answer/185833)

---

### Step 3 — Install dependencies

Go back to the root folder and install everything at once:

```bash
# Make sure you're in the root Eventora/ folder
cd ..

npm run install:all
```

This installs packages for both the server and client automatically.

---

### Step 4 — Seed sample data (optional but recommended)

This adds 10 sample events and creates an admin account so you can explore the app:

```bash
npm run seed
```

You'll see output like:
```
✅ MongoDB Connected
✅ Admin user created → email: admin@eventora.com | password: admin123
🎉 Successfully seeded 10 events!
```

---

### Step 5 — Run the app

```bash
npm run dev
```

This starts both the backend and frontend at the same time:

| Service | URL |
|---|---|
| 🟢 Frontend (React) | http://localhost:5173 |
| 🟢 Backend (Express) | http://localhost:5000 |

---
## 🌐 Deploying to Render (Free Hosting)

> Deploy the entire app (frontend + backend) as **one service** on Render.

### Step 1 — Push to GitHub
Make sure your code is pushed to GitHub (already done if you cloned this repo).

### Step 2 — Create a Web Service on Render
1. Go to [render.com](https://render.com) and sign up for free
2. Click **New → Web Service**
3. Connect your GitHub account and select the **Eventora** repository
4. Render will auto-read the `render.yaml` config

### Step 3 — Add Environment Variables
In the Render dashboard under **Environment**, add:

| Key | Value |
|---|---|
| `MONGO_URL` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Any random secret string |
| `EMAIL_USER` | Your Gmail address |
| `EMAIL_PASS` | Your Gmail App Password |

### Step 4 — Deploy!
Click **Create Web Service**. Render will:
1. Install all dependencies
2. Build the React app
3. Start the Express server which serves everything

> ⚠️ **Important:** In MongoDB Atlas, go to **Network Access** and add `0.0.0.0/0` to allow connections from Render's servers.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/verifyotp` | Verify OTP |

### Events
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/events` | Get all events (supports `?search=`) |
| GET | `/api/events/:id` | Get single event |
| POST | `/api/events` | Create event *(admin only)* |
| DELETE | `/api/events/:id` | Delete event *(admin only)* |

### Bookings
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/bookings/send-otp` | Send booking OTP |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/my` | Get my bookings |
| GET | `/api/bookings/all` | Get all bookings *(admin only)* |
| PUT | `/api/bookings/:id/confirm` | Confirm booking *(admin only)* |
| DELETE | `/api/bookings/:id` | Cancel booking |

---

## 📝 Available Scripts

Run these from the **root** `Eventora/` folder:

| Command | Description |
|---|---|
| `npm run dev` | Start both client and server in development mode |
| `npm run install:all` | Install all dependencies (server + client) |
| `npm run build` | Build for production |
| `npm start` | Start in production mode |
| `npm run seed` | Seed the database with sample events |

---

## 🛠️ Common Issues & Fixes

**Q: The app says "MongoDB not connected"**  
A: Check your `MONGO_URL` in `server/.env`. Make sure your IP is whitelisted in MongoDB Atlas Network Access.

**Q: OTP emails are not being received**  
A: Make sure you're using a Gmail **App Password**, not your regular Gmail password. Also check your spam folder.

**Q: Port already in use**  
A: Another process is using port 5000 or 5173. Change `PORT=5001` in `server/.env` or kill the other process.

**Q: Changes not reflecting after editing**  
A: The dev server auto-reloads. If it doesn't, stop with `Ctrl+C` and re-run `npm run dev`.

---

## 🤝 Contributing

1. Fork this repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes and commit: `git commit -m "Add your feature"`
4. Push to GitHub: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  Made with ❤️ using the MERN Stack
</div>
