import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { logout } from '../ReduxToolkit/Slice/User.slice'
import { persistor } from '../ReduxToolkit/Store/Store'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false)

    const dispatch = useDispatch()
    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    const handleLogout = () => {
        dispatch(logout())
        persistor.purge()
        window.location.reload()
    }

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <span className="text-gray-800 text-xl font-bold">Logo</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex flex-grow justify-center">
                        <div className="flex items-baseline space-x-4">
                            <Link to={'/user'} className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                            <Link to={'/user/productform'} className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Product Form</Link>
                            <Link to={'/user/product'} className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Product</Link>
                            <Link className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Services</Link>
                            <Link className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Contact</Link>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <div className="hidden md:block">
                        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to={'/user'} className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">Home</Link>
                        <Link to={'/user/productform'} className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">Product Form</Link>
                        <Link to={'/user/product'} className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">Product</Link>
                        <Link className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">Contact</Link>
                        <button className="mt-1 w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-base font-medium">
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar