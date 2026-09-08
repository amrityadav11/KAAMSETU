import React, { useEffect, useState } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Eye, MessageCircle, Phone, Users, QrCode, TrendingUp } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

const PERIODS = [
    { label: '7 Days', value: '7' },
    { label: '30 Days', value: '30' },
    { label: '90 Days', value: '90' },
];

const StatBox = ({ icon: Icon, label, value, color, bg }) => (
    <div className="card">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon size={20} className={color} />
            </div>
            <div>
                <p className="text-2xl font-black text-gray-900">{value?.toLocaleString() ?? 0}</p>
                <p className="text-sm text-gray-500">{label}</p>
            </div>
        </div>
    </div>
);

export default function Analytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('30');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/analytics?period=${period}`);
                setData(res.data.data);
            } catch { }
            setLoading(false);
        };
        load();
    }, [period]);

    if (loading) return <Loader text="Loading analytics..." />;
    if (!data) return null;

    const { counts, conversionRate, chartData, businessStats } = data;

    // Format chart data for recharts
    const formattedChart = (chartData || []).map((d) => ({
        date: new Date(d._id).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        Views: d.count,
    }));

    return (
        <div className="p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Analytics</h1>
                    <p className="text-gray-500 text-sm mt-1">Track how customers interact with your page</p>
                </div>
                <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                    {PERIODS.map((p) => (
                        <button
                            key={p.value}
                            onClick={() => setPeriod(p.value)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${period === p.value ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <StatBox icon={Eye} label={`Page Views (${period}d)`} value={counts.page_view} bg="bg-blue-50" color="text-blue-600" />
                <StatBox icon={MessageCircle} label="WhatsApp Clicks" value={counts.whatsapp_click} bg="bg-green-50" color="text-green-600" />
                <StatBox icon={Phone} label="Phone Clicks" value={counts.phone_click} bg="bg-purple-50" color="text-purple-600" />
                <StatBox icon={Users} label="Enquiries" value={counts.enquiry} bg="bg-orange-50" color="text-orange-600" />
                <StatBox icon={QrCode} label="QR Scans" value={counts.qr_scan} bg="bg-pink-50" color="text-pink-600" />
                <div className="card">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                            <TrendingUp size={20} className="text-primary-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-gray-900">{conversionRate}%</p>
                            <p className="text-sm text-gray-500">Conversion Rate</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Page views chart */}
            <div className="card">
                <h2 className="font-bold text-gray-900 mb-6">Page Views Over Time</h2>
                {formattedChart.length > 0 ? (
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={formattedChart}>
                            <defs>
                                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                itemStyle={{ color: '#16a34a', fontWeight: 600 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="Views"
                                stroke="#16a34a"
                                strokeWidth={2.5}
                                fill="url(#viewsGradient)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-48 text-gray-400">
                        <p className="text-sm">No data for this period yet</p>
                    </div>
                )}
            </div>

            {/* All-time totals */}
            <div className="card">
                <h2 className="font-bold text-gray-900 mb-4">All-Time Totals</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Views', value: businessStats.totalViews },
                        { label: 'WhatsApp Clicks', value: businessStats.totalWhatsappClicks },
                        { label: 'Phone Clicks', value: businessStats.totalPhoneClicks },
                        { label: 'Enquiries', value: businessStats.totalEnquiries },
                    ].map((s) => (
                        <div key={s.label} className="text-center p-4 bg-gray-50 rounded-xl">
                            <p className="text-2xl font-black text-primary-600">{(s.value || 0).toLocaleString()}</p>
                            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
