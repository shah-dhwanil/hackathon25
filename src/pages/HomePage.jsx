// import React from 'react'
// import { useQA } from '../context/QAContext'
// import QuestionCard from '../components/QuestionCard'
// import { Filter } from 'lucide-react'

// const HomePage = () => {
//   const { questions, availableTags, selectedTags, setSelectedTags } = useQA()

//   const handleTagFilter = (tag) => {
//     if (selectedTags.includes(tag)) {
//       setSelectedTags(selectedTags.filter(t => t !== tag))
//     } else {
//       setSelectedTags([...selectedTags, tag])
//     }
//   }

//   const clearFilters = () => {
//     setSelectedTags([])
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-4">Questions</h1>
        
//         <div className="bg-white rounded-lg shadow-sm border p-4">
//           <div className="flex items-center space-x-2 mb-3">
//             <Filter className="h-5 w-5 text-gray-600" />
//             <span className="font-medium text-gray-700">Filter by tags:</span>
//             {selectedTags.length > 0 && (
//               <button
//                 onClick={clearFilters}
//                 className="text-blue-600 hover:text-blue-800 text-sm"
//               >
//                 Clear all
//               </button>
//             )}
//           </div>
          
//           <div className="flex flex-wrap gap-2">
//             {availableTags.map(tag => (
//               <button
//                 key={tag}
//                 onClick={() => handleTagFilter(tag)}
//                 className={`px-3 py-1 rounded-full text-sm transition-colors ${
//                   selectedTags.includes(tag)
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 {tag}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="space-y-4">
//         {questions.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-gray-500 text-lg">No questions found.</p>
//             {selectedTags.length > 0 && (
//               <button
//                 onClick={clearFilters}
//                 className="mt-2 text-blue-600 hover:text-blue-800"
//               >
//                 Clear filters to see all questions
//               </button>
//             )}
//           </div>
//         ) : (
//           questions.map(question => (
//             <QuestionCard key={question.id} question={question} />
//           ))
//         )}
//       </div>
//     </div>
//   )
// }

// export default HomePage

import React,{useState} from "react"
import { Link } from "react-router-dom"
import { MessageSquare, Users, HelpCircle, TrendingUp, UserCircle, Filter } from "lucide-react"
import { Button } from "../components/Button"
import { Card, CardContent } from "../components/Card"
import { useQA } from '../context/QAContext'
import QuestionCard from '../components/QuestionCard'
import LoginModal from '../components/LoginModal'
import SignUpModal from '../components/SignUpModal'

const HomePage = () => {
  const { questions, availableTags, selectedTags, setSelectedTags } = useQA()




  const stats = [
    {
      icon: MessageSquare,
      value: "10,000+",
      label: "Questions Answered"
    },
    {
      icon: Users,
      value: "5,000+",
      label: "Active Users"
    },
    {
      icon: HelpCircle,
      value: "95%",
      label: "Success Rate"
    },
    {
      icon: TrendingUp,
      value: "24/7",
      label: "Community Support"
    }
  ]

  const handleTagFilter = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const clearFilters = () => {
    setSelectedTags([])
  }

  return (
    <>
      
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-gray-50 via-gray-100/20 to-blue-50/5 py-12 lg:py-20">
        

        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Content */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                  Your Questions, <span className="text-blue-600">Our Expertise</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                  Join thousands of developers, designers, and tech enthusiasts who 
                  find answers, share knowledge, and grow together in our vibrant 
                  Q&A community.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/ask">
                  <Button size="lg" className="text-lg px-8 py-4 h-auto bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                    Ask Your First Question
                  </Button>
                </Link>
                <Link to="/home">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                    Explore Questions
                  </Button>
                </Link>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
                {stats.map((stat, index) => (
                  <Card key={index} className="border-0 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300 hover:shadow-md">
                    <CardContent className="p-4 text-center">
                      <stat.icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="font-bold text-lg text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Hero Image Area */}
            <div className="relative order-first lg:order-last">
              {/* ... existing hero image code ... */}
            </div>
          </div>
        </div>
      </section>

    </>
  )
}

export default HomePage