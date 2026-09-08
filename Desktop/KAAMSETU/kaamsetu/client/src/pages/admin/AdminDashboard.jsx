import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, CreditCard, TrendingUp, CheckCircle, DollarSign } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

const StatCard = ({ icon: Icon, label, value, color, bg, link }) => (
    <Link to={link || '#'} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow flex items-center gap-4">
        <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <Icon size={20} className={color} />
        </div>
        <div>
            <p className="text-2xl font-black text-gray-900">{typeof value === 'number' ? value.toLocaleString() : value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    </Link>
);

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get('/admin/stats');
                setStats(res.data.data);
            } catch { }
            setLoading(false);
        };
        load();
    }, []);

    if (loading) return <Loader />;
    if (!stats) return null;

    return (
        <div className="p-6 md:p-8 space-y-6">
            <div>
                <h1 className="text-2xl font-black text-gray-900">Admin Overview</h1>
                <p className="text-gray-500 text-sm mt-1">Platform statistics and management</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard icon={Users} label="Total Users" value={stats.totalUsers} bg="bg-blue-50" color="text-blue-600" link="/admin/users" />
                <StatCard icon={Building2} label="Total Businesses" value={stats.totalBusinesses} bg="bg-primary-50" color="text-primary-600" link="/admin/businesses" />
                <StatCard icon={CheckCircle} label="Published" value={stats.publishedBusinesses} bg="bg-green-50" color="text-green-600" link="/admin/businesses" />
                <StatCard icon={TrendingUp} label="Paid Businesses" value={stats.paidBusinesses} bg="bg-purple-50" color="text-purple-600" link="/admin/businesses" />
                <StatCard icon={DollarSign} label="Monthly Revenue" value={`₹${(stats.monthlyRevenue || 0).toLocaleString()}`} bg="bg-yellow-50" color="text-yellow-600" link="/admin/payments" />
                <StatCard icon={CreditCard} label="Payments" value="View All" bg="bg-orange-50" color="text-orange-600" link="/admin/payments" />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent businesses */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-bold text-gray-900">Recent Businesses</h2>
                        <Link to="/admin/businesses" className="text-primary-600 text-sm font-semibold hover:underline">View all</Link>
                    </div>
                    <div className="space-y-3">
                        {(stats.recentBusinesses || []).slice(0, 6).map((b) => (
                            <div key={b._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">{b.name}</p>
                                    <p className="text-xs text-gray-400">{b.owner?.name} · {b.category}</p>
                                </div>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${b.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {b.isPublished ? 'Live' : 'Draft'}
                                </span>
                            </div>
                        ))}
                        {!stats.recentBusinesses?.length && <p className="text-sm text-gray-400 text-center py-4">No businesses yet</p>}
                    </div>
                </div>

                {/* Recent payments */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-bold text-gray-900">Recent Payments</h2>
                        <Link to="/admin/payments" className="text-primary-600 text-sm font-semibold hover:underline">View all</Link>
                    </div>
                    <div className="space-y-3">
                        {(stats.recentPayments || []).slice(0, 6).map((p) => (
                            <div key={p._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">{p.user?.name}</p>
                                    <p className="text-xs text-gray-400">{p.plan} · {new Date(p.createdAt).toLocaleDateString('en-IN')}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-primary-600 text-sm">₹{p.amount}</p>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {p.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {!stats.recentPayments?.length && <p className="text-sm text-gray-400 text-center py-4">No payments yet</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
