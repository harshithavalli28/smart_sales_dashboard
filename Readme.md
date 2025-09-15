##### SMART SALES DASHBOARD ######
The Smart Sales Dashboard is a centralized analytics tool designed to provide real-time visibility into sales performance, customer insights, and revenue trends. It enables the admin to track key metrics, identify opportunities, and make data-driven decisions efficiently. And helps employee’s to save data about customer, products and sales so that the admin can view dashboard created dynamically.
# 📊 Smart Sales & Customer Analytics Dashboard

A full-stack web application built with **React (frontend)**, **Node.js + Express (backend)**, and **MySQL** for database management.  

The project provides:
- 🔑 Authentication (Signup/Login with JWT)
- 👨‍💼 Admin Dashboard (analytics & insights)
- 👩‍💻 Employee Dashboard (customer/product/sales management)
- 📊 Charts & Graphs using Recharts/Chart.js
- ⚡ REST APIs with MySQL integration

---

## 🚀 Tech Stack

- **Frontend** → React 19, React Router v7, Axios, TailwindCSS, Recharts
- **Backend** → Node.js, Express.js, JWT, Bcrypt, MySQL2
- **Database** → MySQL (Workbench recommended)

---

## PROJECT STRUCTURE

SMART_SALES
| backend
| | middleware
| | | auth.js
| | routes
| | | auth.js
| | | customers.js
| | | products.js
| | | sales.js
| | | stats.js
| | .env
| | app.js
| | db.js
| | seed.js
| | package.json
| frontend
| | public
| | | index.html
| | src
| | | components
| | | | ProtectedRoute.jsx
| | | context
| | | | AuthContext.jsx
| | | pages
| | | | AdminDashboard.jsx
| | | | EmployeeDashboard.jsx
| | | | Login.jsx
| | | | ManageCustomers.jsx
| | | | ManageProducts.jsx
| | | | ManageSales.jsx
| | | | Signup.jsx
| | | api.js
| | | App.js
| | | index.css
| | | index.js

### RUN THE BACKEND ###
-mkdir backend
-cd backend
-npm init -y
-npm install bcrypt bcryptjs cors dotenv express jsonwebtoken
mysql2
-npm start


### RUN THE FRONTEND ###
-npx create-react-app frontend
-cd frontend
-npm install axios chart.js react-router-dom recharts 
-npm install
