import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, CreditCard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
    { path: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/businesses', label: 'Businesses', icon: Building2 },
    { path: '/admin/payments', label: 'Payments', icon: CreditCard },
];

export default function AdminLayout() {
    const { logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        toast.success('Logged out');
        navigate('/');
    };

    const isActive = (path, exact) =>
        exact ? location.pathname === path : location.pathname.startsWith(path);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
                <div className="p-6 border-b border-gray-100">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-black text-sm">K</span>
                        </div>
                        <div>
                            <div className="text-lg font-black text-gray-900">
                                Kaam<span className="text-primary-600">Setu</span>
                            </div>
                            <div className="text-xs text-gray-400 font-medium -mt-0.5">Admin Panel</div>
                        </div>
                    </Link>
                </div>
                <nav className="flex-1 p-4">
                    <ul className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path, item.exact);
                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Icon size={17} />
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full"
                    >
                        <LogOut size={17} />
                        Logout
                    </button>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}
