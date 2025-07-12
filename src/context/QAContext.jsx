import React, { createContext, useContext, useState } from 'react'

// Create context
const QAContext = createContext()

// Custom hook to use QAContext
export const useQA = () => {
  const context = useContext(QAContext)
  if (!context) {
    throw new Error('useQA must be used within a QAProvider')
  }
  return context
}

// Mock data for demo
const initialQuestions = [
  {
    id: 1,
    title: 'How to implement authentication in React?',
    content:
      "<p>I'm building a React application and need to implement user authentication. What are the best practices for handling login, logout, and protecting routes?</p>",
    tags: ['react', 'authentication', 'javascript'],
    author: 'john_doe',
    createdAt: '2024-01-15T10:30:00Z',
    answers: [
      {
        id: 1,
        content:
          "<p>You can use libraries like <strong>Auth0</strong> or implement your own JWT-based authentication. Here's a basic approach:</p><ol><li>Create a login form</li><li>Send credentials to your backend</li><li>Store the JWT token</li><li>Use protected routes</li></ol>",
        author: 'jane_smith',
        createdAt: '2024-01-15T11:00:00Z',
        votes: 5,
        isAccepted: true
      },
      {
        id: 2,
        content:
          "<p>I recommend using <em>React Context</em> for state management and <strong>localStorage</strong> for token persistence. Don't forget to handle token expiration!</p>",
        author: 'dev_expert',
        createdAt: '2024-01-15T12:15:00Z',
        votes: 3,
        isAccepted: false
      }
    ]
  },
  {
    id: 2,
    title: 'Best practices for CSS Grid layout',
    content:
      "<p>What are the modern best practices for using CSS Grid? I'm particularly interested in responsive design patterns.</p>",
    tags: ['css', 'grid', 'responsive'],
    author: 'css_lover',
    createdAt: '2024-01-14T14:20:00Z',
    answers: [
      {
        id: 3,
        content:
          "<p>CSS Grid is perfect for 2D layouts! Here are key tips:</p><ul><li>Use <code>grid-template-areas</code> for semantic layouts</li><li>Combine with Flexbox for optimal results</li><li>Use <code>minmax()</code> for responsive columns</li></ul>",
        author: 'grid_master',
        createdAt: '2024-01-14T15:00:00Z',
        votes: 8,
        isAccepted: false
      }
    ]
  },
  {
    id: 3,
    title: 'How to optimize React performance?',
    content:
      "<p>My React app is getting slow with large datasets. What are the best optimization techniques?</p>",
    tags: ['react', 'performance', 'optimization'],
    author: 'perf_seeker',
    createdAt: '2024-01-13T09:45:00Z',
    answers: []
  }
]

const initialNotifications = [
  {
    id: 1,
    type: 'answer',
    message: 'Someone answered your question about React authentication',
    questionId: 1,
    isRead: false,
    createdAt: '2024-01-15T11:00:00Z'
  },
  {
    id: 2,
    type: 'comment',
    message: 'Someone commented on your answer',
    questionId: 2,
    isRead: false,
    createdAt: '2024-01-14T16:30:00Z'
  },
  {
    id: 3,
    type: 'mention',
    message: 'You were mentioned in a discussion',
    questionId: 1,
    isRead: true,
    createdAt: '2024-01-13T13:20:00Z'
  }
]

export const QAProvider = ({ children }) => {
  const [questions, setQuestions] = useState(initialQuestions)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [selectedTags, setSelectedTags] = useState([])

  const availableTags = [
    'react',
    'javascript',
    'css',
    'html',
    'node.js',
    'python',
    'authentication',
    'performance',
    'optimization',
    'grid',
    'responsive',
    'api',
    'database',
    'frontend',
    'backend'
  ]

  // Add a new question
  const addQuestion = (questionData) => {
    const newQuestion = {
      id: Date.now(),
      ...questionData,
      author: 'current_user',
      createdAt: new Date().toISOString(),
      answers: []
    }
    setQuestions((prev) => [newQuestion, ...prev])
    return newQuestion.id
  }

  // Add a new answer
  const addAnswer = (questionId, content) => {
    const newAnswer = {
      id: Date.now(),
      content,
      author: 'current_user',
      createdAt: new Date().toISOString(),
      votes: 0,
      isAccepted: false
    }

    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? { ...q, answers: [...q.answers, newAnswer] }
          : q
      )
    )
  }

  // Vote on an answer
  const voteAnswer = (questionId, answerId, voteType) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((a) =>
                a.id === answerId
                  ? {
                      ...a,
                      votes: a.votes + (voteType === 'up' ? 1 : -1)
                    }
                  : a
              )
            }
          : q
      )
    )
  }

  // Accept one answer per question
  const acceptAnswer = (questionId, answerId) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((a) => ({
                ...a,
                isAccepted: a.id === answerId
              }))
            }
          : q
      )
    )
  }

  // Mark a notification as read
  const markNotificationAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    )
  }

  // Tag filtering logic
  const filteredQuestions =
    selectedTags.length > 0
      ? questions.filter((q) =>
          q.tags.some((tag) => selectedTags.includes(tag))
        )
      : questions

  // Count unread notifications
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length

  return (
    <QAContext.Provider
      value={{
        questions: filteredQuestions,
        notifications,
        availableTags,
        selectedTags,
        unreadNotificationsCount,
        setSelectedTags,
        addQuestion,
        addAnswer,
        voteAnswer,
        acceptAnswer,
        markNotificationAsRead,
        getQuestionById: (id) =>
          questions.find((q) => q.id === parseInt(id))
      }}
    >
      {children}
    </QAContext.Provider>
  )
}

export default QAContext
