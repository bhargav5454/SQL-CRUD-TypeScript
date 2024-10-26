import React, { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { logout } from '../ReduxToolkit/Slice/User.slice'
import { persistor } from '../ReduxToolkit/Store/Store'
import toast from 'react-hot-toast'
import './components.css'

const SessionExpiredPopup = () => {
    const [isVisible, setIsVisible] = useState(true)
    const dispatch = useDispatch()

    const handleRelogin = () => {
        dispatch(logout())
        persistor.purge()
        setIsVisible(false)
        window.location.reload()
    }

    if (!isVisible) return null

    return (
        <div className="session-ex fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-transparent">
            <div className="bg-[#60574c]  rounded-lg shadow-xl max-w-md w-full backdrop-blur-md ">
                <div className="p-6">
                    <div className="flex items-center mb-4">
                        <AlertCircle className="text-red-500 w-6 h-6 mr-2" />
                        <h2 className="text-xl font-bold text-white">Session Expired</h2>
                    </div>
                    <p className="text-gray-200 mb-4">
                        Your login session has expired. Please log in again to continue.
                    </p>
                    <div className="flex justify-end">
                        <button
                            onClick={handleRelogin}
                            className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50 transition-colors"
                        >
                            Re-login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SessionExpiredPopup