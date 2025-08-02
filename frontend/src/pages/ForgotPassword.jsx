import { useState } from "react"
import { BiArrowBack } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"

// Placeholder for your actual forgot password action
// import { forgotPassword } from "../redux/actions/authActions"

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth)

  const handleOnSubmit = (e) => {
    e.preventDefault()
    // Replace with actual dispatch logic
    // dispatch(forgotPassword(email)).then(() => setEmailSent(true))
    setEmailSent(true)
  }

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-gray-100 px-4">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="w-full max-w-[500px] p-6 lg:p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl font-semibold text-blue-400">
            {emailSent ? "Check your email" : "Reset your password"}
          </h1>
          <p className="my-4 text-lg text-richblack-100">
            {!emailSent
              ? "Have no fear. We'll email you instructions to reset your password. If you don’t have access to your email we can try account recovery."
              : `We have sent the reset instructions to ${email}`}
          </p>
          <form onSubmit={handleOnSubmit}>
            {!emailSent && (
              <div className="mb-4">
                <label className="block text-sm mb-1">
                  Email Address <sup className="text-pink-500">*</sup>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                  className="w-full px-4 py-3 rounded-md border-2  placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-500 text-gray-950 hover:text-white py-3 rounded-md font-medium hover:bg-blue-400 transition-colors"
            >
              {emailSent ? "Resend Email" : "Submit"}
            </button>
          </form>
          <div className="mt-6">
            <Link to="/login" className="flex items-center text-richblack-5 hover:text-blue-500 transition-colors">
              <BiArrowBack className="mr-2" /> Back to Login
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default ForgotPassword
