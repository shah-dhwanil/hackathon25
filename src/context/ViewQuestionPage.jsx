import React, { useState } from 'react'
import { useQA } from './QAContext'
import QuestionCard from '../components/QuestionCard'

const ViewQuestionPage = () => {
  const { questions } = useQA()
  const [searchQuery, setSearchQuery] = useState('')
  const user = "Rutang"

  const filteredQuestions = questions.filter(question =>
    question.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!user) {
    return (
      <div className="text-center p-4">Please login to view the question.</div>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Questions</h2>

        {/* 🔍 Search Bar */}
        <input
          type="text"
          placeholder="Search questions by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No questions found.</p>
            </div>
          ) : (
            filteredQuestions.map(question => (
              <QuestionCard key={question.id} question={question} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default ViewQuestionPage
