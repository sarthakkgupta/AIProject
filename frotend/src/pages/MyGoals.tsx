import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import remarkGfm from 'remark-gfm';

// Custom renderer for ReactMarkdown to make links open in a new tab
const LinkRenderer = ({ href = '', children, ...props }: React.ComponentPropsWithoutRef<'a'>) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
};

const formatText = (text: string) => {
  // Replace \n with actual line breaks
  return text.replace(/\\n/g, '\n');
};

// Clean the content by removing unwanted markdown syntax
const cleanContent = (content: string) => {
  if (!content) return '';
  return content.replace(/\*\*/g, '');
};

// Format subtask content by removing "Subtask X" labels and styling resources
const formatSubtasks = (content: string) => {
  if (!content) return '';
  
  // First clean asterisks and line breaks
  let formattedContent = cleanContent(formatText(content));
  
  // Replace "Subtask X:" or "[Subtask X]" pattern with the actual content
  formattedContent = formattedContent.replace(/- (Subtask \d+:)/gi, '-');
  formattedContent = formattedContent.replace(/\[(Subtask \d+)\]/gi, '');
  
  // Format resource text to be lighter
  formattedContent = formattedContent.replace(/(Resource:.*?)(\n|$)/g, '<span class="resource-text">$1</span>$2');
  
  return formattedContent;
};

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  
  // Get day, month and year
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  
  // Add ordinal suffix to day
  let suffix = "th";
  if (day === 1 || day === 21 || day === 31) {
    suffix = "st";
  } else if (day === 2 || day === 22) {
    suffix = "nd";
  } else if (day === 3 || day === 23) {
    suffix = "rd";
  }
  
  // Return formatted date
  return `${day}${suffix} ${month} ${year}`;
};

interface Task {
  title: string;
  content: string;
  duration: string;
}

interface Goal {
  _id: string;
  user_id: string;
  query: string;
  result: {
    objective: string;
    tasks: Task[];
  };
  timestamp: string;
}

export default function MyGoals() {
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleDelete = async (goalId: string) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/task/${goalId}?user_id=${user?.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setGoals(goals.filter(goal => goal._id !== goalId));
      } else {
        throw new Error('Failed to delete goal');
      }
    } catch (err) {
      console.error('Error deleting goal:', err);
      setError('Failed to delete goal');
    }
  };

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        if (!isLoaded) return;

        if (!user) {
          setError('Please sign in to view your goals');
          setLoading(false);
          return;
        }

        console.log('Fetching goals for user:', user.id);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/history?user_id=${user.id}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('API Error:', errorData);
          throw new Error(`Failed to fetch goals: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Received goals:', data);
        setGoals(data.history);
      } catch (err) {
        console.error('Error fetching goals:', err);
        setError('Failed to fetch goals');
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [getToken, user, isLoaded]);

  if (!isLoaded) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <div className="error-card">Please sign in to view your goals</div>;
  }

  if (loading) {
    return <div className="loading">Loading your goals...</div>;
  }

  if (error) {
    return <div className="error-card">{error}</div>;
  }

  return (
    <div className="container">
      <div className="goals-header">
        <h1>My Goals</h1>
        <Link to="/" className="button">Create New Goal</Link>
      </div>

      <div className="goals-grid">
        {goals.map((goal) => (
          <div key={goal._id} className="goal-card">
            <div className="goal-header-wrapper">
              <div className="goal-date-wrapper">
                <span className="goal-date-text">
                  {formatDate(goal.timestamp)}
                </span>
              </div>
              <h2 className="goal-title">{goal.query}</h2>
            </div>

            <div className="tasks-container">
              {goal.result.tasks.map((task, taskIndex) => (
                <div key={taskIndex} className="task-ticket">
                  <div className="task-number">{formatText(cleanContent(task.title))}</div>
                  {task.duration && (
                    <div className="timeline-box">
                      <div>Duration: {task.duration}</div>
                    </div>
                  )}
                  <div className="task-content">
                    <ReactMarkdown components={{ a: LinkRenderer }} remarkPlugins={[remarkGfm]}>
                      {formatSubtasks(task.content)}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>

            <div className="goal-card-actions">
              <Link to={`/goals/${goal._id}`} className="view-details-button">
                View Details →
              </Link>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDelete(goal._id);
                }} 
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {goals.length === 0 && (
        <div className="empty-state">
          <p>You haven't created any goals yet.</p>
          <Link to="/" className="button">Create Your First Goal</Link>
        </div>
      )}
    </div>
  );
}