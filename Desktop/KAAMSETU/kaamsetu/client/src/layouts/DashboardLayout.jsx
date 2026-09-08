import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Building2, Wrench, Package, Image, Users,
    QrCode, BarChart3, CreditCard, Settings, LogOut, Menu, X, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { path: '/dashboard/business', label: 'My Business', icon: Building2 },
    { path: '/dashboard/services', label: 'Services', icon: Wrench },
    { path: '/dashboard/products', label: 'Products', icon: Package },
    { path: '/dashboard/gallery', label: 'Gallery', icon: Image },
    { path: '/dashboard/leads', label: 'Leads', icon: Users },
    { path: '/dashboard/qr', label: 'QR Code', icon: QrCode },
    { path: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/dashboard/subscription', label: 'Subscription', icon: CreditCard },
    { path: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        toast.success('Logged out');
        navigate('/');
    };

    const isActive = (path, exact) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-gray-100">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-black text-sm">K</span>
                    </div>
                    <span className="text-xl font-black text-gray-900">
                        Kaam<span className="text-primary-600">Setu</span>
                    </span>
                </Link>
            </div>

            {/* User */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-xl">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path, item.exact);
                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${active
                                        ? 'bg-primary-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon size={17} />
                                    <span>{item.label}</span>
                                    {active && <ChevronRight size={14} className="ml-auto" />}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-colors"
                >
                    <LogOut size={17} />
                    Logout
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 flex-shrink-0">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
                    <aside className="relative w-64 bg-white flex flex-col shadow-2xl">
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile top bar */}
                <header className="lg:hidden flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-xl hover:bg-gray-100"
                    >
                        <Menu size={20} />
                    </button>
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-black text-xs">K</span>
                        </div>
                        <span className="text-lg font-black">Kaam<span className="text-primary-600">Setu</span></span>
                    </Link>
                    <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-700 font-bold text-sm">{user?.name?.charAt(0)}</span>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
