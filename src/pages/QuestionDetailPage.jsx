import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQA } from '../context/QAContext'
import AnswerCard from '../components/AnswerCard'
import RichTextEditor from '../components/RichTextEditor'
import { ArrowLeft, User, Clock, MessageSquare } from 'lucide-react'
import { useUser } from '../context/UserContext'

const QuestionDetailPage = () => {
  const { id } = useParams()
  const { getQuestionById, addAnswer } = useQA()
  const [answerContent, setAnswerContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const question = getQuestionById(id)

 const { user } = useUser()
const isQuestionOwner = question.author === user.username

  if (!question) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Question not found</h1>
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          ← Back to questions
        </Link>
      </div>
    )
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const handleSubmitAnswer = async (e) => {
    e.preventDefault()
    if (!answerContent.trim()) return

    setIsSubmitting(true)

    try {
      addAnswer(question.id, answerContent)
      setAnswerContent('')
    } catch (err) {
      console.error('Error submitting answer:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 🟩 Separate accepted and other answers
  const acceptedAnswer = question.answers.find(a => a.isAccepted)
  const otherAnswers = question.answers.filter(a => !a.isAccepted)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back */}
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to questions
        </Link>
      </div>

      {/* Question Box */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{question.title}</h1>

        <div className="flex flex-wrap gap-2 mb-4">
          {question.tags.map(tag => (
            <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>

        <div
          className="prose max-w-none mb-6"
          dangerouslySetInnerHTML={{ __html: question.content }}
        />

        <div className="flex items-center space-x-4 text-sm text-gray-500 border-t pt-4">
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>{question.author}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{formatTime(question.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageSquare className="h-4 w-4" />
            <span>{question.answers.length} answers</span>
          </div>
        </div>
      </div>

      {/* Answers */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {question.answers.length} {question.answers.length === 1 ? 'Answer' : 'Answers'}
        </h2>

        <div className="space-y-4">
          {/* ✅ Accepted answer always comes first */}
          {acceptedAnswer && (
            <AnswerCard
              key={acceptedAnswer.id}
              answer={acceptedAnswer}
              questionId={question.id}
              isQuestionOwner={isQuestionOwner}
            />
          )}
          {otherAnswers.map(answer => (
            <AnswerCard
              key={answer.id}
              answer={answer}
              questionId={question.id}
              isQuestionOwner={isQuestionOwner}
            />
          ))}
        </div>
      </div>

      {/* Submit Answer */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Answer</h3>
        <form onSubmit={handleSubmitAnswer}>
          <div className="mb-4">
            <RichTextEditor
              isReadOnly={false}
              data={answerContent}
              onChange={setAnswerContent}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className={`px-6 py-2 rounded-lg transition-colors ${
                answerContent.trim() && !isSubmitting
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!answerContent.trim() || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Answer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuestionDetailPage
