import React, { useEffect, useState } from 'react';
import { CreditCard } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

export default function AdminPayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

    const loadPayments = async (page = 1) => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/payments?page=${page}&limit=20`);
            setPayments(res.data.data.payments);
            setPagination(res.data.data.pagination);
        } catch { }
        setLoading(false);
    };

    useEffect(() => { loadPayments(); }, []);

    // Compute totals
    const totalRevenue = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0);

    return (
        <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Payments</h1>
                    <p className="text-gray-500 text-sm mt-1">{pagination.total} total payments</p>
                </div>
                <div className="card bg-primary-600 text-white py-3 px-5">
                    <p className="text-xs text-primary-200 mb-0.5">Showing Revenue</p>
                    <p className="text-xl font-black">₹{totalRevenue.toLocaleString()}</p>
                </div>
            </div>

            {loading ? <Loader /> : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    {['Date', 'User', 'Business', 'Plan', 'Amount', 'Status', 'Order ID'].map((h) => (
                                        <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {payments.map((p) => (
                                    <tr key={p._id} className="hover:bg-gray-50/50">
                                        <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                                            {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-5 py-4 font-medium text-gray-900">{p.user?.name || '—'}</td>
                                        <td className="px-5 py-4 text-gray-600">{p.business?.name || '—'}</td>
                                        <td className="px-5 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.plan === 'PRO' ? 'bg-purple-100 text-purple-700' : 'bg-primary-100 text-primary-700'}`}>
                                                {p.plan}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 font-bold text-gray-900">₹{p.amount}</td>
                                        <td className="px-5 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.status === 'paid' ? 'bg-green-100 text-green-700'
                                                    : p.status === 'failed' ? 'bg-red-100 text-red-600'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-gray-400 text-xs font-mono">{p.razorpayOrderId?.slice(-12)}...</td>
                                    </tr>
                                ))}
                                {payments.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-center py-16 text-gray-400">
                                            <CreditCard size={28} className="mx-auto mb-2 opacity-30" />
                                            No payments yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                        <button key={p} onClick={() => loadPayments(p)}
                            className={`w-9 h-9 rounded-xl text-sm font-semibold ${p === pagination.page ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
                            {p}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
