import { Routes, Route, Link } from 'react-router-dom'
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react'
import MyGoals from './pages/MyGoals'
import GoalDetails from './pages/GoalDetails'
import CreateGoal from './pages/CreateGoal'
import './App.css'

export default function App() {
  const { isSignedIn, user } = useUser()

  return (
    <>
      <div className="top-bar">
        <div className="nav-section">
          {isSignedIn && (
            <nav>
              <Link to="/goals" className="nav-link">My Goals</Link>
              <Link to="/" className="nav-link">Create Goal</Link>
            </nav>
          )}
        </div>
        <div className="auth-section">
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button className="login-button">Sign In</button>
            </SignInButton>
          ) : (
            <div className="user-section">
              <span className="welcome-text">Welcome, {user.firstName || user.username}!</span>
              <UserButton />
            </div>
          )}
        </div>
      </div>

      <Routes>
        <Route path="/" element={<CreateGoal />} />
        <Route path="/goals" element={<MyGoals />} />
        <Route path="/goals/:goalId" element={<GoalDetails />} />
      </Routes>
    </>
  )
}
