# Employee Task Management System

This is a web-based application designed to streamline task management within an organization. It provides CRUD (Create, Read, Update, Delete) operations for tasks, as well as user authentication with login and signup routes.

## Features

- **Task Management:** Users can create, view, update, and delete tasks.
- **User Authentication:** Secure login and signup routes for user authentication.
- **Role-Based Access Control:** Different levels of access for regular users and administrators.
- **Responsive UI:** Intuitive and user-friendly interface accessible from desktop and mobile devices.
- **Data Validation:** Input validation and error handling to ensure data integrity and security.

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript (React.js)
- **Backend:** Node.js (Express.js)
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** JSON Web Tokens (JWT)
- **Deployment:** Heroku, AWS, or similar cloud platforms

## Setup Instructions

1. Clone the repository: `git clone https://github.com/kshitijv09/devtasks.git`
2. Navigate to the project directory: `cd devtasks`
3. Install dependencies: `npm install`
4. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Define environment variables such as database connection string, JWT secret key, etc.
5. Start the server: `npm start`
6. Access the application at `http://localhost:3000` in your web browser.

## API Endpoints

- `POST /api/signup`: Register a new user.
- `POST /api/login`: Authenticate user and generate JWT token.
- `GET /api/tasks`: Retrieve all tasks.
- `GET /api/tasks/:id`: Retrieve a specific task by ID.
- `POST /api/tasks`: Create a new task.
- `PUT /api/tasks/:id`: Update an existing task.
- `DELETE /api/tasks/:id`: Delete a task by ID.

## Usage

1. Register a new user account using the signup route.
2. Log in with your credentials using the login route.
3. Access task management functionalities such as creating, updating, and deleting tasks.
4. Log out when done using the application.

## Contributing

Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
