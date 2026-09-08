import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, MessageCircle, Phone, Users, QrCode, Building2, ArrowRight, TrendingUp } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="card flex items-center gap-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <Icon size={20} />
        </div>
        <div>
            <p className="text-2xl font-black text-gray-900">{value?.toLocaleString() ?? 0}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    </div>
);

export default function DashboardHome() {
    const [business, setBusiness] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [bRes, aRes, lRes] = await Promise.all([
                    api.get('/businesses/my'),
                    api.get('/analytics?period=30').catch(() => ({ data: { data: {} } })),
                    api.get('/leads?limit=5').catch(() => ({ data: { data: { leads: [] } } })),
                ]);
                setBusiness(bRes.data.data.business);
                setAnalytics(aRes.data.data);
                setLeads(lRes.data.data.leads || []);
            } catch {
                // Business might not exist yet
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <Loader text="Loading dashboard..." />;

    // No business yet
    if (!business) {
        return (
            <div className="p-6 md:p-8 max-w-2xl mx-auto">
                <div className="card text-center py-16">
                    <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Building2 size={32} className="text-primary-600" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 mb-3">Welcome to KaamSetu!</h1>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                        Let's create your professional business page. It takes less than 10 minutes.
                    </p>
                    <Link to="/dashboard/business/setup">
                        <Button size="lg">
                            Create My Business <ArrowRight size={16} />
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const completionFields = ['name', 'description', 'phone', 'address', 'logo'];
    const completed = completionFields.filter((f) => business[f]).length;
    const completionPct = Math.round((completed / completionFields.length) * 100);

    return (
        <div className="p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">{business.name}</h1>
                    <p className="text-gray-500 text-sm mt-1">{business.category} · {business.city || 'Location not set'}</p>
                </div>
                <div className="flex gap-3">
                    {business.isPublished ? (
                        <a href={`/business/${business.slug}`} target="_blank" rel="noreferrer">
                            <Button variant="secondary" size="sm">View Page</Button>
                        </a>
                    ) : (
                        <Link to="/dashboard/business">
                            <Button size="sm">Publish Business</Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Profile completion */}
            {completionPct < 100 && (
                <div className="card bg-primary-50 border-primary-200">
                    <div className="flex items-center justify-between mb-3">
                        <p className="font-semibold text-primary-800">Complete your profile — {completionPct}%</p>
                        <Link to="/dashboard/business" className="text-primary-600 text-sm font-semibold hover:underline">
                            Complete now
                        </Link>
                    </div>
                    <div className="w-full bg-primary-100 rounded-full h-2">
                        <div
                            className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${completionPct}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Eye} label="Page Views (30d)" value={analytics?.counts?.page_view} color="bg-blue-50 text-blue-600" />
                <StatCard icon={MessageCircle} label="WhatsApp Clicks" value={analytics?.counts?.whatsapp_click} color="bg-green-50 text-green-600" />
                <StatCard icon={Phone} label="Phone Clicks" value={analytics?.counts?.phone_click} color="bg-purple-50 text-purple-600" />
                <StatCard icon={Users} label="Enquiries" value={analytics?.counts?.enquiry} color="bg-orange-50 text-orange-600" />
            </div>

            {/* Plan banner */}
            {business.subscription?.plan === 'FREE' && (
                <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-bold text-lg">Upgrade to STARTER</p>
                            <p className="text-primary-100 text-sm mt-1">Remove branding, add gallery, QR code and more — just ₹499/year</p>
                        </div>
                        <Link to="/dashboard/subscription">
                            <Button className="bg-white text-primary-700 hover:bg-primary-50 flex-shrink-0" size="sm">
                                Upgrade
                            </Button>
                        </Link>
                    </div>
                </div>
            )}

            {/* Recent enquiries */}
            <div className="card">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="font-bold text-gray-900">Recent Enquiries</h2>
                    <Link to="/dashboard/leads" className="text-primary-600 text-sm font-semibold hover:underline flex items-center gap-1">
                        View all <ArrowRight size={14} />
                    </Link>
                </div>
                {leads.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <Users size={28} className="mx-auto mb-2 opacity-40" />
                        <p className="text-sm">No enquiries yet. Share your business page to get started!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {leads.map((lead) => (
                            <div key={lead._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">{lead.name}</p>
                                    <p className="text-xs text-gray-500">{lead.phone} · {new Date(lead.createdAt).toLocaleDateString('en-IN')}</p>
                                </div>
                                <span className={`badge-${lead.status === 'new' ? 'green' : 'gray'}`}>
                                    {lead.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { to: '/dashboard/services', icon: TrendingUp, label: 'Add Services', color: 'bg-blue-50 text-blue-600' },
                    { to: '/dashboard/gallery', icon: Eye, label: 'Add Photos', color: 'bg-pink-50 text-pink-600' },
                    { to: '/dashboard/qr', icon: QrCode, label: 'Download QR', color: 'bg-purple-50 text-purple-600' },
                    { to: '/dashboard/analytics', icon: BarChart3Icon, label: 'Analytics', color: 'bg-orange-50 text-orange-600' },
                ].map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link key={item.to} to={item.to} className="card hover:shadow-md transition-shadow text-center p-5">
                            <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                                <Icon size={18} />
                            </div>
                            <p className="text-sm font-semibold text-gray-700">{item.label}</p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

function BarChart3Icon(props) {
    return <TrendingUp {...props} />;
}
