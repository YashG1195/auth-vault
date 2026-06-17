// src/pages/ResetPassword.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ResetPassword() {
  const { resetPw } = useAuth()
  const [email, setEmail]   = useState('')
  const [message, setMessage] = useState('')
  const [error, setError]   = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      await resetPw(email)
      setMessage('Check your inbox for the reset link.')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h1>Reset Password</h1>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error   && <p style={{ color: 'red'   }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)} required />
        <button type="submit">Send reset link</button>
      </form>
      <p><Link to="/login">Back to sign in</Link></p>
    </div>
  )
}
