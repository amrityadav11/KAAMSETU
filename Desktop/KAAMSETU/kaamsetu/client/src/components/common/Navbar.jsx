import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-black text-sm">K</span>
                        </div>
                        <span className="text-xl font-black text-gray-900">
                            Kaam<span className="text-primary-600">Setu</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/businesses" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
                            Businesses
                        </Link>
                        <Link to="/#features" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
                            Features
                        </Link>
                        <Link to="/#pricing" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
                            Pricing
                        </Link>
                    </div>

                    {/* CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-3">
                                <Link to="/dashboard">
                                    <Button variant="secondary" size="sm">Dashboard</Button>
                                </Link>
                                <div className="relative group">
                                    <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary-600">
                                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                            <span className="text-primary-700 font-bold text-xs">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <ChevronDown size={14} />
                                    </button>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <Link to="/dashboard" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-t-xl">
                                            Dashboard
                                        </Link>
                                        {user?.role === 'admin' && (
                                            <Link to="/admin" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                                                Admin Panel
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-b-xl"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
                                <Link to="/register"><Button size="sm">Get Started Free</Button></Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        className="md:hidden p-2 rounded-xl hover:bg-gray-100"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="md:hidden border-t border-gray-100 py-4 flex flex-col gap-2">
                        <Link to="/businesses" className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl" onClick={() => setMenuOpen(false)}>
                            Businesses
                        </Link>
                        <Link to="/#features" className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl" onClick={() => setMenuOpen(false)}>
                            Features
                        </Link>
                        <Link to="/#pricing" className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl" onClick={() => setMenuOpen(false)}>
                            Pricing
                        </Link>
                        <div className="border-t border-gray-100 pt-3 mt-1 flex gap-2 px-4">
                            {isAuthenticated ? (
                                <>
                                    <Link to="/dashboard" className="flex-1" onClick={() => setMenuOpen(false)}>
                                        <Button className="w-full" size="sm">Dashboard</Button>
                                    </Link>
                                    <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="flex-1" onClick={() => setMenuOpen(false)}>
                                        <Button variant="secondary" className="w-full" size="sm">Login</Button>
                                    </Link>
                                    <Link to="/register" className="flex-1" onClick={() => setMenuOpen(false)}>
                                        <Button className="w-full" size="sm">Register</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
