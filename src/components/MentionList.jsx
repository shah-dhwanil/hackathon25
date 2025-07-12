import React, { forwardRef } from 'react'

const MentionList = forwardRef((props, ref) => {
  const users = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Alice Johnson' },
    // Add more users as needed
    { id: '4', name: 'Bob Brown' },
    { id: '5', name: 'Charlie White' },
    // Add more users as needed
  ]

  return (
    <div 
      ref={ref} 
      className="mention-list bg-white shadow-lg rounded-lg border border-gray-200 max-h-[200px] overflow-y-auto w-[200px]"
    >
      {users.map((user) => (
        <button
          key={user.id}
          onClick={() => props.command({ id: user.id, label: user.name })}
          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
        >
          <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-800">
            {user.name[0]}
          </span>
          <span>{user.name}</span>
        </button>
      ))}
    </div>
  )
})

MentionList.displayName = 'MentionList'
export default MentionList