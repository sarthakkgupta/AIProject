# AI Planner

An AI-powered goal planning application that helps users create, track, and manage personalized developmental goals and plans.

## Features

- **AI-Generated Goal Plans**: Generate comprehensive goal plans with step-by-step tasks based on your input
- **Interactive Goal Management**: View, edit, and track your goals
- **User-Friendly Interface**: Clean and intuitive design for a seamless experience
- **Personalized Development Plans**: Get customized plans tailored to your personal and professional growth needs

## Project Structure

- `frontend/`: React-based frontend application built with TypeScript and Vite

## Prerequisites

Before running the application, make sure you have the following installed:

- Node.js (v16 or later)
- npm or yarn
- A running backend API service with endpoint for AI goal planning

## Getting Started

### Setup and Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/AIProject.git
   cd AIProject
   ```

2. Install dependencies
   ```
   # Install frontend dependencies
   cd frotend
   npm install
   ```

3. Configure environment variables

   Create a `.env` file in the `frotend` directory with the following:
   ```
   VITE_API_URL=your_backend_api_url
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

### Running the Application

1. Start the frontend development server
   ```
   cd frotend
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5174` (or the port shown in your terminal)

## Usage

1. **Sign in** using your account credentials
2. **Create a new goal** by describing what you want to achieve
3. **View your generated plan** with detailed tasks and timelines
4. **Edit any details** by clicking on the edit icons
5. **Track your progress** through the goal details page

## Technologies Used

- **Frontend**: React, TypeScript, Vite, Clerk Authentication
- **Styling**: CSS
- **Authentication**: Clerk

## Screenshots

[Add screenshots here]

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.