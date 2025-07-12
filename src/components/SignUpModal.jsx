import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './DialogContent'
import { Button } from './Button'
import { Input } from './Input'
import { Label } from './Label'
import { Eye, EyeOff, UserPlus, Lock, Mail, User, X } from 'lucide-react'
import { backendurl } from '../App'
import { useNavigate } from 'react-router-dom'

// Cookie utility functions
const setCookie = (name, value, expiryDate) => {
  const expires = new Date(expiryDate).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/; secure; samesite=strict`
}

const getCookie = (name) => {
  const nameEQ = name + "="
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

// Session management functions
const saveSession = (loginResponse) => {
  const { token, user, expires_at } = loginResponse

  // Store in cookies with expiry
  setCookie('auth_token', token, expires_at)
  setCookie('user_id', user.user_id, expires_at)
  setCookie('session_expires', expires_at, expires_at)

  // Store in sessionStorage for immediate access
  sessionStorage.setItem('auth_token', token)
  sessionStorage.setItem('user_id', user.user_id)
  sessionStorage.setItem('session_expires', expires_at)
}

const clearSession = () => {
  deleteCookie('auth_token')
  deleteCookie('user_id')
  deleteCookie('session_expires')

  sessionStorage.removeItem('auth_token')
  sessionStorage.removeItem('user_id')
  sessionStorage.removeItem('session_expires')
}

const isSessionValid = () => {
  const expiryDate = getCookie('session_expires') || sessionStorage.getItem('session_expires')
  if (!expiryDate) return false

  const now = new Date()
  const expiry = new Date(expiryDate)
  return now < expiry
}

// API functions
const apiRequest = async (endpoint, options = {}) => {
  const API_BASE_URL = backendurl
  const url = `${API_BASE_URL}${endpoint}`
  const token = getCookie('auth_token') || sessionStorage.getItem('auth_token')

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.description || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

const createUser = async (userData) => {
  return apiRequest('/user/', {
    method: 'POST',
    body: JSON.stringify({
      email_id: userData.email,
      username: userData.username,
      password: userData.password
    })
  })
}

const loginUser = async (credentials) => {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email_id: credentials.email,
      password: credentials.password
    })
  })
}

// SignUp Modal Component
const SignUpModal = ({ isOpen, onClose, onLoginClick, onSignupSuccess }) => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const validateForm = () => {
    if (!username.trim()) {
      setError('Username is required')
      return false
    }
    if (username.length > 32) {
      setError('Username must be 32 characters or less')
      return false
    }
    if (!email.trim()) {
      setError('Email is required')
      return false
    }
    if (email.length > 64) {
      setError('Email must be 64 characters or less')
      return false
    }
    if (!password.trim()) {
      setError('Password is required')
      return false
    }
    if (password.length < 8 || password.length > 32) {
      setError('Password must be between 8 and 32 characters')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      // Step 1: Create user
      const createUserResponse = await createUser({ username, email, password })

      // Step 2: Log in user
      const loginResponse = await loginUser({ email, password })

      // Step 3: Save session
      saveSession(loginResponse)

      // Step 4: Immediately close the modal
      onClose()

      // Step 5: Call parent callback
      if (onSignupSuccess) {
        onSignupSuccess(loginResponse)
      }

      // Step 6: Reset form & navigate
      setUsername('')
      setEmail('')
      setPassword('')
      setError('')
      setSuccess('')
      navigate('/home')

    } catch (err) {
      console.error('Signup/Login error:', err)
      if (err.message.includes('user_already_exists')) {
        setError('An account with this email or username already exists.')
      } else if (err.message.includes('password_incorrect')) {
        setError('There was an issue with your password. Please try again.')
      } else if (err.message.includes('user_not_found')) {
        setError('Account creation failed. Please try again.')
      } else {
        setError(err.message || 'Signup failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginClick = (e) => {
    e.preventDefault()
    onClose()
    onLoginClick()
  }

  const handleClose = () => {
    if (!isLoading) {
      setUsername('')
      setEmail('')
      setPassword('')
      setError('')
      setSuccess('')
      onClose()
    }
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <button
          type="button"
          aria-label="Close"
          onClick={handleClose}
          disabled={isLoading}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        <DialogHeader>
          <DialogTitle className="text-center text-xl flex items-center justify-center gap-2">
            <UserPlus className="h-6 w-6 text-blue-600" />
            <span>Create Account</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              maxLength={32}
              disabled={isLoading}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={64}
              disabled={isLoading}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password (8–32 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                maxLength={32}
                disabled={isLoading}
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-blue-600 transition-colors disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md border border-green-200">
              {success}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>

          <p className="text-sm text-gray-600 text-center">
            Already have an account?{' '}
            <button
              type="button"
              onClick={handleLoginClick}
              disabled={isLoading}
              className="text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
            >
              Log in
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Export utility functions
export {
  setCookie,
  getCookie,
  deleteCookie,
  saveSession,
  clearSession,
  isSessionValid,
  apiRequest,
  createUser,
  loginUser
}

export default SignUpModal
