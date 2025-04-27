import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser, useAuth } from '@clerk/clerk-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { PlanResponse } from '../types'

// Custom renderer for ReactMarkdown to make links open in a new tab
const LinkRenderer = ({ href, children, ...props }: React.ComponentProps<'a'>) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
};

const formatText = (text: string) => {
  // Replace \n with actual line breaks
  return text.replace(/\\n/g, '\n');
}

// Clean the content by removing unwanted markdown syntax
const cleanContent = (content: string) => {
  if (!content) return '';
  return content.replace(/\*\*/g, '');
};

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
}

const EditableField: React.FC<EditableFieldProps> = ({ value, onChange, isEditing, onEdit, onSave }) => {
  if (isEditing) {
    return (
      <div className="editable-field">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="editable-textarea"
        />
        <button onClick={onSave} className="save-button">
          Save
        </button>
      </div>
    );
  }
  return (
    <div className="editable-field" onClick={onEdit}>
      <ReactMarkdown components={{ a: LinkRenderer }} remarkPlugins={[remarkGfm]}>
        {value}
      </ReactMarkdown>
      <button className="edit-button">Edit</button>
    </div>
  );
};

export default function CreateGoal() {
  const navigate = useNavigate()
  const { isSignedIn, user } = useUser()
  useAuth()
  const [goal, setGoal] = useState('')
  const [includeTimeline, setIncludeTimeline] = useState(false)
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<PlanResponse | null>(null)
  const [error, setError] = useState('')
  const [selectedTask, setSelectedTask] = useState<number | null>(null)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const [editingFields, setEditingFields] = useState<{ [key: string]: boolean }>({})

  const handleEdit = (fieldId: string) => {
    setEditingFields(prev => ({ ...prev, [fieldId]: true }));
  };

  const handleSave = async (fieldId: string, newValue: string, taskIndex?: number) => {
    if (!plan) return;
    
    try {
      const updatedPlan = { ...plan };

      if (fieldId === 'objective') {
        updatedPlan.objective = newValue;
      } else if (taskIndex !== undefined) {
        const [field] = fieldId.split('_');
        updatedPlan.tasks[taskIndex] = {
          ...updatedPlan.tasks[taskIndex],
          [field]: newValue
        };
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/update-plan`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal,
          plan: updatedPlan,
          user_id: user?.id
        })
      });

      if (response.ok) {
        setPlan(updatedPlan);
        setEditingFields(prev => ({ ...prev, [fieldId]: false }));
        // Navigate to the goals page after successful save
        navigate('/goals');
      } else {
        throw new Error('Failed to update plan');
      }
    } catch (err) {
      console.error('Error updating plan:', err);
      setError('Failed to update plan');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isSignedIn) {
      setShowAuthPrompt(true)
      return
    }

    setLoading(true)
    setError('')
    console.log('Submitting request:', { goal, include_timeline: includeTimeline, user_id: user?.id })

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          goal, 
          include_timeline: includeTimeline,
          user_id: user?.id
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate plan');
      }

      const data = await response.json()
      console.log('API Response:', data)
      if (data.error) {
        throw new Error(data.error);
      }
      setPlan(data)
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to connect to the server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem', color: 'var(--text-primary)' }}>Create New Goal</h1>
      
      <form onSubmit={handleSubmit} className="card">
        <div className="input-container">
          <input
            type="text"
            className="input-field"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Enter your goal (e.g., 'Learn Python in 30 days')"
            required
          />
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Plan'}
          </button>
        </div>
        <div className="toggle-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={includeTimeline}
              onChange={(e) => setIncludeTimeline(e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
          <span className="toggle-label">Include timeline</span>
        </div>
      </form>

      {showAuthPrompt && !isSignedIn && (
        <div className="card auth-prompt">
          <p>Please sign in to generate your plan</p>
          <button className="button">Sign In</button>
        </div>
      )}

      {error && (
        <div className="card error-card">
          {error}
        </div>
      )}

      {plan && (
        <div>
          <div className="card objective-card">
            <h2>Goal</h2>
            <EditableField
              value={formatText(plan.objective)}
              onChange={(value) => {
                const updatedPlan = { ...plan, objective: value };
                setPlan(updatedPlan);
              }}
              isEditing={editingFields['objective'] || false}
              onEdit={() => handleEdit('objective')}
              onSave={() => handleSave('objective', plan.objective)}
            />
          </div>

          <div className="tasks-grid">
            {plan.tasks.map((task, index) => (
              <div 
                key={index} 
                className={`task-card ${selectedTask === index ? 'selected' : ''}`}
                onClick={() => setSelectedTask(selectedTask === index ? null : index)}
              >
                <h3>{formatText(cleanContent(task.title))}</h3>
                
                {task.duration && (
                  <div className="timeline-box">
                    <div>Duration: {task.duration}</div>
                  </div>
                )}
                
                {selectedTask === index && (
                  <div className="task-details">
                    <div className="task-section">
                      <h4>Content</h4>
                      <EditableField
                        value={cleanContent(task.content)}
                        onChange={(value) => {
                          const updatedTasks = [...plan.tasks];
                          updatedTasks[index] = { ...task, content: value };
                          setPlan({ ...plan, tasks: updatedTasks });
                        }}
                        isEditing={editingFields[`content_${index}`] || false}
                        onEdit={() => handleEdit(`content_${index}`)}
                        onSave={() => handleSave(`content_${index}`, task.content, index)}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}