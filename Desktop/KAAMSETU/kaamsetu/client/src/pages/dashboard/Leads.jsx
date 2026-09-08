import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Users, Phone, Mail, MessageSquare, ChevronDown } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

const STATUS_OPTIONS = ['new', 'contacted', 'converted', 'closed'];

const STATUS_COLORS = {
    new: 'bg-green-100 text-green-700',
    contacted: 'bg-blue-100 text-blue-700',
    converted: 'bg-purple-100 text-purple-700',
    closed: 'bg-gray-100 text-gray-600',
};

export default function Leads() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
    const [updatingId, setUpdatingId] = useState(null);

    const loadLeads = async (page = 1) => {
        try {
            const params = new URLSearchParams({ page, limit: 20 });
            if (filter) params.append('status', filter);
            const res = await api.get(`/leads?${params}`);
            setLeads(res.data.data.leads);
            setPagination(res.data.data.pagination);
        } catch { }
        setLoading(false);
    };

    useEffect(() => { loadLeads(); }, [filter]);

    const updateStatus = async (id, status) => {
        setUpdatingId(id);
        try {
            const res = await api.put(`/leads/${id}`, { status });
            setLeads(leads.map((l) => (l._id === id ? res.data.data.lead : l)));
            toast.success('Status updated');
        } catch {
            toast.error('Failed to update');
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) return <Loader />;

    const counts = STATUS_OPTIONS.reduce((acc, s) => {
        acc[s] = leads.filter((l) => l.status === s).length;
        return acc;
    }, {});

    return (
        <div className="p-6 md:p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-black text-gray-900">Leads & Enquiries</h1>
                <p className="text-gray-500 text-sm mt-1">{pagination.total} total enquiries</p>
            </div>

            {/* Status filter tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                {[{ label: 'All', value: '' }, ...STATUS_OPTIONS.map((s) => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }))].map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setFilter(tab.value)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${filter === tab.value
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {leads.length === 0 ? (
                <EmptyState
                    icon={Users}
                    title="No enquiries yet"
                    description="When customers submit an enquiry through your business page, they'll appear here."
                />
            ) : (
                <div className="space-y-3">
                    {leads.map((lead) => (
                        <div key={lead._id} className="card hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <span className="text-primary-700 font-bold text-sm">
                                                {lead.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{lead.name}</p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric', month: 'short', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 ml-12">
                                        <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 hover:text-primary-600">
                                            <Phone size={13} /> {lead.phone}
                                        </a>
                                        {lead.email && (
                                            <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 hover:text-primary-600">
                                                <Mail size={13} /> {lead.email}
                                            </a>
                                        )}
                                    </div>
                                    {lead.message && (
                                        <div className="mt-3 ml-12 p-3 bg-gray-50 rounded-xl text-sm text-gray-600 flex items-start gap-2">
                                            <MessageSquare size={13} className="mt-0.5 flex-shrink-0 text-gray-400" />
                                            {lead.message}
                                        </div>
                                    )}
                                </div>

                                {/* Status selector */}
                                <div className="relative flex-shrink-0">
                                    <select
                                        value={lead.status}
                                        onChange={(e) => updateStatus(lead._id, e.target.value)}
                                        disabled={updatingId === lead._id}
                                        className={`appearance-none pr-8 pl-3 py-2 rounded-xl text-sm font-semibold cursor-pointer border-0 focus:ring-2 focus:ring-primary-400 ${STATUS_COLORS[lead.status]}`}
                                    >
                                        {STATUS_OPTIONS.map((s) => (
                                            <option key={s} value={s}>
                                                {s.charAt(0).toUpperCase() + s.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => loadLeads(p)}
                            className={`w-9 h-9 rounded-xl text-sm font-semibold ${p === pagination.page ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
