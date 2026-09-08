import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Search, UserX, UserCheck } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
    const [actionUser, setActionUser] = useState(null);
    const [confirming, setConfirming] = useState(false);

    const loadUsers = async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 20 });
            if (search) params.append('search', search);
            const res = await api.get(`/admin/users?${params}`);
            setUsers(res.data.data.users);
            setPagination(res.data.data.pagination);
        } catch { }
        setLoading(false);
    };

    useEffect(() => { loadUsers(); }, []);

    const handleStatusToggle = async () => {
        setConfirming(true);
        try {
            const res = await api.put(`/admin/users/${actionUser._id}/status`, {
                isActive: !actionUser.isActive,
            });
            setUsers(users.map((u) => (u._id === actionUser._id ? res.data.data.user : u)));
            toast.success(`User ${actionUser.isActive ? 'suspended' : 'activated'}`);
        } catch {
            toast.error('Failed to update user');
        } finally {
            setConfirming(false);
            setActionUser(null);
        }
    };

    return (
        <div className="p-6 md:p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-black text-gray-900">Users</h1>
                <p className="text-gray-500 text-sm mt-1">{pagination.total} registered users</p>
            </div>

            {/* Search */}
            <div className="relative mb-6 max-w-sm">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
                    className="input-field pl-10 text-sm"
                />
            </div>

            {loading ? <Loader /> : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    {['Name', 'Email', 'Phone', 'Joined', 'Status', 'Action'].map((h) => (
                                        <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {users.map((u) => (
                                    <tr key={u._id} className="hover:bg-gray-50/50">
                                        <td className="px-5 py-4 font-semibold text-gray-900">{u.name}</td>
                                        <td className="px-5 py-4 text-gray-600">{u.email}</td>
                                        <td className="px-5 py-4 text-gray-600">{u.phone || '—'}</td>
                                        <td className="px-5 py-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                                        <td className="px-5 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                                {u.isActive ? 'Active' : 'Suspended'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <button
                                                onClick={() => setActionUser(u)}
                                                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors ${u.isActive
                                                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                                                    }`}
                                            >
                                                {u.isActive ? <UserX size={12} /> : <UserCheck size={12} />}
                                                {u.isActive ? 'Suspend' : 'Activate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr><td colSpan={6} className="text-center py-12 text-gray-400">No users found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={!!actionUser}
                onClose={() => setActionUser(null)}
                onConfirm={handleStatusToggle}
                title={actionUser?.isActive ? 'Suspend User?' : 'Activate User?'}
                message={`${actionUser?.isActive ? 'Suspending' : 'Activating'} ${actionUser?.name}. This will ${actionUser?.isActive ? 'prevent' : 'allow'} them from logging in.`}
                confirmLabel={actionUser?.isActive ? 'Suspend' : 'Activate'}
                variant={actionUser?.isActive ? 'danger' : 'primary'}
                loading={confirming}
            />
        </div>
    );
}
