import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, MessageSquare } from 'lucide-react'
import { useQA } from '../context/QAContext'
import NotificationDropdown from './NotificationDropdown'
import LoginModal from './LoginModal'
import SignUpModal from './SignUpModal'
import { Button } from "../components/Button"
import { Users, HelpCircle, TrendingUp, UserCircle, Filter } from "lucide-react"
import { FaUserAlt } from "react-icons/fa";

const Navbar = () => {
  const { unreadNotificationsCount } = useQA()
  const [showNotifications, setShowNotifications] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const handleLoginClose = () => setIsLoginOpen(false)
  const navigate=useNavigate();
  const handleSignUpClose = () => setIsSignUpOpen(false)


  const handleLoginClick = () => setIsLoginOpen(true)
  const handleSignUpClick = () => setIsSignUpOpen(true)
  const handleLoginToSignUp = () => {
    handleLoginClose()
    handleSignUpClick()
  }
  const handleSignUpToLogin = () => {
    handleSignUpClose()
    handleLoginClick()
  }


  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Q&A Forum</span>
          </Link>

          <div className="flex items-center space-x-5  w-[25%]">
            <Link
              to="/ask"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ask Question
            </Link>

            <div>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Bell className="h-6 w-6" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <NotificationDropdown onClose={() => setShowNotifications(false)} />
              )}


              {/* Login Button */}
            </div>
            <div>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 rounded-[10px] cursor-pointer"
                onClick={() => setIsLoginOpen(true)}
              >
                <UserCircle className="w-5 h-5" />
                <span>Login</span>
              </Button>
            </div>
            <div ref={menuRef} className="relative inline-block">
      {/* Icon Button */}
      <FaUserAlt
        onClick={() => setIsOpen(!isOpen)}
        className="text-blue-500 text-2xl cursor-pointer"
      />

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-[12px] shadow-lg z-50">
          <ul className="py-2">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={()=>navigate('/Profile')}>View profile</li>
          </ul>
        </div>
      )}
    </div>
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSignUpClick={handleLoginToSignUp}
      />
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onLoginClick={handleSignUpToLogin}
      />
    </nav>
  )
}

export default Navbar
