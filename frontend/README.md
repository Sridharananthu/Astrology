# 🌟 Astro Connect – Astrology Web Application

Astro Connect is a **full-stack astrology platform** built with the **MERN stack**.  
It enables:
- 🔮 **Users** to register, explore astrologers (Pandits), chat/call/book sessions.
- 🧘‍♂️ **Pandits** to manage profiles, handle bookings, and view wallet earnings.
- 🧑‍💼 **Admins** to manage users, pandit, and transactions via a powerful dashboard.

---
the project was developed by team kanayarashi!

## Pandit Data
{
  "name": "Pandit Rajesh Kulkarni",
  "dob": "1975-12-02",
  "gender": "Male",
  "languages": ["Hindi"],
  "skills": ["Vedic Astrology"],
  "email": "rajeshk@example.com",
  "password": "vedicguru"
}


{
  "name": "Pandita Neha Sharma",
  "dob": "1990-03-22",
  "gender": "Female",
  "languages": ["Hindi", "Marathi", "English"],
  "skills": ["Palmistry", "Vastu Shastra"],
  "otherSkill": "Face Reading",
  "email": "nehasharma@example.com",
  "password": "pandit@123"
}

{
  "name": "Pandit Suresh Trivedi",
  "dob": "1982-09-15",
  "gender": "Male",
  "languages": ["Hindi", "English"],
  "skills": ["Vedic Astrology", "Numerology"],
  "otherSkill": "Tarot Reading",
  "email": "sureshtrivedi@example.com",
  "password": "123456"
}


## 🚀 Tech Stack

### 🧩 Frontend
- **React.js + Vite**
- **React Router DOM** for navigation
- **Tailwind CSS** for styling
- **Lucide Icons** for visuals
- **Axios** for API communication
- **Shadcn UI** (optional components)
- **Framer Motion** for animations

### ⚙️ Backend
- **Node.js + Express.js**
- **MongoDB + Mongoose**
- **JWT (JSON Web Tokens)** for authentication
- **bcrypt** for password hashing
- **dotenv** for configuration
- **CORS** enabled API

---

## 📁 Project Structure

python
astro-app/
├── backend/
│ ├── controllers/
│ │ ├── userController.js
│ │ ├── panditController.js
│ │ ├── adminController.js
│ │ └── authController.js
│ │
│ ├── models/
│ │ ├── User.js
│ │ ├── Pandit.js
│ │ ├── Chat.js
│ │ └── Transaction.js
│ │
│ ├── routes/
│ │ ├── userRoutes.js
│ │ ├── panditRoutes.js
│ │ ├── adminRoutes.js
│ │ └── authRoutes.js
│ │
│ ├── middleware/
│ │ └── authMiddleware.js
│ │
│ ├── server.js
│ └── .env
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Navbar.jsx
│ │ │ ├── Footer.jsx
│ │ │ └── AdminComponents/
│ │ │ ├── AdminLayout.jsx
│ │ │ ├── Sidebar.jsx
│ │ │ └── Topbar.jsx
│ │ │
│ │ ├── pages/
│ │ │ ├── User/
│ │ │ │ ├── Auth/
│ │ │ │ │ ├── Login.jsx
│ │ │ │ │ └── Signup.jsx
│ │ │ │ ├── Dashboard/
│ │ │ │ │ └── UserDashboard.jsx
│ │ │ │ └── Landing/
│ │ │ │ ├── Home.jsx
│ │ │ │ ├── Pandits.jsx
│ │ │ │ ├── AstrologerProfile.jsx
│ │ │ │ ├── ChatPage.jsx
│ │ │ │ └── BookSession.jsx
│ │ │ │
│ │ │ ├── Pandit/
│ │ │ │ ├── PanditRegister.jsx
│ │ │ │ ├── PanditLogin.jsx
│ │ │ │ ├── PanditDashboard.jsx
│ │ │ │ ├── PanditWallet.jsx
│ │ │ │ └── PanditChangePassword.jsx
│ │ │ │
│ │ │ └── Admin/
│ │ │ ├── AdminDashboard.jsx
│ │ │ ├── ManagePandits.jsx
│ │ │ ├── ManageUsers.jsx
│ │ │ ├── Transactions.jsx
│ │ │ └── Settings.jsx
│ │ │
│ │ ├── routes/
│ │ │ ├── UserRoutes.jsx
│ │ │ ├── PanditRoutes.jsx
│ │ │ ├── AdminRoutes.jsx
│ │ │ └── ProtectedRoute.jsx
│ │ │
│ │ ├── services/
│ │ │ └── api.js
│ │ │
│ │ ├── App.jsx
│ │ └── main.jsx
│ │
│ ├── index.html
│ ├── package.json
│ └── vite.config.js
│
└── README.md


---

## ⚙️ Environment Variables

### **Backend `.env`**
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/astro
JWT_SECRET=your_super_secret_key
```

### **Frontend `.env`**
VITE_API_URL=http://localhost:5000/api

Actor	Auth Method	Protected Routes
User	JWT (Bearer Token)	/user/:id
Pandit	JWT (Bearer Token)	/pandit/dashboard, /pandit/wallet
Admin	Separate adminToken	/admin/* routes

All tokens are automatically attached via Axios interceptors inside src/services/api.js.

🧠 API Overview
User APIs
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login and get token
GET	/api/users/:id/dashboard	Fetch user details, chats, and pandit
Pandit APIs
Method	Endpoint	Description
POST	/api/pandit/register	Register new Pandit
POST	/api/pandit/login	Login Pandit
GET	/api/pandit/:id/dashboard	Get Pandit profile data
Admin APIs
Method	Endpoint	Description
GET	/api/admin/dashboard	Fetch overall analytics
GET	/api/admin/users	Manage users
GET	/api/admin/pandit	Manage pandit
GET	/api/admin/transactions	Track payments
💻 Run the Project Locally
1️⃣ Clone the repository
git clone https://github.com/<your-username>/astro-connect.git
cd astro-connect

2️⃣ Setup backend
cd backend
npm install
npm run dev


Server starts on http://localhost:5000

3️⃣ Setup frontend
cd ../frontend
npm install
npm run dev


App runs on http://localhost:5173

🔗 Example API Call (User Dashboard)

GET http://localhost:5000/api/users/:id/dashboard

Headers:

Authorization: Bearer <token>


Response:

{
  "user": {
    "_id": "690f423a1ea954635fef6ae1",
    "name": "Ramesh",
    "email": "ramesh@gmail.com",
    "zodiac": "Leo"
  },
  "pandit": [
    { "_id": "64ad...", "name": "Pandit Rajesh Sharma", "expertise": "Vedic Astrology", "rating": 4.8 }
  ],
  "chats": [
    { "panditId": "64ad...", "lastMessage": "Your stars look bright!", "date": "2025-11-08" }
  ]
}

🌈 Features
User

View, chat, and book astrologers.

Personal dashboard with details, chat history, and linked Pandits.

JWT-protected routes.

Pandit

Dashboard with session history, bookings, and wallet info.

Login, register, and password management.

Admin

Manage users, Pandits, and transactions.

View platform-wide analytics and settings.

🧰 Scripts

Frontend

npm run dev     # Start Vite dev server
npm run build   # Build for production


Backend

npm run dev     # Start backend in development mode (nodemon)
npm start       # Production mode

🧑‍💻 Contributors
Role	Name
🧠 Technical Architect	You
💻 Backend Developer	[Your name]
🎨 Frontend Developer	[Your name or teammate]
🧾 License

This project is licensed under the MIT License.

⭐ Future Enhancements

Real-time chat & video call via WebRTC / Socket.io

Payment gateway integration (Razorpay or Stripe)

AI-based astrology recommendations

Multi-language support


---

Would you like me to include a **setup script example** (like a `seed.js` file to auto-create sample users and pandit for testing)?  
That would make your local setup completely plug-and-play.