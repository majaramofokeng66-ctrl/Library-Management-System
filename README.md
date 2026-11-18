# Library Management System

## Project Description
A web-based Library Management System developed using React, Node.js, Express.js and MySQL.

## Main Features
- Dashboard displaying library statistics.
- Add, edit and delete books.
- Monitor book availability and low stock.
- Add new book stock.
- Borrow and return books.
- View transaction history.
- Register, edit and delete users.
- User login with password hashing.
- Admin and Member role-based access.

## Technologies Used
- React
- JavaScript
- Node.js
- Express.js
- MySQL
- HTML and CSS
- Fetch API
- bcrypt

## Project Structure
- frontend/ – React application.
- backend/ – Express API and database routes.

## How to Run the Project

### Backend
1. Open the backend folder in PowerShell.
2. Run `npm install`.
3. Create a .env file in the backend folder and configure DB_HOST, DB_USER, DB_PASSWORD and DB_NAME..
4. Run `npm run dev`.

### Frontend
1. Open the frontend folder in another terminal.
2. Run `npm install`.
3. Run `npm run dev`.

## Database
Create a MySQL database named `library_management` and configure the required tables.
The database must contain the books, users and transactions tables before starting the application.

## Developed For
Web Application Development Assignment.
