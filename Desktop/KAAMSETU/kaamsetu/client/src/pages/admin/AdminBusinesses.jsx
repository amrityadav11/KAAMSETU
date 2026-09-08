import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Search, ExternalLink, Ban, CheckCircle, Trash2 } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function AdminBusinesses() {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
    const [actionBiz, setActionBiz] = useState(null);
    const [actionType, setActionType] = useState(null); // 'toggle' | 'delete'
    const [confirming, setConfirming] = useState(false);

    const loadBusinesses = async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 20 });
            if (search) params.append('search', search);
            const res = await api.get(`/admin/businesses?${params}`);
            setBusinesses(res.data.data.businesses);
            setPagination(res.data.data.pagination);
        } catch { }
        setLoading(false);
    };

    useEffect(() => { loadBusinesses(); }, []);

    const handleConfirm = async () => {
        setConfirming(true);
        try {
            if (actionType === 'toggle') {
                const res = await api.put(`/admin/businesses/${actionBiz._id}/status`, {
                    isActive: !actionBiz.isActive,
                });
                setBusinesses(businesses.map((b) => b._id === actionBiz._id ? res.data.data.business : b));
                toast.success(`Business ${actionBiz.isActive ? 'suspended' : 'activated'}`);
            } else if (actionType === 'delete') {
                await api.delete(`/admin/businesses/${actionBiz._id}`);
                setBusinesses(businesses.filter((b) => b._id !== actionBiz._id));
                toast.success('Business deleted');
            }
        } catch {
            toast.error('Action failed');
        } finally {
            setConfirming(false);
            setActionBiz(null);
            setActionType(null);
        }
    };

    return (
        <div className="p-6 md:p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-black text-gray-900">Businesses</h1>
                <p className="text-gray-500 text-sm mt-1">{pagination.total} total businesses</p>
            </div>

            <div className="flex gap-3 mb-6">
                <div className="relative flex-1 max-w-sm">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        placeholder="Search businesses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && loadBusinesses()}
                        className="input-field pl-10 text-sm"
                    />
                </div>
            </div>

            {loading ? <Loader /> : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    {['Business', 'Owner', 'Category', 'Plan', 'Status', 'Actions'].map((h) => (
                                        <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {businesses.map((b) => (
                                    <tr key={b._id} className="hover:bg-gray-50/50">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-700 font-bold text-sm flex-shrink-0">
                                                    {b.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{b.name}</p>
                                                    <p className="text-xs text-gray-400">{b.city}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">{b.owner?.name || '—'}</td>
                                        <td className="px-5 py-4 text-gray-600">{b.category}</td>
                                        <td className="px-5 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${b.subscription?.plan === 'FREE' ? 'bg-gray-100 text-gray-600' : b.subscription?.plan === 'PRO' ? 'bg-purple-100 text-purple-700' : 'bg-primary-100 text-primary-700'}`}>
                                                {b.subscription?.plan || 'FREE'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${b.isPublished && b.isActive ? 'bg-green-100 text-green-700' : !b.isActive ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {!b.isActive ? 'Suspended' : b.isPublished ? 'Live' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                {b.isPublished && (
                                                    <a href={`/business/${b.slug}`} target="_blank" rel="noreferrer"
                                                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-primary-600">
                                                        <ExternalLink size={13} />
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => { setActionBiz(b); setActionType('toggle'); }}
                                                    className={`p-1.5 rounded-lg ${b.isActive ? 'hover:bg-red-50 text-gray-400 hover:text-red-500' : 'hover:bg-green-50 text-gray-400 hover:text-green-600'}`}
                                                >
                                                    {b.isActive ? <Ban size={13} /> : <CheckCircle size={13} />}
                                                </button>
                                                <button
                                                    onClick={() => { setActionBiz(b); setActionType('delete'); }}
                                                    className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {businesses.length === 0 && (
                                    <tr><td colSpan={6} className="text-center py-12 text-gray-400">No businesses found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={!!actionBiz}
                onClose={() => { setActionBiz(null); setActionType(null); }}
                onConfirm={handleConfirm}
                title={actionType === 'delete' ? 'Delete Business?' : actionBiz?.isActive ? 'Suspend Business?' : 'Activate Business?'}
                message={actionType === 'delete' ? `Permanently delete "${actionBiz?.name}"? This cannot be undone.` : `This will ${actionBiz?.isActive ? 'hide' : 'restore'} "${actionBiz?.name}" from the platform.`}
                confirmLabel={actionType === 'delete' ? 'Delete' : actionBiz?.isActive ? 'Suspend' : 'Activate'}
                variant={actionType === 'delete' || actionBiz?.isActive ? 'danger' : 'primary'}
                loading={confirming}
            />
        </div>
    );
}
