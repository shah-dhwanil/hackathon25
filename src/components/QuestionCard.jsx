import React from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, Clock, User } from 'lucide-react'

const QuestionCard = ({ question }) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const getPreview = (htmlContent) => {
    const div = document.createElement('div')
    div.innerHTML = htmlContent
    const text = div.textContent || div.innerText || ''
    return text.length > 150 ? text.substring(0, 150) + '...' : text
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <Link to={`/question/${question.id}`} className="block">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
          {question.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {getPreview(question.content)}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {question.tags.map(tag => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{question.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{formatTime(question.createdAt)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <MessageSquare className="h-4 w-4" />
            <span>{question.answers.length} answers</span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default QuestionCard
