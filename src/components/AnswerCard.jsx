import React from 'react'
import { ChevronUp, ChevronDown, Check, User, Clock } from 'lucide-react'
import { useQA } from '../context/QAContext'
import RichTextEditor from './RichTextEditor'

const AnswerCard = ({ answer, questionId, isQuestionOwner = false }) => {
  const { voteAnswer, acceptAnswer } = useQA()

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const handleVote = (voteType) => {
    voteAnswer(questionId, answer.id, voteType)
  }

  const handleAccept = () => {
    acceptAnswer(questionId, answer.id)
  }

  return (
    <div className={`bg-white rounded-lg border p-6 ${answer.isAccepted ? 'border-green-200 bg-green-50' : ''}`}>
      <div className="flex space-x-4">
        {/* Voting and Acceptance Panel */}
        <div className="flex flex-col items-center space-y-2">
          {/* Upvote */}
          <button
            onClick={() => handleVote('up')}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            title="Upvote"
          >
            <ChevronUp className="h-6 w-6 text-gray-600" />
          </button>

          {/* Vote Count */}
          <span className={`text-lg font-semibold ${answer.votes > 0 ? 'text-green-600' : answer.votes < 0 ? 'text-red-600' : 'text-gray-600'}`}>
            {answer.votes}
          </span>

          {/* Downvote */}
          <button
            onClick={() => handleVote('down')}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            title="Downvote"
          >
            <ChevronDown className="h-6 w-6 text-gray-600" />
          </button>

          {/* Accept Answer Button (only for question owner) */}
          {isQuestionOwner && !answer.isAccepted && (
            <button
              onClick={handleAccept}
              className="p-1 rounded hover:bg-green-100 transition-colors mt-2"
              title="Accept this answer"
            >
              <Check className="h-6 w-6 text-gray-400 hover:text-green-600" />
            </button>
          )}

          {/* Accepted Mark */}
          {answer.isAccepted && (
            <div className="p-1 mt-2" title="Accepted answer">
              <Check className="h-6 w-6 text-green-600" />
            </div>
          )}
        </div>

        {/* Answer Content */}
        <div className="flex-1">
          {/* Accepted Badge */}
          {answer.isAccepted && (
            <div className="mb-3">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                ✓ Accepted Answer
              </span>
            </div>
          )}

          {/* Answer Text */}
          <RichTextEditor data={answer.content} className="w-full" />

          {/* Metadata */}
          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-4">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{answer.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{formatTime(answer.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnswerCard
