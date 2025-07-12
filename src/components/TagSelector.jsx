import React, { useState } from 'react'
import { X, ChevronDown } from 'lucide-react'

const TagSelector = ({ availableTags, selectedTags, onChange, placeholder = "Select tags..." }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTags = availableTags.filter(tag => 
    tag.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedTags.includes(tag)
  )

  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag)) {
      onChange([...selectedTags, tag])
    }
    setSearchTerm('')
  }

  const handleTagRemove = (tagToRemove) => {
    onChange(selectedTags.filter(tag => tag !== tagToRemove))
  }

  return (
    <div className="relative">
      <div className="border border-gray-300 rounded-lg p-3 min-h-[42px] cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex flex-wrap gap-2 items-center">
          {selectedTags.map(tag => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {tag}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleTagRemove(tag)
                }}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {selectedTags.length === 0 && (
            <span className="text-gray-500">{placeholder}</span>
          )}
          <ChevronDown className="h-4 w-4 text-gray-400 ml-auto" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredTags.length === 0 ? (
              <div className="p-3 text-gray-500 text-center">No tags found</div>
            ) : (
              filteredTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagSelect(tag)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors"
                >
                  {tag}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default TagSelector
